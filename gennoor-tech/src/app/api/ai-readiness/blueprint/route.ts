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
      headers: { 'Ocp-Apim-Subscription-Key': SPEECH_KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3' },
      body: ssml,
    })
    if (!res.ok) return ''
    const buf = await res.arrayBuffer()
    return Buffer.from(buf).toString('base64')
  } catch { return '' }
}

async function saveBlueprint(
  email: string, name: string, role: string, category: string, subcategory: string,
  overallScore: number, headline: string, answers: Record<string, string>, openEnded: string,
  dimensions: any, reportSummary: string, agentsUsed: string[], referencesCount: number,
) {
  try {
    const client = getTableClient()
    await client.createTable().catch(() => {})
    const now = new Date()
    await client.createEntity({
      partitionKey: now.toISOString().slice(0, 10),
      rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      email, name: name || '', reportType: 'blueprint',
      role: role || '', category: category || '', subcategory: subcategory || '',
      overallScore, headline: headline || '',
      answersJson: JSON.stringify(answers).slice(0, 30000),
      openEnded: (openEnded || '').slice(0, 30000),
      dimensionsJson: JSON.stringify(dimensions || {}),
      reportSummary: reportSummary.slice(0, 30000),
      agentsUsed: agentsUsed.join(', '),
      referencesCount,
      generatedAt: now.toISOString(),
    })
  } catch (err) { console.error('Save blueprint error:', err) }
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

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion: '2024-12-01-preview' })

    const answersFormatted = Object.entries(answers as Record<string, string>)
      .map(([q, a]) => `- ${q}: ${a}`).join('\n')

    const currentTools = answers['current-tools'] || ''
    const approvedAI = answers['approved-ai'] || ''
    const toolPriority = answers['tool-priority'] || ''

    const userContext = `Name: ${name || 'Not provided'}\nRole: ${role || 'Not specified'}\nIndustry: ${category || 'Not specified'}${subcategory ? ` > ${subcategory}` : ''}\nCurrent tools/stack: ${currentTools || 'Not specified'}\nApproved AI tools: ${approvedAI || 'Not specified'}\nTool selection priority: ${toolPriority || 'Not specified'}\n\nQuiz answers:\n${answersFormatted}\n\nOpen-ended response:\n${openEnded || 'Not provided'}`

    // ═══════════════════════════════════════════════════════════
    // AGENT 1: Industry Research (Bing Web Search grounding)
    // ═══════════════════════════════════════════════════════════
    let researchData = ''
    let references: { url: string; title: string }[] = []

    try {
      const researchResponse = await client.responses.create({
        model: deployment,
        tools: [{ type: 'web_search' as any }],
        input: `Research the latest AI adoption trends, statistics, and recommended AI tools for someone in the "${category || 'technology'}${subcategory ? ' > ' + subcategory : ''}" industry who works as a "${role || 'professional'}".${currentTools ? ` They currently use: ${currentTools}.` : ''}${approvedAI ? ` Their organization has approved: ${approvedAI}.` : ''}

Find:
1. Current AI adoption rate and statistics for this specific industry (2024-2025 data) — cite the source reports/articles
2. Top 5-7 specific AI tools that are most relevant for this role and industry (with their actual website URLs), considering tools that integrate with their existing stack
3. Average ROI/productivity gains reported by companies in this sector after AI adoption — cite the studies
4. Key risks or challenges of NOT adopting AI in this industry — cite analyst reports
5. Any relevant case studies or success stories with source links
6. Industry reports, analyst findings, or surveys about AI readiness in this field

Be specific with real data, real tool names, real URLs. Cite as many sources as possible. No generic advice.`,
      } as any)

      const output = (researchResponse as any).output || []
      const textParts: string[] = []
      for (const item of output) {
        if (item.type === 'message') {
          for (const content of (item.content || [])) {
            if (content.type === 'output_text') {
              textParts.push(content.text || '')
              if (content.annotations) {
                for (const ann of content.annotations) {
                  if (ann.type === 'url_citation' && ann.url) {
                    const exists = references.some(r => r.url === ann.url)
                    if (!exists) references.push({ url: ann.url, title: ann.title || ann.url })
                  }
                }
              }
            }
          }
        }
        if (item.type === 'web_search_call') {
          // Search call logged — results come in subsequent message items
        }
      }
      researchData = textParts.join('\n\n')
    } catch (err) {
      console.error('Research agent error (non-fatal):', err)
      researchData = 'Web research unavailable — proceeding with knowledge-based analysis.'
    }

    // ═══════════════════════════════════════════════════════════
    // AGENT 2: Skills & Gap Analysis
    // ═══════════════════════════════════════════════════════════
    const analysisResponse = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system', content: `You are a senior AI skills assessor. Given a person's profile and their quiz answers, produce a precise skills and readiness analysis. Return ONLY valid JSON:

