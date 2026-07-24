import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'

// Microsoft Graph configuration for M365 email
const credential = new ClientSecretCredential(
  process.env.AZURE_AD_TENANT_ID!,
  process.env.AZURE_AD_CLIENT_ID!,
  process.env.AZURE_AD_CLIENT_SECRET!
)

const client = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const token = await credential.getToken('https://graph.microsoft.com/.default')
      return token?.token || ''
    }
  }
})

export class EmailService {
  // Send email using Microsoft 365
  async sendEmail(to: string[], subject: string, content: string, cc?: string[], attachments?: any[]) {
    try {
      const message = {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: content
        },
        toRecipients: to.map(email => ({
          emailAddress: { address: email }
        })),
        ccRecipients: cc?.map(email => ({
          emailAddress: { address: email }
        })) || [],
        attachments: attachments || []
      }

      // Send from admin@gennoor.com
      const result = await client.api('/users/admin@gennoor.com/sendMail')
        .post({ message })

      return result
    } catch (error) {
      console.error('Email error:', error)
      throw error
    }
  }

  // Send bulk emails
  async sendBulkEmails(leads: any[], subject: string, template: string) {
    const results = []

    for (const lead of leads) {
      // Personalize email content
      const personalizedContent = template
        .replace('{{name}}', lead.name)
        .replace('{{company}}', lead.company)
        .replace('{{designation}}', lead.designation)

      try {
        await this.sendEmail(
          [lead.email],
          subject,
          personalizedContent,
          ['admin@gennoor.com'] // Always CC admin
        )

        results.push({ lead: lead.id, status: 'sent' })
      } catch (error) {
        results.push({ lead: lead.id, status: 'failed', error })
      }
    }

    return results
  }

  // Schedule email
  async scheduleEmail(to: string[], subject: string, content: string, sendAt: Date) {
    // Use Azure Logic Apps or Functions for scheduling
    // For now, we'll store in database and use a timer trigger
    return {
      scheduled: true,
      sendAt: sendAt,
      to: to
    }
  }

  // Get email templates
  getEmailTemplates() {
    return [
      {
        id: 'initial-contact',
        name: 'Initial Contact',
        subject: 'Innovative AI Solutions for {{company}}',
        content: `
          <p>Dear {{name}},</p>
          <p>I hope this email finds you well. I'm reaching out from Gennoor Tech regarding our innovative AI solutions that could benefit {{company}}.</p>
          <p>We specialize in:</p>
          <ul>
            <li>Digital Transformation & AI Integration</li>
            <li>Custom AI Agent Development</li>
            <li>Enterprise Training Programs</li>
            <li>Process Automation Solutions</li>
          </ul>
          <p>I'd love to schedule a brief call to understand your current challenges and explore how we can add value to your business.</p>
          <p>Would you be available for a 15-minute call this week?</p>
          <p>Best regards,<br/>
          Team Gennoor<br/>
          Gennoor Tech</p>
        `
      },
      {
        id: 'webinar-invite',
        name: 'Webinar Invitation',
        subject: 'Exclusive Webinar: AI Transformation for {{company}}',
        content: `
          <p>Dear {{name}},</p>
          <p>Following our conversation, I'm pleased to invite you to an exclusive 2-hour webinar tailored for {{company}}.</p>
          <p>Webinar Details:</p>
          <ul>
            <li>Topic: AI Transformation Strategies</li>
            <li>Date: [DATE]</li>
            <li>Time: [TIME]</li>
            <li>Platform: Microsoft Teams</li>
          </ul>
          <p>Please find the attached materials for your review.</p>
          <p>Looking forward to your participation!</p>
          <p>Best regards,<br/>
          Team Gennoor</p>
        `
      }
    ]
  }
}

export const emailService = new EmailService()