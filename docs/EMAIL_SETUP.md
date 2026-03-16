# Email Setup Guide for Training Enquiry System

## Overview
The training enquiry system sends PDF course outlines via email from `enquiry@gennoor.com` when users submit enquiries.

## Required Setup

### 1. Environment Variables
Add these to your `.env.local` file:

```env
# Email Service Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
ADMIN_EMAIL=admin@gennoor.com
FROM_EMAIL=enquiry@gennoor.com
FROM_NAME=Gennoor Tech Training

# OR for SMTP (Gmail/Outlook)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=enquiry@gennoor.com
SMTP_PASS=your_app_password_here
```

### 2. Install Email Service Package

#### Option A: SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

#### Option B: Nodemailer (For SMTP)
```bash
npm install nodemailer
npm install @types/nodemailer --save-dev
```

#### Option C: Resend (Modern Alternative)
```bash
npm install resend
```

### 3. PDF Generation Package
To convert DOCX to PDF:
```bash
npm install docx-pdf
# OR
npm install puppeteer # For HTML to PDF
# OR
npm install @pdfme/generator # For template-based PDFs
```

## Implementation Examples

### SendGrid Implementation
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const msg = {
  to: userEmail,
  from: {
    email: 'enquiry@gennoor.com',
    name: 'Gennoor Tech Training'
  },
  subject: 'Course Details',
  html: emailContent,
  attachments: [{
    content: pdfBase64,
    filename: 'course_outline.pdf',
    type: 'application/pdf',
    disposition: 'attachment'
  }]
}

await sgMail.send(msg)
```

### Nodemailer Implementation
```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const mailOptions = {
  from: '"Gennoor Tech Training" <enquiry@gennoor.com>',
  to: userEmail,
  subject: 'Course Details',
  html: emailContent,
  attachments: [{
    filename: 'course_outline.pdf',
    path: pdfFilePath
  }]
}

await transporter.sendMail(mailOptions)
```

## Email Service Setup

### Setting up enquiry@gennoor.com

#### 1. Google Workspace
1. Create Google Workspace account for gennoor.com
2. Add enquiry@gennoor.com user
3. Enable 2FA and create App Password
4. Use App Password with Nodemailer

#### 2. Microsoft 365
1. Set up Microsoft 365 for gennoor.com
2. Create enquiry@gennoor.com mailbox
3. Enable SMTP authentication
4. Use with Nodemailer

#### 3. SendGrid (Easier)
1. Sign up for SendGrid account
2. Verify gennoor.com domain
3. Create API key
4. Set up sender authentication for enquiry@gennoor.com

## Converting DOCX to PDF

### Option 1: Use existing PDFs
Store PDF versions of all course outlines in the public folder.

### Option 2: Dynamic conversion
```typescript
import { convertDocxToPdf } from 'docx-pdf'

const pdfBuffer = await convertDocxToPdf(docxFilePath)
```

### Option 3: Generate from HTML
```typescript
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setContent(htmlContent)
const pdf = await page.pdf({ format: 'A4' })
await browser.close()
```

## Testing

### Local Testing
Use [Mailtrap](https://mailtrap.io) or [Ethereal Email](https://ethereal.email) for testing:

```env
# Test SMTP settings
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_test_user
SMTP_PASS=your_test_pass
```

### Production Checklist
- [ ] Domain verified with email service
- [ ] SPF records configured
- [ ] DKIM records configured
- [ ] DMARC policy set
- [ ] Email templates tested
- [ ] PDF attachments working
- [ ] Error handling in place
- [ ] Rate limiting configured
- [ ] Bounce handling set up

## Email Templates Location
Email templates are in the API route:
`/src/app/api/training-enquiry/route.ts`

## Support
For email delivery issues:
1. Check email service logs
2. Verify domain settings
3. Test with simple email first
4. Check spam folders
5. Review SPF/DKIM/DMARC records

## Recommended Services
1. **SendGrid** - Best for transactional emails
2. **AWS SES** - Cost-effective for high volume
3. **Postmark** - Great deliverability
4. **Resend** - Modern developer-friendly API
5. **Mailgun** - Good for both transactional and marketing