{
  "score": <0-100>,
  "headline": "<5-8 word punchy headline>",
  "verdict": "<1 sentence honest verdict>",
  "dimensions": {
    "aiKnowledge": <0-100>,
    "technicalSkills": <0-100>,
    "strategicThinking": <0-100>,
    "adaptability": <0-100>,
    "toolProficiency": <0-100>,
    "dataLiteracy": <0-100>
  },
  "dimensionInsights": {
    "aiKnowledge": "<1 sentence specific insight>",
    "technicalSkills": "<1 sentence>",
    "strategicThinking": "<1 sentence>",
    "adaptability": "<1 sentence>",
    "toolProficiency": "<1 sentence>",
    "dataLiteracy": "<1 sentence>"
  },
  "skillGap": [
    { "skill": "<name>", "current": <0-100>, "required": <0-100>, "priority": "Critical|High|Medium" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"]
}

- "skillGap": 8 skills specific to their role
- Be brutally honest. Reference their actual answers.`
        },
        { role: 'user', content: userContext },
      ],
      max_completion_tokens: 3000,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    let analysisData: any = {}
    try {
      analysisData = JSON.parse(analysisResponse.choices[0]?.message?.content || '{}')
    } catch { analysisData = {} }

    // ═══════════════════════════════════════════════════════════
    // AGENT 3: Roadmap, Tools & ROI (uses research + analysis)
    // ═══════════════════════════════════════════════════════════
    const roadmapResponse = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system', content: `You are an AI implementation strategist. Using the research data and skills analysis provided, create a detailed implementation plan. Return ONLY valid JSON:

{
  "tools": [
    { "name": "<real tool name e.g. Claude Code, Cursor, Microsoft Copilot>", "url": "<actual website URL>", "purpose": "<specific use case for their role>", "timeSaved": "<hours/week>", "difficulty": "Easy|Medium|Hard", "cost": "<specific e.g. $0/Free, $20/mo, Free for students, Usage-based ~$5-15/mo>" }
  ],
  "roadmap": {
    "phase1": { "title": "Foundation (Days 1-30)", "goal": "<main goal>", "milestones": ["<specific action>", "..."], "tools": ["<tool names to adopt>"] },
    "phase2": { "title": "Acceleration (Days 31-60)", "goal": "<main goal>", "milestones": ["..."], "tools": ["..."] },
    "phase3": { "title": "Mastery (Days 61-90)", "goal": "<main goal>", "milestones": ["..."], "tools": ["..."] }
  },
  "roi": {
    "hoursSavedPerWeek": <number>,
    "productivityIncrease": "<percentage>",
    "annualValue": "<dollar amount based on industry>",
    "breakEvenWeeks": <number>,
    "explanation": "<2 sentences explaining how this was calculated>"
  },
  "risks": [
    { "type": "<risk name>", "severity": "High|Medium|Low", "description": "<specific to their industry/role>", "mitigation": "<how to address>" }
  ],
  "industryContext": "<3-4 sentences about AI adoption in their specific industry with real stats from the research>"
}

- "tools": 6-8 REAL tools with REAL URLs based on research. Include actual product names (Claude Code, Claude Desktop, Microsoft Copilot, Cursor, GitHub Copilot, Perplexity, NotebookLM, etc.) — not generic categories.
- Prioritize based on user's stated priority: if they said "price first" recommend free/freemium tools; if "usability" recommend polished consumer tools; if "comprehensiveness" recommend full-suite tools; if "low ongoing cost" recommend fixed-price subscriptions over usage-based pricing.
- Consider what they already use and recommend tools that INTEGRATE with their existing stack. Don't recommend what they already have — recommend what's NEXT for them.
- "cost" field MUST be specific: "$0/Free", "$10/mo", "$20/mo", "Free for students", "Usage-based ~$X/mo", "Included in M365" etc. — not just "Free/Paid"
- "risks": 4 risks of NOT adopting AI, specific to their situation
- Use actual data from the research provided. Be specific, not generic. Include references to sources in industryContext.`
        },
        {
          role: 'user', content: `Person's profile:\n${userContext}\n\n---\nIndustry Research (from web search):\n${researchData}\n\n---\nSkills Analysis:\nScore: ${analysisData.score || 50}\nWeaknesses: ${(analysisData.weaknesses || []).join(', ')}\nTop skill gaps: ${(analysisData.skillGap || []).slice(0, 4).map((s: any) => s.skill).join(', ')}`
        },
      ],
      max_completion_tokens: 4000,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    let roadmapData: any = {}
    try {
      roadmapData = JSON.parse(roadmapResponse.choices[0]?.message?.content || '{}')
    } catch { roadmapData = {} }

    // Add tool URLs to references if not already there
    for (const tool of (roadmapData.tools || [])) {
      if (tool.url && !references.some(r => r.url === tool.url)) {
        references.push({ url: tool.url, title: tool.name })
      }
    }

    // ═══════════════════════════════════════════════════════════
    // AGENT 4: Presentation Narrator (generates rich slide narrations)
    // ═══════════════════════════════════════════════════════════
    const score = analysisData.score || 50
    const headline = analysisData.headline || 'Your AI Readiness Blueprint'

    const narratorResponse = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system', content: `You are a senior AI consultant delivering a personalized readiness report directly to someone. Write detailed narration scripts for each slide of their presentation. Speak directly to them by name if provided. Be warm, insightful, specific, and reference their actual situation. No fluff — genuine expertise.

