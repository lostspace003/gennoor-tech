// AI Service - Mock implementation until Azure OpenAI is configured
// TODO: Integrate with actual Azure OpenAI once credentials are set up

export interface AIResponse {
  content: string
  tokens?: number
}

export interface ResearchResponse {
  summary: string
  insights: string[]
  opportunities: string[]
  approach: string
  lastUpdated: string
}

export class AIService {
  // Research company and lead
  async researchLead(lead: any): Promise<ResearchResponse> {
    // Mock response for now
    return {
      summary: `${lead.company} is a forward-thinking organization led by ${lead.name} as ${lead.designation}. They are actively exploring digital transformation opportunities.`,
      insights: [
        'Looking to modernize their infrastructure',
        'Interested in AI and automation solutions',
        'Focus on improving operational efficiency'
      ],
      opportunities: [
        'Cloud migration services',
        'AI-powered analytics',
        'Custom software development'
      ],
      approach: 'Schedule a discovery call to understand their specific pain points and demonstrate our AI solutions.',
      lastUpdated: new Date().toISOString()
    }
  }

  // Generate personalized email
  async generateEmail(lead: any, context: string): Promise<string> {
    return this.getDefaultEmailTemplate(lead)
  }

  // Classify lead (technical vs non-technical)
  async classifyLead(lead: any): Promise<'technical' | 'non-technical'> {
    const technicalKeywords = ['cto', 'engineer', 'developer', 'architect', 'technical', 'tech lead', 'it']
    const designation = lead.designation?.toLowerCase() || ''

    const isTechnical = technicalKeywords.some(keyword => designation.includes(keyword))
    return isTechnical ? 'technical' : 'non-technical'
  }

  // Generate follow-up strategy
  async generateFollowUpStrategy(lead: any): Promise<string[]> {
    return [
      'Day 1: Send introductory email with company overview',
      'Day 3: Share relevant case studies',
      'Day 7: Call to discuss specific needs',
      'Day 14: Send proposal if interested',
      'Day 21: Follow up on proposal',
      'Day 30: Check-in and offer pilot project'
    ]
  }

  // Helper methods
  private getDefaultEmailTemplate(lead: any): string {
    return `Dear ${lead.name},

I hope this email finds you well. I'm reaching out from Gennoor Tech, where we specialize in helping companies like ${lead.company} transform their operations through AI and cloud solutions.

Given your role as ${lead.designation}, I believe you'd be interested in how we've helped similar organizations achieve:
• 40% reduction in operational costs
• 3x improvement in productivity
• Seamless digital transformation

I'd love to schedule a brief 30-minute call to discuss how we can help ${lead.company} achieve similar results.

Would next week work for a quick discussion?

Best regards,
Team Gennoor
contact@gennoor.com | +91 9326352241`
  }

  private extractSection(text: string | undefined, section: string): string {
    if (!text) return ''
    const lines = text.split('\n')
    const startIndex = lines.findIndex(line => line.includes(section))
    if (startIndex === -1) return ''

    let endIndex = lines.length
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].match(/^\d+\.|^[A-Z]/)) {
        endIndex = i
        break
      }
    }

    return lines.slice(startIndex + 1, endIndex).join(' ').trim()
  }

  private extractBullets(text: string | undefined, section: string): string[] {
    if (!text) return []
    const sectionText = this.extractSection(text, section)
    return sectionText
      .split(/[-•]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }
}

export default new AIService()