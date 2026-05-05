import { NextRequest, NextResponse } from 'next/server'
import { AzureOpenAI } from 'openai'
import { TableClient } from '@azure/data-tables'
import { isEmailVerified } from '@/lib/otp-store'

export const maxDuration = 60

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY || ''
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'centralindia'

function getTableClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(connStr, 'AIReadinessBlueprints')
}

async function generateTTS(text: string, voice = 'en-US-AndrewMultilingualNeural'): Promise<string> {
  if (!SPEECH_KEY) return ''
  const url = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-US'>
    <voice name='${voice}'>
      <mstts:express-as style='cheerful'>
        <prosody rate='-3%'>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</prosody>
      </mstts:express-as>
    </voice>
  </speak>`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: ssml,
    })
    if (!res.ok) return ''
    const buf = await res.arrayBuffer()
    return Buffer.from(buf).toString('base64')
  } catch {
    return ''
  }
}

async function saveBlueprint(
  email: string,
  name: string,
  role: string,
  category: string,
  subcategory: string,
  overallScore: number,
  reportSummary: string,
) {
  try {
    const client = getTableClient()
    await client.createTable().catch(() => {})
    const now = new Date()
    await client.createEntity({
      partitionKey: now.toISOString().slice(0, 10),
      rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: name || '',
      role: role || '',
      category: category || '',
      subcategory: subcategory || '',
      overallScore,
      reportSummary: reportSummary.slice(0, 30000),
      generatedAt: now.toISOString(),
    })
  } catch (err) {
    console.error('Save blueprint error:', err)
  }
}

export async function POST(request: NextRequest) {
  const deployment = process.env.AZURE_OPENAI_READINESS_DEPLOYMENT_MAIN || 'gpt-54'

  try {
    const { email, name, role, category, subcategory, answers, openEnded } = await request.json()

    if (!email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!isEmailVerified(email)) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 401 })
    }

    const endpoint = process.env.AZURE_OPENAI_READINESS_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_READINESS_KEY
    if (!endpoint || !apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: '2024-12-01-preview',
    })

    const answersFormatted = Object.entries(answers as Record<string, string>)
      .map(([q, a]) => `- ${q}: ${a}`)
      .join('\n')

    const systemPrompt = `You are an elite AI readiness consultant. Analyze the person's role, industry, quiz answers, and open-ended response to produce a deeply personalized AI Readiness Blueprint. Reference their specific answers — no generic advice.

Respond with ONLY valid JSON (no markdown, no code fences, no extra text). Use this exact structure:

{
  "score": <number 0-100>,
  "headline": "<5-8 word punchy headline>",
  "summary": "<3-4 sentence executive summary>",
  "dimensions": {
    "aiKnowledge": <0-100>,
    "technicalSkills": <0-100>,
    "strategicThinking": <0-100>,
    "adaptability": <0-100>,
    "toolProficiency": <0-100>,
    "dataLiteracy": <0-100>
  },
  "skillGap": [
    { "skill": "<skill name>", "current": <0-100>, "required": <0-100> }
  ],
  "sections": [
    { "title": "...", "content": "...", "type": "executive|analysis|roadmap|tools|roi|risk" }
  ],
  "tools": [
    { "name": "...", "purpose": "...", "timeSaved": "...", "difficulty": "Easy|Medium|Hard" }
  ],
  "roadmap": {
    "phase1": { "title": "Foundation (Days 1-30)", "milestones": ["..."] },
    "phase2": { "title": "Acceleration (Days 31-60)", "milestones": ["..."] },
    "phase3": { "title": "Mastery (Days 61-90)", "milestones": ["..."] }
  },
  "roi": {
    "hoursSavedPerWeek": <number>,
    "productivityIncrease": "<percentage>",
    "annualValue": "<dollar amount>",
    "breakEvenWeeks": <number>
  },
  "risks": [
    { "type": "...", "severity": "High|Medium|Low", "description": "..." }
  ]
}

Requirements:
- "dimensions": Score across 6 AI readiness dimensions based on their answers
- "skillGap": 8 skills relevant to their role with current vs required levels
- "sections": 6 sections covering executive summary, role-specific analysis, 90-day roadmap, tool recommendations, ROI projection, risk assessment. Content should be detailed paragraphs, not bullet points.
- "tools": 5-7 specific AI tools relevant to their role + industry
- "roadmap": Three phases with 3-4 specific milestones each
- "risks": 3-4 key risks of NOT adopting AI
- Be brutally honest, not salesy. Genuine insights only.`

    const userMessage = `Generate a comprehensive AI Readiness Blueprint for:

Name: ${name || 'Not provided'}
Role: ${role || 'Not specified'}
Industry: ${category || 'Not specified'}${subcategory ? ` > ${subcategory}` : ''}

Quiz answers:
${answersFormatted}

Their open-ended response:
${openEnded || 'Not provided'}`

    const response = await client.chat.completions.create({
      model: deployment,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_completion_tokens: 8000,
      temperature: 0.7,
    })

    const raw = response.choices[0]?.message?.content || ''

    let blueprintData: any = {}
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
      blueprintData = JSON.parse(cleaned)
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try { blueprintData = JSON.parse(jsonMatch[0]) } catch { /* noop */ }
      }
    }

    if (!blueprintData.score) {
      return NextResponse.json({ error: 'Failed to generate blueprint — please retry' }, { status: 500 })
    }

    const score = blueprintData.score
    const summary = blueprintData.summary || ''
    const narrationText = summary || `${name ? name + ', here' : 'Here'} is your AI readiness blueprint. Your overall score is ${score} out of 100. ${blueprintData.headline || ''}.`
    const narrationAudio = await generateTTS(narrationText)

    await saveBlueprint(email, name || '', role || '', category || '', subcategory || '', score, JSON.stringify(blueprintData))

    return NextResponse.json({
      success: true,
      blueprint: {
        score,
        headline: blueprintData.headline || 'Your AI Readiness Blueprint',
        summary,
        dimensions: blueprintData.dimensions || {},
        skillGap: blueprintData.skillGap || [],
        sections: blueprintData.sections || [],
        tools: blueprintData.tools || [],
        roadmap: blueprintData.roadmap || {},
        roi: blueprintData.roi || {},
        risks: blueprintData.risks || [],
        narrationAudio: narrationAudio || null,
      },
    })
  } catch (err: any) {
    console.error('Blueprint generation error:', err)
    return NextResponse.json(
      { error: err.message || 'Blueprint generation failed' },
      { status: 500 },
    )
  }
}
