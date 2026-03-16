# Hostinger Email Configuration

## ✅ SMTP Configuration Added

Your Hostinger SMTP settings have been configured in `.env.local`:

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=jalalkhan@gennoor.com
SMTP_PASS=Astagfirullah#135
```

## 📧 Important Notes

### Sender Email Restriction
**IMPORTANT:** With Hostinger SMTP, you can only send emails FROM the authenticated email address (`jalalkhan@gennoor.com`). This is a security feature to prevent email spoofing.

This means:
- ✅ All emails will be sent FROM: `jalalkhan@gennoor.com`
- ✅ The display name will show: "Gennoor Tech Training" or appropriate department
- ✅ Reply-To can be set to different addresses (training@, sales@, etc.)

### Email Aliases Setup Required
To use different department emails (training@, sales@, info@, etc.), you need to:

1. **Create email aliases in Hostinger:**
   - Log into Hostinger control panel
   - Go to Email Accounts
   - Create these email accounts or aliases:
     - training@gennoor.com
     - sales@gennoor.com
     - info@gennoor.com
     - admin@gennoor.com
     - enquiry@gennoor.com

2. **For each alias, you can either:**
   - Create separate email accounts (with their own passwords)
   - Set them as aliases/forwarders to jalalkhan@gennoor.com

## 🧪 Testing Your Configuration

Run the test script to verify everything works:

```bash
node test-email.js
```

This will:
1. Verify SMTP connection
2. Send a test email to jalalkhan@gennoor.com
3. Show any errors if configuration is incorrect

## 🔧 Troubleshooting

If emails aren't sending, check:

1. **Password Special Characters**: Your password contains `#` which should work, but if issues occur, try escaping it
2. **Email Account Active**: Ensure jalalkhan@gennoor.com is active in Hostinger
3. **SMTP Enabled**: Check if SMTP is enabled for your email account
4. **Firewall**: Port 465 should be open for outbound connections
5. **Alternative Port**: If 465 doesn't work, try port 587 with SMTP_SECURE=false

## 📨 How Emails Will Work

### Training Enquiries
- **From:** jalalkhan@gennoor.com
- **Display Name:** Gennoor Tech Training
- **Reply-To:** training@gennoor.com (if configured)
- **CC:** sales@gennoor.com
- **Attachment:** PDF course/bootcamp brochure

### Certification Enquiries
- **From:** jalalkhan@gennoor.com
- **Display Name:** Gennoor Tech Certification Team
- **Reply-To:** training@gennoor.com (if configured)
- **CC:** enquiry@gennoor.com
- **Attachment:** None

### Admin Notifications
- **To:** admin@gennoor.com
- **CC:** Relevant department emails
- **Lead Scoring:** HOT/WARM/COLD in subject

## 🚀 Next Steps

1. **Test the email**: Run `node test-email.js`
2. **Create email accounts**: Set up department emails in Hostinger
3. **Test forms**: Submit test enquiries through the website
4. **Monitor logs**: Check for any email errors

## 📝 API Integration

The email service is integrated into:
- `/api/training-enquiry` - Training form submissions
- `/api/certification-enquiry` - Certification form submissions

Both will use jalalkhan@gennoor.com as the sender with appropriate display names.