# Final Email Setup - Quick Reference

## ✅ What You Need to Do

1. **Add SMTP credentials to `.env.local`:**
```env
SMTP_HOST=mail.gennoor.com
SMTP_PORT=587
SMTP_USER=noreply@gennoor.com
SMTP_PASS=[your password]
```

3. **Test the forms** - That's it!

## 📧 Email Configuration

| Form Type | From Email | CC | Attachments |
|-----------|------------|-----|------------|
| **Training Enquiry** | `training@gennoor.com` | `sales@gennoor.com` | ✅ PDF file (bootcamp/course) |
| **Certification Enquiry** | `training@gennoor.com` | `enquiry@gennoor.com` | ❌ No attachments |

## 📄 Documents Strategy

### Training Enquiries
- **Bootcamps**: Send existing PDF from `/Gennoor-Bootcamp-Brochures/`
- **Courses**: Send existing PDF from `/Gennoor-Tech-Course-TOCs/`
- **Format**: PDF files (already available)

### Certification Enquiries
- **No documents sent**
- All information provided in email body
- Focus on scheduling consultation call

## 🎯 Key Changes Made

1. **No time commitments** - Removed all "within 24 hours" type promises
2. **Certification emails** - No attachments, information in email body only
3. **PDF files** - Use existing PDFs directly
4. **Email addresses** - Using `training@gennoor.com` as primary sender

## 📁 File Locations

```
Your existing PDF files:
/Gennoor-Bootcamp-Brochures/
  - [bootcamp PDF files - ready to use]

/Gennoor-Tech-Course-TOCs/
  - [course TOC PDF files - ready to use]

Code files updated:
/src/app/api/training-enquiry/route.ts
/src/app/api/certification-enquiry/route.ts
/src/lib/email-service.ts
/src/components/training/EnquiryFormModal.tsx
/src/components/certifications/CertificationEnquiryForm.tsx
```

## 🚀 Ready to Go

Once you add the SMTP credentials, the system is ready:
- Training enquiries will send PDF attachments
- Certification enquiries will send detailed emails (no attachments)
- Admin notifications will be sent with lead scoring
- No specific time commitments in any messages

## 📞 Support

For any issues:
- Email functionality: Check `/src/lib/email-service.ts`
- API routes: Check `/src/app/api/` folders
- SMTP issues: Verify Hostinger SMTP settings