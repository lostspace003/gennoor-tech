# Gennoor Tech Email Communication Strategy

## Email Aliases Allocation

### 1. Training Enquiry Form (Bootcamps & Courses)
**From Email:** `training@gennoor.com`
**CC Email:** `sales@gennoor.com`
**Admin Notification:** `admin@gennoor.com`

**Purpose:** Handle all training-related enquiries for bootcamps and course TOCs

### 2. Certification Enquiry Form
**From Email:** `training@gennoor.com`
**CC Email:** `enquiry@gennoor.com`
**Admin Notification:** `admin@gennoor.com`
**Attachments:** None (no documents sent for certification enquiries)

**Purpose:** Handle certification preparation enquiries

### 3. General Contact Form
**From Email:** `info@gennoor.com`
**CC Email:** `enquiry@gennoor.com`
**Admin Notification:** `admin@gennoor.com`

**Purpose:** General inquiries and contact requests

### 4. Consultation Booking Form
**From Email:** `schedule@gennoor.com`
**CC Email:** `sales@gennoor.com`
**Admin Notification:** `jalalceo@gennoor.com`

**Purpose:** Schedule consultation calls and meetings

### 5. Corporate Training Request
**From Email:** `sales@gennoor.com`
**CC Email:** `training@gennoor.com`
**Admin Notification:** `jalalceo@gennoor.com`

**Purpose:** Enterprise and corporate training proposals

## Email Content Templates

### Training Enquiry Response (Bootcamps & Courses)

**Subject Line:** `${programType === 'bootcamp' ? 'Bootcamp' : 'Course'} Details: ${programTitle} | Gennoor Tech`

**Attachments to Send:**
- For Bootcamps: Send the existing PDF from `/Gennoor-Bootcamp-Brochures/`
  - AI Agents Bootcamp → corresponding brochure PDF
  - Machine Learning Bootcamp → corresponding brochure PDF
  - etc.

- For Courses: Send the existing PDF from `/Gennoor-Tech-Course-TOCs/`
  - Based on the course selected, attach the appropriate TOC PDF

**Email Content Structure:**
1. Personalized greeting with user's name
2. Thank you for interest in specific program
3. Brief overview of what's included in the attachment
4. Key highlights of the program (3-4 bullet points)
5. Next steps (consultation call scheduling)
6. Special offers (early bird discount, group discounts)
7. Contact information for follow-up
8. Professional signature

### Certification Enquiry Response

**Subject Line:** `Certification Preparation Information: ${selectedCertification} | Gennoor Tech`

**Attachments to Send:** None (no documents sent for certification enquiries)

**Email Content Structure:**
1. Personalized greeting
2. Acknowledgment of certification goal
3. Current level assessment summary
4. Recommended preparation approach
5. Training options (online, onsite, weekend) detailed in email body
6. Success guarantee details (98% pass rate) included in email
7. Free consultation offer with calendar link
8. Request to schedule call for detailed discussion and pricing
9. Contact information for immediate questions

## Document Repository Structure

### Training Materials to Send

**For Training Enquiries:**
- Use existing PDF files from `/Gennoor-Bootcamp-Brochures/` for bootcamps
- Use existing PDF files from `/Gennoor-Tech-Course-TOCs/` for courses
- Send PDF files as attachments

**For Certification Enquiries:**
- No documents sent
- All information provided in the email body
- Focus on scheduling consultation call for detailed discussion

**File Structure (existing):**
```
/Gennoor-Bootcamp-Brochures/
  - [existing bootcamp brochure PDF files]

/Gennoor-Tech-Course-TOCs/
  - [existing course TOC PDF files]

/public/certificates/
  - [trainer's certification PDFs - not sent to users]
```

## Admin Notification Strategy

### Lead Scoring System
- **HOT Lead:** Timeline < 1 month, Corporate/Team training
- **WARM Lead:** Timeline 1-2 months, Individual with certification goal
- **COLD Lead:** Timeline > 3 months, Just exploring

### Admin Email Should Include:
1. Lead score (HOT/WARM/COLD)
2. Complete enquiry details in table format
3. Recommended follow-up actions
4. Similar past enquiries reference
5. Suggested pricing tier
6. Assignment to sales team member

## Follow-up Sequence

### Day 0 (Immediate)
- Auto-response with PDF attachment
- Admin notification
- CRM entry creation

### Day 1
- Personal follow-up email from trainer
- Calendar invite for consultation call

### Day 3
- If no response, send reminder with additional resources
- WhatsApp message (if phone provided)

### Day 7
- Final follow-up with special offer
- Move to nurture campaign

### Day 14+
- Add to monthly newsletter
- Periodic updates on new courses/certifications

## Email Service Configuration

### Required Environment Variables
```env
# Email Service (Choose one)
SENDGRID_API_KEY=your_sendgrid_api_key
# OR
SMTP_HOST=mail.gennoor.com
SMTP_PORT=587
SMTP_USER=noreply@gennoor.com
SMTP_PASS=your_smtp_password

# Email Addresses
EMAIL_FROM_TRAINING=training@gennoor.com
EMAIL_FROM_INFO=info@gennoor.com
EMAIL_FROM_SALES=sales@gennoor.com
EMAIL_FROM_SCHEDULE=schedule@gennoor.com
EMAIL_ADMIN=admin@gennoor.com
EMAIL_CEO=jalalceo@gennoor.com

# Notification Settings
ADMIN_NOTIFICATIONS=true
CC_SALES_TEAM=true
```

## Implementation Priority

1. **Phase 1 (Immediate)**
   - Setup basic email sending for training enquiries
   - Configure admin notifications
   - Prepare PDF attachments

2. **Phase 2 (Week 1)**
   - Implement certification enquiry emails
   - Add lead scoring system
   - Setup follow-up sequences

3. **Phase 3 (Week 2)**
   - Integrate CRM system
   - Add WhatsApp integration
   - Implement analytics tracking

## Metrics to Track

- Email open rates
- Attachment download rates
- Response rates
- Conversion rates (enquiry to enrollment)
- Time to first response
- Customer satisfaction scores

## Compliance & Best Practices

1. Include unsubscribe link in all marketing emails
2. Add privacy policy link
3. Ensure GDPR compliance for data handling
4. Use double opt-in for newsletter subscriptions
5. Maintain email list hygiene
6. Regular backup of enquiry data
7. SSL/TLS encryption for email transmission