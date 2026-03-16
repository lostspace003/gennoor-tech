# Email Implementation Guide for Gennoor Tech

## Quick Summary: Email Aliases for Each Form

### 1. Training Page Forms (Bootcamps & Courses)
- **From Email:** `training@gennoor.com`
- **CC:** `sales@gennoor.com`
- **Admin Notifications:** `admin@gennoor.com`
- **What User Receives:**
  - Personalized email with training details
  - PDF attachment of course/bootcamp brochure
  - Special offers and next steps

### 2. Certification Page Forms
- **From Email:** `training@gennoor.com`
- **CC:** `enquiry@gennoor.com`
- **Admin Notifications:** `admin@gennoor.com`
- **What User Receives:**
  - Certification preparation guide
  - Provider-specific roadmap (Microsoft/AWS/Google)
  - Success guarantee information
  - Sample questions (if available)

### 3. Contact Form (if added)
- **From Email:** `info@gennoor.com`
- **CC:** `enquiry@gennoor.com`
- **Admin Notifications:** `admin@gennoor.com`

### 4. Consultation Booking (if added)
- **From Email:** `schedule@gennoor.com`
- **CC:** `sales@gennoor.com`
- **Admin Notifications:** `jalalceo@gennoor.com`

## Documents to Send to Users

### For Training Enquiries (Bootcamps)
Send the specific bootcamp brochure PDF:
- Use existing PDF files from `/Gennoor-Bootcamp-Brochures/`
- Send PDF files as attachments
- Match the selected bootcamp to its corresponding brochure PDF

### For Training Enquiries (Courses)
Send the specific course TOC PDF:
- Use existing PDF files from `/Gennoor-Tech-Course-TOCs/`
- Send PDF files as attachments
- Match the selected course to its corresponding TOC PDF

### For Certification Enquiries
**No documents sent** - All information provided in email body:
- Training approach and methodology explained in email
- Success guarantee details included in email
- Consultation scheduling link provided
- Detailed discussion happens during consultation call

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Hostinger SMTP details:
```env
SMTP_HOST=mail.gennoor.com
SMTP_PORT=587
SMTP_USER=noreply@gennoor.com
SMTP_PASS=your_password_here

EMAIL_FROM_TRAINING=training@gennoor.com
EMAIL_FROM_INFO=info@gennoor.com
EMAIL_FROM_SALES=sales@gennoor.com
EMAIL_ADMIN=admin@gennoor.com
```

### Step 3: Verify PDF Files
1. Ensure existing PDF files are accessible:
```
/Gennoor-Bootcamp-Brochures/
  - [existing bootcamp PDF files]

/Gennoor-Tech-Course-TOCs/
  - [existing course TOC PDF files]
```

2. No conversion needed - PDFs already exist
3. For certification enquiries - no documents needed

### Step 4: Update API Routes
The API routes are already configured with the correct email addresses:
- `/api/training-enquiry/route.ts` - Uses `training@gennoor.com`
- `/api/certification-enquiry/route.ts` - Uses `training@gennoor.com`

### Step 5: Test Email Sending
1. Submit a test enquiry through each form
2. Check that emails are sent from the correct addresses
3. Verify PDF attachments are included
4. Confirm admin notifications are received

## Lead Scoring System

The system automatically categorizes leads:

**HOT Leads** (Priority action required):
- Timeline: Within 1 month
- Training for: Organization/Team
- Action: Priority follow-up required

**WARM Leads** (Important follow-up):
- Timeline: Within 2 months
- Training for: Team/Individual with certification goal
- Action: Schedule follow-up promptly

**COLD Leads** (Nurture campaign):
- Timeline: 3+ months or "just exploring"
- Action: Add to email nurture sequence

## Email Templates Overview

### User Emails Include:
- Personalized greeting
- Program/certification details
- PDF attachments
- Special offers (10% early bird discount)
- Clear next steps
- Multiple contact options
- Professional branding

### Admin Notifications Include:
- Lead score (HOT/WARM/COLD)
- Complete enquiry details
- Recommended actions
- Contact information
- Timestamp

## Recommended Next Steps

1. **Immediate Actions:**
   - Set up SMTP credentials in `.env.local`
   - Prepare all PDF files
   - Test email functionality

2. **Within 1 Week:**
   - Create certification guide PDF
   - Design email templates in HTML
   - Set up follow-up sequences

3. **Future Enhancements:**
   - Integrate CRM system
   - Add WhatsApp notifications
   - Implement automated follow-ups
   - Add email tracking/analytics

## Support Contact

For any issues with email setup:
- Technical Support: `admin@gennoor.com`
- Email Configuration Help: Use Hostinger support portal