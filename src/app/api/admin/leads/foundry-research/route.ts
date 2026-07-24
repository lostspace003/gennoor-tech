import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import OpenAI from 'openai'
import { sql } from '@vercel/postgres'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// Authorized emails
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'contact@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'jalalkhan@gennoor.com'
]

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are Gennoor's AI Research Assistant, a sophisticated lead intelligence system.

Your capabilities:
1. Research companies and find detailed information about their business, technology stack, and opportunities
2. Find key decision makers and their contact information
3. Draft personalized outreach emails for AI & Cloud training services
4. Suggest engagement strategies based on company profiles
5. Search the internet using Bing for latest information
6. Analyze lead data and provide insights

Key offerings to mention:
- FREE 1-day webinar for companies/organizations
- Microsoft Azure & AI Solutions training
- AWS Cloud Architecture programs
- Google Cloud Platform certification prep
- Custom corporate training programs
- AI/ML implementation workshops
- Cloud migration strategies

Always:
- Be professional and concise
- Provide actionable insights
- Include specific opportunities for engagement
- Mention the free webinar offer when drafting emails
- CC admin@gennoor.com on all email suggestions

Current date: ${new Date().toISOString().split('T')[0]}`

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Build context from selected lead if provided
    let enhancedContext = ''
    if (context?.selectedLead) {
      const lead = context.selectedLead
      enhancedContext = `\n\nCurrent Lead Context:
Company: ${lead.Company || 'NA'}
Contact: ${lead.Name || 'NA'}
Email: ${lead.Email || 'NA'}
Designation: ${lead.Designation || 'NA'}
Industry: ${lead.Industry || 'NA'}
Location: ${lead.Location || 'NA'}
Status: ${lead.Status || 'new'}
Notes: ${lead.Notes || 'No notes'}`
    }

    // Check if we need to search the internet
    const needsSearch = message.toLowerCase().includes('research') ||
                       message.toLowerCase().includes('find') ||
                       message.toLowerCase().includes('latest') ||
                       message.toLowerCase().includes('news') ||
                       message.toLowerCase().includes('information about')

    let searchResults = ''
    if (needsSearch && context?.selectedLead?.Company) {
      searchResults = await searchBing(context.selectedLead.Company)
    }

    // Prepare messages for GPT
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + enhancedContext + (searchResults ? `\n\nRecent Search Results:\n${searchResults}` : '')
      }
    ]

    // Add previous messages if available
    if (context?.previousMessages) {
      context.previousMessages.forEach((msg: any) => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Call GPT-4 for response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      tools: [
        {
          type: 'function',
          function: {
            name: 'research_company',
            description: 'Research a company and return structured information',
            parameters: {
              type: 'object',
              properties: {
                company: { type: 'string', description: 'Company name' },
                website: { type: 'string', description: 'Company website' },
                employees: { type: 'string', description: 'Number of employees' },
                revenue: { type: 'string', description: 'Annual revenue' },
                industry: { type: 'string', description: 'Industry sector' },
                technologies: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Technologies used'
                },
                painPoints: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Potential pain points'
                },
                opportunities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Business opportunities'
                }
              },
              required: ['company']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'draft_email',
            description: 'Draft a personalized outreach email',
            parameters: {
              type: 'object',
              properties: {
                subject: { type: 'string', description: 'Email subject line' },
                body: { type: 'string', description: 'Email body content' },
                recipientName: { type: 'string', description: 'Recipient name' },
                companyName: { type: 'string', description: 'Company name' }
              },
              required: ['subject', 'body']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'update_lead',
            description: 'Update lead information in the database',
            parameters: {
              type: 'object',
              properties: {
                leadId: { type: 'string', description: 'Lead ID' },
                updates: {
                  type: 'object',
                  description: 'Fields to update',
                  additionalProperties: true
                }
              },
              required: ['leadId', 'updates']
            }
          }
        }
      ]
    })

    const responseMessage = completion.choices[0].message
    let researchResult = null
    let emailDraft = null
    let updates = null

    // Handle tool calls
    if (responseMessage.tool_calls) {
      for (const toolCall of responseMessage.tool_calls) {
        if ('function' in toolCall) {
          const args = JSON.parse(toolCall.function.arguments)

          switch (toolCall.function.name) {
          case 'research_company':
            researchResult = args
            // Store research in database
            if (context?.selectedLead?.id) {
              await sql`
                UPDATE leads
                SET research_data = ${JSON.stringify(args)},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${context.selectedLead.id}
              `
            }
            break

          case 'draft_email':
            emailDraft = formatEmail(args, session.user?.email || '')
            break

          case 'update_lead':
            if (args.leadId) {
              const updateFields = Object.entries(args.updates)
                .map(([key, value]) => `${key} = '${value}'`)
                .join(', ')

              await sql.query(`
                UPDATE leads
                SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
              `, [args.leadId])

              updates = args.updates
            }
            break
          }
        }
      }
    }

    // Log the interaction
    await sql`
      INSERT INTO ai_interactions (
        user_email, message, response, lead_id, created_at
      ) VALUES (
        ${session.user?.email}, ${message}, ${responseMessage.content},
        ${context?.selectedLead?.id || null}, CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({
      response: responseMessage.content || 'Processing completed successfully.',
      researchResult,
      emailDraft,
      metadata: {
        updates,
        model: 'gpt-4-turbo',
        timestamp: new Date().toISOString(),
        user: session.user?.email
      }
    })

  } catch (error) {
    console.error('Error in AI research:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Search Bing for company information
async function searchBing(companyName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(companyName + ' company profile technology')}`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY!
        }
      }
    )

    if (!response.ok) {
      console.error('Bing search failed:', response.statusText)
      return ''
    }

    const data = await response.json()
    const results = data.webPages?.value?.slice(0, 3) || []

    return results.map((r: any) => `- ${r.name}: ${r.snippet}`).join('\n')
  } catch (error) {
    console.error('Error searching Bing:', error)
    return ''
  }
}

// Format email with proper structure
function formatEmail(args: any, senderEmail: string): string {
  const template = `Subject: ${args.subject}

To: ${args.recipientName || 'Hiring Manager'}
From: ${senderEmail}
CC: admin@gennoor.com

---

${args.body}

---

Best regards,
${senderEmail.split('@')[0]}
Gennoor Tech

P.S. Don't forget to ask about our FREE 1-day webinar offer for your team!

---
This email includes:
- Personalized approach based on company research
- Clear value proposition
- Free webinar offer
- Call to action for scheduling a meeting
- Professional signature`

  return template
}