Return ONLY valid JSON with this structure:
{
  "slideNarrations": {
    "score": "<4-5 sentences. Greet them, reveal their score, explain what it means in context of their role/industry. Be encouraging but honest.>",
    "dimensions": "<4-5 sentences. Walk through their strongest and weakest dimensions. Explain WHY based on their answers. Reference specific answers they gave.>",
    "skillgap": "<4-5 sentences. Explain the most critical skill gaps. Why these matter for their role. What happens if they close these gaps vs ignore them.>",
    "industry": "<4-5 sentences. Share the industry research findings. Real stats about AI adoption in their field. How their peers/competitors are using AI. Make it feel urgent but achievable.>",
    "tools": "<4-5 sentences. Introduce the top 3-4 recommended tools by name. Explain WHY each one is perfect for their specific workflow/challenges. Be specific about use cases.>",
    "roadmap": "<4-5 sentences. Walk through the 90-day plan narrative. What they'll achieve by day 30, 60, 90. Make it feel exciting and achievable.>",
    "roi": "<4-5 sentences. Break down the numbers — hours saved, money gained. Explain the calculation logic. Compare to what they're losing NOW by not having AI assistance.>",
    "risks": "<4-5 sentences. Be direct about what happens if they don't act. Industry-specific consequences. Competitor advantage they're giving away. End with motivation, not fear.>",
    "references": "<3 sentences. Wrap up. Mention that all sources are clickable. Encourage them to take the first step today. Offer to help via Gennoor.>"
  }
}

Make each narration sound like a knowledgeable consultant speaking directly to them in a meeting. Conversational but authoritative.`
        },
        {
          role: 'user', content: `Generate narration for this person:

Name: ${name || 'there'}
Role: ${role || 'Professional'}
Industry: ${category || 'Not specified'}${subcategory ? ' > ' + subcategory : ''}

Their quiz answers: ${answersFormatted}
Open-ended response: ${openEnded || 'Not provided'}

---
Analysis results:
Score: ${score}/100
Headline: ${headline}
Verdict: ${analysisData.verdict || ''}
Strongest dimension: ${getStrongestDimension(analysisData.dimensions)}
Weakest areas: ${(analysisData.weaknesses || []).join(', ')}
Top skill gaps: ${(analysisData.skillGap || []).slice(0, 4).map((s: any) => `${s.skill} (${s.current}→${s.required})`).join(', ')}
Strengths: ${(analysisData.strengths || []).join(', ')}

---
Industry research highlights: ${researchData.slice(0, 800)}

