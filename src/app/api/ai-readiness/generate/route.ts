import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { isEmailVerified } from '@/lib/otp-store'

const OPENAI_ENDPOINT = process.env.AZURE_OPENAI_READINESS_ENDPOINT || ''
const OPENAI_KEY = process.env.AZURE_OPENAI_READINESS_KEY || ''
const OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_READINESS_DEPLOYMENT || 'gpt-41-mini'
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY || ''
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'centralindia'

function getTableClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(connStr, 'AIReadinessReports')
}

async function generateReport(answers: Record<string, string>, email: string, name: string) {
  const url = `${OPENAI_ENDPOINT}openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-12-01-preview`

  const systemPrompt = `You are an AI readiness analyst for Gennoor Tech. You analyze quiz answers and produce a brutally honest, personalized AI readiness report. Be direct, insightful, and specific. Reference the user's actual answers. No generic advice. No corporate fluff.

Return ONLY valid JSON with this exact structure:
{
  "headline": "A punchy 5-8 word headline about their situation",
  "score": number 0-100,
  "verdict": "One sentence honest verdict about where they stand",
  "strengthStatement": "2 sentences about what they're already doing right. Be specific. Reference their answers.",
  "realityCheck": "One uncomfortable but helpful truth about their current situation. Be specific.",
  "timeWasted": "Estimated hours per week they're losing to manual work that AI could handle. Give a specific number like '8-12 hours/week'",
  "pillars": [
    {"name": "Mindset", "score": number 0-100, "insight": "One sentence"},
    {"name": "Skills", "score": number 0-100, "insight": "One sentence"},
    {"name": "Workflow", "score": number 0-100, "insight": "One sentence"},
    {"name": "Readiness", "score": number 0-100, "insight": "One sentence"}
  ],
  "quickWin": {
    "title": "One specific action they can take",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "timeframe": "e.g. This week, 45 minutes",
    "expectedResult": "What they'll gain from doing this"
  },
  "mondayBefore": ["4 bullet points describing their current Monday morning based on answers"],
  "mondayAfter": ["4 bullet points describing Monday with AI based on their situation"],
  "industryInsight": "2-3 sentences about AI adoption in their specific industry. Include a real statistic or trend.",
  "peerComparison": "One sentence comparing them to others in similar roles/industries who are already using AI",
  "thirtyDayPlan": [
    "Week 1: specific action",
    "Week 2: specific action",
    "Week 3-4: specific action"
  ],
  "voiceSummary": "A 3-4 sentence spoken summary of the report for TTS. Conversational tone, like you're talking directly to them. Use their name if provided."
}`

  const userMessage = `Analyze this person's AI readiness:

Name: ${name || 'Not provided'}
Email: ${email}

Their answers:
- Who they are: ${answers.persona}
- Industry: ${answers.industry}
- Monday morning scenario: ${answers.monday}
- Reaction to competitor speed: ${answers.competitor}
- Biggest time drain: ${answers.timeDrain}
- AI skill level: ${answers.skillLevel}
- What they'd do with extra time: ${answers.extraTime}

Generate a personalized, insightful report. Be specific to THEIR situation. No generic advice.`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': OPENAI_KEY,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('No content in OpenAI response')

  return JSON.parse(content)
}

async function generateSpeech(text: string): Promise<string> {
  if (!SPEECH_KEY || !SPEECH_REGION) return ''

  const url = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
    <voice name='en-US-JennyMultilingualNeural'>
      <prosody rate='+5%' pitch='+2%'>
        ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </prosody>
    </voice>
  </speak>`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    })

    if (!response.ok) return ''

    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer).toString('base64')
  } catch {
    return ''
  }
}

async function saveReport(email: string, name: string, answers: Record<string, string>, report: any) {
  try {
    const client = getTableClient()
    await client.createTable().catch(() => {})

    const now = new Date()
    const partitionKey = now.toISOString().slice(0, 10)
    const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

    await client.createEntity({
      partitionKey,
      rowKey,
      email,
      name: name || '',
      persona: answers.persona || '',
      industry: answers.industry || '',
      monday: answers.monday || '',
      competitor: answers.competitor || '',
      timeDrain: answers.timeDrain || '',
      skillLevel: answers.skillLevel || '',
      extraTime: answers.extraTime || '',
      overallScore: report.score || 0,
      headline: report.headline || '',
      verdict: report.verdict || '',
      reportJson: JSON.stringify(report),
      generatedAt: now.toISOString(),
    })
  } catch (err) {
    console.error('Failed to save report:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, answers } = await request.json()

    if (!email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!isEmailVerified(email)) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 401 })
    }

    if (!OPENAI_ENDPOINT || !OPENAI_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const report = await generateReport(answers, email, name)

    let audioBase64 = ''
    if (report.voiceSummary) {
      audioBase64 = await generateSpeech(report.voiceSummary)
    }

    await saveReport(email, name, answers, report)

    return NextResponse.json({
      success: true,
      report,
      audio: audioBase64 || null,
    })
  } catch (err: any) {
    console.error('Generate report error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to generate report' },
      { status: 500 },
    )
  }
}
