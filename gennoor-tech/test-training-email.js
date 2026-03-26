const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testTrainingEmail() {
  console.log('📧 SENDING TRAINING INQUIRY EMAIL');
  console.log('='.repeat(60));

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Test user
  const testUserEmail = 'lostspace003@outlook.com';
  const testUserName = 'Test User';

  // Get PDF attachment
  const pdfDir = path.join(__dirname, 'public', 'Gennoor-Bootcamp-Brochures');
  const pdfFile = fs.readdirSync(pdfDir).find(f => f.includes('AI-Development-Framework') && f.endsWith('.pdf'));

  const emailContent = {
    from: '"Gennoor Tech Training" <jalalkhan@gennoor.com>',
    replyTo: 'training@gennoor.com',
    to: testUserEmail,
    subject: 'Re: Your Training Inquiry - AI Development Framework',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a73e8;">Thank you for your interest in our AI Development Framework training!</h2>

        <p>Dear ${testUserName},</p>

        <p>We're excited to help you advance your career with our comprehensive AI training programs.</p>

        <h3>Training Details:</h3>
        <ul>
          <li><strong>Course:</strong> AI Development Framework</li>
          <li><strong>Duration:</strong> 5 days</li>
          <li><strong>Format:</strong> Online/Onsite</li>
          <li><strong>Certification:</strong> AI-103 (2025-2026)</li>
          <li><strong>Trainer:</strong> 16+ Microsoft Certifications</li>
        </ul>

        <h3>What You'll Learn:</h3>
        <ul>
          <li>Azure AI Foundry platform</li>
          <li>Building AI agents with Semantic Kernel</li>
          <li>MLOps and deployment strategies</li>
          <li>Real-world project implementation</li>
        </ul>

        <p>Please find attached our detailed course brochure with complete syllabus and pricing.</p>

        <p>For immediate enrollment or questions, please contact:</p>
        <ul>
          <li>📧 Email: training@gennoor.com</li>
          <li>📞 Phone: +966 50 123 4567</li>
          <li>💬 WhatsApp: +966 50 123 4567</li>
        </ul>

        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Training Team</strong><br>
          Gennoor Tech<br>
          <em>Empowering AI Excellence</em>
        </p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #666;">
          This email was sent from jalalkhan@gennoor.com on behalf of the Training Department.<br>
          For training inquiries, please reply to training@gennoor.com
        </p>
      </div>
    `,
    attachments: pdfFile ? [{
      filename: pdfFile,
      path: path.join(pdfDir, pdfFile)
    }] : []
  };

  try {
    const info = await transporter.sendMail(emailContent);
    console.log('\n✅ Training email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   From: ${emailContent.from}`);
    console.log(`   Reply-To: ${emailContent.replyTo}`);
    console.log(`   To: ${testUserEmail}`);
    console.log(`   Attachment: ${pdfFile || 'No PDF found'}`);
    console.log('\n📬 Check lostspace003@outlook.com for the training inquiry email');
  } catch (error) {
    console.log('\n❌ Failed to send:', error.message);
  }
}

testTrainingEmail().catch(console.error);