---
Recommended tools: ${(roadmapData.tools || []).slice(0, 5).map((t: any) => `${t.name} (${t.purpose})`).join(', ')}
Roadmap phase 1 goal: ${roadmapData.roadmap?.phase1?.goal || ''}
Roadmap phase 2 goal: ${roadmapData.roadmap?.phase2?.goal || ''}
Roadmap phase 3 goal: ${roadmapData.roadmap?.phase3?.goal || ''}
ROI: ${roadmapData.roi?.hoursSavedPerWeek || 0}h/week saved, ${roadmapData.roi?.annualValue || ''} annual value
Risks: ${(roadmapData.risks || []).slice(0, 3).map((r: any) => r.type).join(', ')}`
        },
      ],
      max_completion_tokens: 3000,
      temperature: 0.75,
      response_format: { type: 'json_object' },
    })

    let narrations: Record<string, string> = {}
    try {
      const parsed = JSON.parse(narratorResponse.choices[0]?.message?.content || '{}')
      narrations = parsed.slideNarrations || parsed
    } catch { narrations = {} }

    const slides = [
      {
        id: 0, type: 'score', title: 'Your AI Readiness Score',
        narration: narrations.score || `${name ? name + ', your' : 'Your'} overall AI readiness score is ${score} out of 100. ${analysisData.verdict || headline}`,
        content: { score, headline, verdict: analysisData.verdict || '' },
      },
      {
        id: 1, type: 'dimensions', title: 'Readiness Breakdown',
        narration: narrations.dimensions || `Your six readiness dimensions show your strongest area is ${getStrongestDimension(analysisData.dimensions)}. ${getWeakestInsight(analysisData)}`,
        content: { dimensions: analysisData.dimensions || {}, insights: analysisData.dimensionInsights || {} },
      },
      {
        id: 2, type: 'skillgap', title: 'Skill Gap Analysis',
        narration: narrations.skillgap || `Your biggest gaps are in ${(analysisData.skillGap || []).slice(0, 3).map((s: any) => s.skill).join(', ')}. These are the skills that will unlock the most value for your role.`,
        content: { skillGap: analysisData.skillGap || [], strengths: analysisData.strengths || [], weaknesses: analysisData.weaknesses || [] },
      },
      {
        id: 3, type: 'industry', title: 'Industry Context',
        narration: narrations.industry || roadmapData.industryContext || `AI adoption in ${category || 'your industry'} is accelerating rapidly.`,
        content: { industryContext: roadmapData.industryContext || '', researchHighlights: researchData.slice(0, 500) },
      },
      {
        id: 4, type: 'tools', title: 'Recommended AI Tools',
        narration: narrations.tools || `Based on your role and industry, here are the specific AI tools that will have the most impact.`,
        content: { tools: roadmapData.tools || [] },
      },
      {
        id: 5, type: 'roadmap', title: '90-Day Implementation Roadmap',
        narration: narrations.roadmap || `Here's your personalized 90-day plan. Phase 1 focuses on ${roadmapData.roadmap?.phase1?.goal || 'building foundations'}.`,
        content: { roadmap: roadmapData.roadmap || {} },
      },
      {
        id: 6, type: 'roi', title: 'ROI Projection',
        narration: narrations.roi || `By implementing these recommendations, you could save approximately ${roadmapData.roi?.hoursSavedPerWeek || 8} hours per week, translating to around ${roadmapData.roi?.annualValue || '$15,000'} in annual value.`,
        content: { roi: roadmapData.roi || {} },
      },
      {
        id: 7, type: 'risks', title: 'Risks of Inaction',
        narration: narrations.risks || `${(roadmapData.risks || []).slice(0, 2).map((r: any) => r.description).join('. ')}`,
        content: { risks: roadmapData.risks || [] },
      },
      {
        id: 8, type: 'references', title: 'Sources & References',
        narration: narrations.references || `All recommendations in this report are backed by real research. You'll find clickable links to every tool and source mentioned. Good luck on your AI journey!`,
        content: { references },
      },
    ]

    // Generate TTS for ALL slides in parallel
    const ttsPromises = slides.map(s => generateTTS(s.narration))
    const audioResults = await Promise.all(ttsPromises)
    slides.forEach((s, i) => { (s as any).audio = audioResults[i] })

    const agentsUsed = ['Industry Research (Bing)', 'Skills Analysis', 'Roadmap & Strategy', 'Presentation Narrator']

    await saveBlueprint(
      email, name || '', role || '', category || '', subcategory || '',
      score, headline, answers, openEnded || '', analysisData.dimensions || {},
      JSON.stringify({ analysisData, roadmapData, references }),
      agentsUsed, references.length,
    )

    return NextResponse.json({
      success: true,
      blueprint: {
        score,
        headline,
        summary: analysisData.verdict || '',
        dimensions: analysisData.dimensions || {},
        dimensionInsights: analysisData.dimensionInsights || {},
        skillGap: analysisData.skillGap || [],
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        tools: roadmapData.tools || [],
        roadmap: roadmapData.roadmap || {},
        roi: roadmapData.roi || {},
        risks: roadmapData.risks || [],
        industryContext: roadmapData.industryContext || '',
        references,
        slides,
        agentsUsed,
      },
    })
  } catch (err: any) {
    console.error('Blueprint generation error:', err)
    return NextResponse.json({ error: err.message || 'Blueprint generation failed' }, { status: 500 })
  }
}

function getStrongestDimension(dims: any): string {
  if (!dims) return 'adaptability'
  const entries = Object.entries(dims) as [string, number][]
  const strongest = entries.sort((a, b) => b[1] - a[1])[0]
  const labels: Record<string, string> = {
    aiKnowledge: 'AI Knowledge', technicalSkills: 'Technical Skills',
    strategicThinking: 'Strategic Thinking', adaptability: 'Adaptability',
    toolProficiency: 'Tool Proficiency', dataLiteracy: 'Data Literacy',
  }
  return labels[strongest?.[0]] || 'adaptability'
}

function getWeakestInsight(data: any): string {
  if (!data?.dimensions) return ''
  const entries = Object.entries(data.dimensions) as [string, number][]
  const weakest = entries.sort((a, b) => a[1] - b[1])[0]
  const insight = data.dimensionInsights?.[weakest?.[0]] || ''
  return insight ? `Your area needing most attention: ${insight}` : ''
}
