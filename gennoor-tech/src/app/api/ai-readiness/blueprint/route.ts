import { NextRequest, NextResponse } from 'next/server'
import { AzureOpenAI } from 'openai'
import { TableClient } from '@azure/data-tables'
import { isEmailVerified } from '@/lib/otp-store'

export const maxDuration = 120

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
  let assistantId: string | null = null
  let client: AzureOpenAI | null = null

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

    client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: '2024-12-01-preview',
    })

    // Create assistant with code interpreter
    const assistant = await client.beta.assistants.create({
      model: deployment,
      name: 'AI Readiness Blueprint Agent',
      instructions: `You are an elite AI readiness consultant. You analyze a person's role, industry, quiz answers, and open-ended response to produce a comprehensive, premium-quality AI Readiness Blueprint report.

Your analysis must be deeply personalized — reference specific answers, role context, and industry nuances. No generic advice.

When generating the report, follow this structure:

1. EXECUTIVE SUMMARY: Provide an overall AI readiness score (0-100) with a punchy headline and 3-4 sentence summary of their position.

2. ROLE-SPECIFIC ANALYSIS: Analyze how AI impacts their specific role ("${role}") in the "${category}" industry${subcategory ? ` (${subcategory})` : ''}. What tasks can be automated? What skills become more valuable?

3. VISUALIZATIONS: Use Python and matplotlib to create exactly 2 charts in a SINGLE code block, saving each as a separate PNG file:
   a) RADAR CHART: Score across 6 readiness dimensions (AI Knowledge, Technical Skills, Strategic Thinking, Adaptability, Tool Proficiency, Data Literacy). Filled polygon style. Colors: #6366f1 fill, #818cf8 line. Figure size 10x8.
   b) SKILL GAP HEATMAP: Current vs required skill levels across 8 relevant skills for their role. Use imshow with RdYlGn colormap. Figure size 10x6.

   Chart style: dark background (#1e1e2e), light text (#e2e8f0), no spines, dpi=150, bbox_inches='tight'.
   IMPORTANT: Generate both charts in ONE code execution to save time.

4. 90-DAY IMPLEMENTATION ROADMAP: Three phases with specific milestones:
   - Phase 1 (Days 1-30): Foundation — specific tools to learn, habits to build
   - Phase 2 (Days 31-60): Acceleration — intermediate applications, workflow changes
   - Phase 3 (Days 61-90): Mastery — advanced integration, measurable outcomes

5. TOOL RECOMMENDATIONS: List 5-7 specific AI tools relevant to their role + industry with:
   - Tool name
   - What it does for their specific role
   - Estimated time saved per week
   - Learning curve (Easy/Medium/Hard)

6. ROI PROJECTION: Estimate quantifiable benefits:
   - Hours saved per week
   - Productivity increase percentage
   - Estimated annual value (in time or money)
   - Break-even timeline for learning investment

7. RISK ASSESSMENT: Key risks of NOT adopting AI:
   - Competitive risk
   - Skill obsolescence risk
   - Opportunity cost
   - Industry disruption timeline

After the full narrative report, output a JSON block wrapped in \`\`\`json ... \`\`\` tags with this exact structure:
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
  "sections": [
    { "title": "...", "content": "...", "type": "executive|analysis|roadmap|tools|roi|risk" }
  ],
  "tools": [
    { "name": "...", "purpose": "...", "timeSaved": "...", "difficulty": "Easy|Medium|Hard" }
  ],
  "roadmap": {
    "phase1": { "title": "...", "milestones": ["..."] },
    "phase2": { "title": "...", "milestones": ["..."] },
    "phase3": { "title": "...", "milestones": ["..."] }
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
}`,
      tools: [{ type: 'code_interpreter' }],
    })

    assistantId = assistant.id

    // Create thread and add message
    const thread = await client.beta.threads.create()

    const answersFormatted = Object.entries(answers as Record<string, string>)
      .map(([q, a]) => `- ${q}: ${a}`)
      .join('\n')

    await client.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Generate a comprehensive AI Readiness Blueprint for this person:

Name: ${name || 'Not provided'}
Email: ${email}
Role: ${role || 'Not specified'}
Industry: ${category || 'Not specified'}${subcategory ? ` > ${subcategory}` : ''}

Their quiz answers:
${answersFormatted}

Their open-ended response about AI goals and challenges:
${openEnded || 'Not provided'}

Please create the full blueprint report with all 4 visualizations (radar chart, industry comparison, timeline roadmap, skill gap heatmap), the detailed narrative analysis, and the structured JSON summary at the end.`,
    })

    // Create run
    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      max_completion_tokens: 16000,
    })

    // Poll for completion (2s intervals, max ~100s to leave room for post-processing)
    let runStatus = run
    let pollCount = 0
    const maxPolls = 50

    while (pollCount < maxPolls) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      pollCount++

      runStatus = await client.beta.threads.runs.retrieve(run.id, { thread_id: thread.id })

      if (runStatus.status === 'completed') break
      if (
        runStatus.status === 'failed' ||
        runStatus.status === 'cancelled' ||
        runStatus.status === 'expired'
      ) {
        throw new Error(
          `Assistant run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`,
        )
      }
    }

    if (runStatus.status !== 'completed') {
      throw new Error('Assistant run timed out after 100 seconds')
    }

    // Retrieve messages
    const messages = await client.beta.threads.messages.list(thread.id, { order: 'desc' })

    let reportText = ''
    const charts: string[] = []

    // Process assistant messages
    for (const msg of messages.data) {
      if (msg.role !== 'assistant') continue

      for (const block of msg.content) {
        if (block.type === 'text') {
          reportText += block.text.value + '\n'
        } else if (block.type === 'image_file') {
          // Download image and convert to base64
          try {
            const fileId = block.image_file.file_id
            const fileResponse = await client.files.content(fileId)
            const arrayBuffer = await fileResponse.arrayBuffer()
            const base64 = Buffer.from(arrayBuffer).toString('base64')
            charts.push(`data:image/png;base64,${base64}`)
          } catch (imgErr) {
            console.error('Failed to download chart image:', imgErr)
          }
        }
      }
    }

    // Parse structured JSON from the response
    let blueprintData: any = {}
    const jsonMatch = reportText.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      try {
        blueprintData = JSON.parse(jsonMatch[1])
      } catch (parseErr) {
        console.error('Failed to parse blueprint JSON:', parseErr)
      }
    }

    const score = blueprintData.score || 0
    const headline = blueprintData.headline || 'Your AI Readiness Blueprint'
    const summary = blueprintData.summary || ''

    // Generate TTS narration for the executive summary
    const narrationText = summary || `${name ? name + ', here' : 'Here'} is your AI readiness blueprint. Your overall score is ${score} out of 100. ${headline}.`
    const narrationAudio = await generateTTS(narrationText)

    // Save to Azure Table Storage
    await saveBlueprint(
      email,
      name || '',
      role || '',
      category || '',
      subcategory || '',
      score,
      JSON.stringify(blueprintData),
    )

    // Clean up: delete the assistant
    try {
      await client.beta.assistants.delete(assistant.id)
      assistantId = null
    } catch (cleanupErr) {
      console.error('Failed to delete assistant:', cleanupErr)
    }

    return NextResponse.json({
      success: true,
      blueprint: {
        score,
        headline,
        summary,
        sections: blueprintData.sections || [],
        dimensions: blueprintData.dimensions || {},
        tools: blueprintData.tools || [],
        roadmap: blueprintData.roadmap || {},
        roi: blueprintData.roi || {},
        risks: blueprintData.risks || [],
        charts,
        narrationAudio: narrationAudio || null,
        fullReport: reportText,
      },
    })
  } catch (err: any) {
    console.error('Blueprint generation error:', err)

    // Clean up assistant on error
    if (client && assistantId) {
      try {
        await client.beta.assistants.delete(assistantId)
      } catch (cleanupErr) {
        console.error('Failed to delete assistant on error:', cleanupErr)
      }
    }

    return NextResponse.json(
      { error: err.message || 'Blueprint generation failed' },
      { status: 500 },
    )
  }
}
