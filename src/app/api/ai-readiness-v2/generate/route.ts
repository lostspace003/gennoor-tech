import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { isEmailVerified } from '@/lib/otp-store'

const OPENAI_ENDPOINT = process.env.AZURE_OPENAI_READINESS_ENDPOINT || ''
const OPENAI_KEY = process.env.AZURE_OPENAI_READINESS_KEY || ''
const DEPLOYMENT = process.env.AZURE_OPENAI_READINESS_DEPLOYMENT_MAIN || 'gpt-54'
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY || ''
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'centralindia'

function getTableClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(connStr, 'AIReadinessReports')
}

async function callGPT(messages: any[], jsonMode = true, retries = 2): Promise<string> {
  const url = `${OPENAI_ENDPOINT}openai/deployments/${DEPLOYMENT}/chat/completions?api-version=2024-12-01-preview`

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const body: any = { messages, temperature: 0.7, max_completion_tokens: 4000 }
      if (jsonMode) body.response_format = { type: 'json_object' }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': OPENAI_KEY },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.text()
        if (attempt < retries) continue
        throw new Error(`OpenAI ${res.status}: ${err}`)
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) {
        if (attempt < retries) continue
        throw new Error('Empty response from model')
      }
      return content
    } catch (e) {
      if (attempt >= retries) throw e
    }
  }
  throw new Error('All retries failed')
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

async function saveReport(email: string, name: string, answers: Record<string, string>, presentation: any) {
  try {
    const client = getTableClient()
    await client.createTable().catch(() => {})
    const now = new Date()
    await client.createEntity({
      partitionKey: now.toISOString().slice(0, 10),
      rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: name || '',
      reportType: 'deep-dive',
      persona: answers.persona || '',
      industry: answers.industry || '',
      overallScore: presentation.score || 0,
      headline: presentation.headline || '',
      slideCount: presentation.slides?.length || 0,
      presentationJson: JSON.stringify(presentation).slice(0, 30000),
      generatedAt: now.toISOString(),
    })
  } catch (err) {
    console.error('Save report error:', err)
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

    const transcriptPrompt = `You are a brilliant AI readiness consultant. Analyze this person's answers and create a presentation transcript — a narrative that walks them through their AI readiness report like a personal consultant speaking directly to them.

Person's answers:
- Who they are: ${answers.persona}
- Industry: ${answers.industry}
- Monday scenario: ${answers.monday}
- Competitor reaction: ${answers.competitor}
- Biggest time drain: ${answers.timeDrain}
- AI skill level: ${answers.skillLevel}
- How they learn: ${answers.learning}
- What's blocking them: ${answers.blockers}
- Success in 90 days: ${answers.investment}
- What they'd do with extra time: ${answers.extraTime}
- Name: ${name || 'there'}

Return JSON:
{
  "score": number 0-100,
  "headline": "5-8 word punchy headline",
  "slides": [
    {
      "id": 0,
      "title": "Slide title",
      "type": "score|strength|reality|pillars|monday|quickwin|plan|cta",
      "narration": "What the voice says for this slide (2-4 sentences, conversational, direct, use their name)",
      "content": { ...slide-specific structured data }
    }
  ]
}

Create exactly 8 slides:
1. SCORE — Overall score reveal with headline and one-line verdict
   content: { "score": number, "headline": "...", "verdict": "one sentence" }

2. STRENGTH — What they're doing right (reference their actual answers)
   content: { "statement": "2-3 sentences, specific to their answers" }

3. REALITY — The uncomfortable truth + time wasted estimate
   content: { "truth": "one hard-hitting sentence", "timeWasted": "X-Y hours/week", "impact": "what that means annually" }

4. PILLARS — 4 readiness dimensions with scores
   content: { "pillars": [{"name": "Mindset", "score": 0-100, "insight": "..."}, {"name": "Skills", ...}, {"name": "Workflow", ...}, {"name": "Readiness", ...}] }

5. MONDAY — Before vs After comparison
   content: { "before": ["4 bullets of current Monday"], "after": ["4 bullets of Monday with AI"] }

6. QUICKWIN — One concrete action they can take this week
   content: { "title": "...", "steps": ["step1", "step2", "step3"], "timeframe": "...", "result": "what they'll gain" }

7. PLAN — 30-day roadmap
   content: { "weeks": [{"period": "Week 1", "action": "..."}, {"period": "Week 2", "action": "..."}, {"period": "Week 3-4", "action": "..."}] }

8. CTA — Industry insight + peer comparison + call to action
   content: { "industryInsight": "2 sentences", "peerComparison": "1 sentence", "cta": "invitation to discuss" }

Make narrations conversational, warm, direct. Like a smart consultant talking to a friend. Reference their specific answers. No corporate jargon. No service pitches. Genuine insights only.`

    const transcriptRaw = await callGPT([
      { role: 'system', content: transcriptPrompt },
      { role: 'user', content: 'Generate the presentation now.' },
    ])

    const presentation = JSON.parse(transcriptRaw)

    const slidesWithAudio = await Promise.all(
      presentation.slides.map(async (slide: any) => {
        const audio = await generateTTS(slide.narration)
        return { ...slide, audio }
      })
    )

    presentation.slides = slidesWithAudio

    await saveReport(email, name, answers, presentation)

    return NextResponse.json({ success: true, presentation })
  } catch (err: any) {
    console.error('Generate V2 error:', err)
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}
