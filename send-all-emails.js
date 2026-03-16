const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function sendAllEmails() {
  console.log('📧 SENDING ALL EMAIL TYPES TO USER');
  console.log('='.repeat(60));

  // Create transporter (same as working test-email.js)
  const port = parseInt(process.env.SMTP_PORT || '587');
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('   ✅ SMTP connection successful!\n');
  } catch (error) {
    console.log('   ❌ SMTP connection failed:', error.message);
    return;
  }

  const userEmail = 'lostspace003@outlook.com';

  // Get PDF files
  const pdfDir = path.join(__dirname, 'public', 'Gennoor-Bootcamp-Brochures');
  let pdfFiles = [];
  try {
    pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf')).slice(0, 2);
    console.log(`📎 Found ${pdfFiles.length} PDF files for attachments\n`);
  } catch (err) {
    console.log('📎 No PDFs found, sending without attachments\n');
  }

  // Email 1: Training Inquiry with PDF
  try {
    console.log('📨 Sending: Training Inquiry Email');
    const info1 = await transporter.sendMail({
      from: '"Gennoor Training Team" <jalalkhan@gennoor.com>',
      to: userEmail,
      replyTo: 'training@gennoor.com',
      subject: 'AI Development Framework - Training Information',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1a73e8;">AI Development Framework Training</h2>
          <p>Thank you for your interest in our comprehensive AI training program!</p>

          <h3>Course Highlights:</h3>
          <ul>
            <li>Duration: 5 days intensive training</li>
            <li>Certification: AI-103 (Azure AI App & Agent Developer)</li>
            <li>Platform: Azure AI Foundry & Semantic Kernel</li>
            <li>Trainer: 16+ Microsoft Certifications</li>
          </ul>

          <p>Please find attached our detailed course brochure.</p>

          <p>For enrollment: <strong>training@gennoor.com</strong></p>

          <p>Best regards,<br>Gennoor Training Team</p>
        </div>
      `,
      attachments: pdfFiles.slice(0, 1).map(f => ({
        filename: f,
        path: path.join(pdfDir, f)
      }))
    });
    console.log(`   ✅ Sent! ID: ${info1.messageId}\n`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}\n`);
  }

  // Email 2: Certification Path
  try {
    console.log('📨 Sending: Certification Roadmap Email');
    const info2 = await transporter.sendMail({
      from: '"Gennoor Certifications" <jalalkhan@gennoor.com>',
      to: userEmail,
      replyTo: 'enquiry@gennoor.com',
      subject: 'Microsoft AI Certification Path 2025-2026',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1a73e8;">Your AI Certification Journey</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f0f8ff;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>AI-901</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Azure AI Fundamentals</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>AI-103</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">Azure AI App & Agent Developer</td>
            </tr>
            <tr style="background: #f0f8ff;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>AI-300</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">MLOps Engineer Associate</td>
            </tr>
          </table>

          <p>Attached: Complete bootcamp catalog with all certifications</p>

          <p>Questions? Contact: <strong>enquiry@gennoor.com</strong></p>
        </div>
      `,
      attachments: pdfFiles.map(f => ({
        filename: f,
        path: path.join(pdfDir, f)
      }))
    });
    console.log(`   ✅ Sent! ID: ${info2.messageId}\n`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}\n`);
  }

  // Email 3: Special Offer
  try {
    console.log('📨 Sending: Special Offer Email');
    const info3 = await transporter.sendMail({
      from: '"Gennoor Sales" <jalalkhan@gennoor.com>',
      to: userEmail,
      replyTo: 'sales@gennoor.com',
      subject: '🎉 20% Early Bird Discount - Limited Time',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1 style="margin: 0;">Special Offer - 20% OFF</h1>
            <p style="font-size: 18px;">All AI Bootcamps</p>
          </div>

          <div style="padding: 20px;">
            <h3>Featured Programs:</h3>
            <ul>
              <li>Azure AI Foundry & Semantic Kernel (5 days)</li>
              <li>Microsoft Applied Skills (6 certs in 5 days)</li>
              <li>AI Development Framework</li>
            </ul>

            <div style="background: #fffbf0; padding: 15px; border-left: 4px solid #ffa000; margin: 20px 0;">
              <strong>Your Savings:</strong><br>
              Regular: $2,500 → <span style="color: #d93025; font-size: 20px;"><strong>Now: $2,000</strong></span><br>
              <em>Valid until March 31, 2026</em>
            </div>

            <p>Register: <strong>sales@gennoor.com</strong></p>
          </div>
        </div>
      `
    });
    console.log(`   ✅ Sent! ID: ${info3.messageId}\n`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}\n`);
  }

  console.log('='.repeat(60));
  console.log('📊 EMAIL CAMPAIGN COMPLETE');
  console.log(`✅ Multiple emails sent to: ${userEmail}`);
  console.log('📬 Check lostspace003@outlook.com inbox');
  console.log('\nEmails sent from jalalkhan@gennoor.com with:');
  console.log('  • Reply-To addresses for each department');
  console.log('  • PDF attachments where applicable');
  console.log('  • Professional HTML formatting');
}

sendAllEmails().catch(console.error);