import { OpenAIClient, AzureKeyCredential } from '@azure/openai'

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://gennoor-ai.openai.azure.com'
const apiKey = process.env.AZURE_OPENAI_KEY || ''
const deploymentName = 'gpt-4' // Your deployment name in Azure AI Foundry

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey))

export class AIService {
  // Research company and lead
  async researchLead(lead: any) {
    try {
      const prompt = `
        Research the following lead and company:
        Name: ${lead.name}
        Company: ${lead.company}
        Designation: ${lead.designation}
        LinkedIn: ${lead.linkedin || 'N/A'}
        Website: ${lead.website || 'N/A'}

        Provide:
        1. Company summary (size, industry, recent news)
        2. Key insights (pain points, technology stack, growth indicators)
        3. Sales opportunities (where our services fit)
        4. Recommended approach
      `

      const response = await client.getChatCompletions(deploymentName, [
        { role: 'system', content: 'You are a sales intelligence AI assistant for Gennoor Tech.' },
        { role: 'user', content: prompt }
      ])

      const result = response.choices[0].message?.content

      return {
        summary: this.extractSection(result, 'Company summary'),
        insights: this.extractBullets(result, 'Key insights'),
        opportunities: this.extractBullets(result, 'Sales opportunities'),
        approach: this.extractSection(result, 'Recommended approach'),
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('AI research error:', error)
      return {
        summary: 'Research pending',
        insights: [],
        opportunities: [],
        approach: '',
        lastUpdated: new Date().toISOString()
      }
    }
  }

  // Generate personalized email
  async generateEmail(lead: any, context: string) {
    try {
      const prompt = `
        Generate a professional sales email for:
        Name: ${lead.name}
        Company: ${lead.company}
        Designation: ${lead.designation}
        Context: ${context}

        The email should:
        - Be personalized and professional
        - Highlight Gennoor Tech's AI solutions
        - Include a clear call to action
        - Be concise (under 200 words)
      `

      const response = await client.getChatCompletions(deploymentName, [
        { role: 'system', content: 'You are a professional sales email writer for Gennoor Tech.' },
        { role: 'user', content: prompt }
      ])

      return response.choices[0].message?.content || ''
    } catch (error) {
      console.error('Email generation error:', error)
      return this.getDefaultEmailTemplate(lead)
    }
  }

  // Classify lead (technical vs non-technical)
  async classifyLead(lead: any): Promise<'technical' | 'non-technical'> {
    try {
      const prompt = `
        Based on the designation "${lead.designation}" and company "${lead.company}",
        classify this lead as either 'technical' or 'non-technical'.

        Technical roles: CTO, Developer, Engineer, Architect, etc.
        Non-technical roles: CEO, CFO, Manager, Director, VP Sales, etc.

        Respond with only one word: 'technical' or 'non-technical'
      `

      const response = await client.getChatCompletions(deploymentName, [
        { role: 'user', content: prompt }
      ])

      const classification = response.choices[0].message?.content?.toLowerCase().trim()
      return classification === 'technical' ? 'technical' : 'non-technical'
    } catch (error) {
      console.error('Classification error:', error)
      return 'non-technical'
    }
  }

  // Generate follow-up strategy
  async generateFollowUpStrategy(lead: any, previousInteractions: any[]) {
    try {
      const prompt = `
        Generate a follow-up strategy for:
        Lead: ${lead.name} from ${lead.company}
        Current Stage: ${lead.stage}
        Status: ${lead.status}
        Previous Interactions: ${previousInteractions.length}

        Recommend:
        1. Next best action
        2. Timing for follow-up
        3. Key talking points
        4. Documents to share
      `

      const response = await client.getChatCompletions(deploymentName, [
        { role: 'system', content: 'You are a sales strategy AI for Gennoor Tech.' },
        { role: 'user', content: prompt }
      ])

      return response.choices[0].message?.content || ''
    } catch (error) {
      console.error('Strategy generation error:', error)
      return 'Schedule a follow-up call within 2-3 days.'
    }
  }

  // Helper methods
  private extractSection(text: string | undefined, section: string): string {
    if (!text) return ''
    const regex = new RegExp(`${section}:?\\s*([^\\n]+)`, 'i')
    const match = text.match(regex)
    return match ? match[1].trim() : ''
  }

  private extractBullets(text: string | undefined, section: string): string[] {
    if (!text) return []
    const sectionStart = text.indexOf(section)
    if (sectionStart === -1) return []

    const sectionText = text.substring(sectionStart)
    const bullets = sectionText.match(/[-•]\s*([^\n]+)/g) || []
    return bullets.map(b => b.replace(/^[-•]\s*/, '').trim()).slice(0, 3)
  }

  private getDefaultEmailTemplate(lead: any): string {
    return `Dear ${lead.name},

I hope this email finds you well. I'm reaching out from Gennoor Tech regarding our innovative AI solutions that could benefit ${lead.company}.

We specialize in helping organizations like yours leverage AI for digital transformation, process automation, and competitive advantage.

I'd love to schedule a brief call to understand your current challenges and explore how we can add value to your business.

Would you be available for a 15-minute call this week?

Best regards,
Team Gennoor
Gennoor Tech

CC: admin@gennoor.com`
  }
}

export const aiService = new AIService()