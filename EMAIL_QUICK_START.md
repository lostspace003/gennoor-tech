# Email System Quick Start Guide

## ✅ Your SMTP is Configured!

Your Hostinger email settings are ready to use with:
- **Email:** jalalkhan@gennoor.com
- **SMTP:** smtp.hostinger.com:465 (SSL)

## 🧪 Test Your Email Setup

```bash
# Test if email works
node test-email.js
```

## 📧 How to Use

### 1. Test Training Enquiry
- Go to: http://localhost:3000/services/training
- Click any "Enquire" button
- Fill the form
- Submit
- Check jalalkhan@gennoor.com for the email

### 2. Test Certification Enquiry
- Go to: http://localhost:3000/services/certifications
- Click "Enquire" on any certification
- Fill the form
- Submit
- Check email

## 🔍 Debugging

If emails don't send:

```bash
# Check environment variables are loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.SMTP_HOST)"

# Should output: smtp.hostinger.com
```

## 📝 Email Flow

```
User submits form
    ↓
API endpoint processes
    ↓
Email sent FROM: jalalkhan@gennoor.com
    ↓
User receives: Course/Bootcamp PDF (training) or Info (certification)
Admin receives: Lead notification with scoring
```

## ⚠️ Important Notes

1. **All emails send FROM jalalkhan@gennoor.com** (Hostinger requirement)
2. **PDFs must exist** in the directories for attachments to work
3. **Test in development** before production deployment

## 🚀 Production Deployment

When deploying to production:

1. Add these environment variables to your hosting platform (Vercel/Netlify/etc)
2. Ensure PDF files are included in deployment
3. Update NEXT_PUBLIC_SITE_URL to your domain

## 📞 Support

If you need help:
- Check: `HOSTINGER_EMAIL_SETUP.md` for detailed configuration
- Run: `node test-email.js` to verify SMTP
- Review: Server logs for any errors