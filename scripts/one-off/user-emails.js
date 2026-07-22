const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function testEmail() {
  console.log('🔍 TESTING EMAIL CONFIGURATION');
  console.log('=' .repeat(60));

  // Display configuration (hide password)
  console.log('\n📧 Email Configuration:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Pass: ${process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-3) : 'NOT SET'}`);

  // Create transporter
  const port = parseInt(process.env.SMTP_PORT || '587');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log('\n🔌 Testing SMTP Connection...');

  try {
    // Verify connection
    await transporter.verify();
    console.log('   ✅ SMTP connection successful!');

    // Get PDF files for attachments
    const pdfDir = path.join(__dirname, 'public', 'Gennoor-Bootcamp-Brochures');
    let pdfFiles = [];
    try {
      pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf')).slice(0, 3);
      console.log(`   📎 Found ${pdfFiles.length} PDF files for attachments`);
    } catch (err) {
      console.log('   📎 No PDFs found for attachments');
    }

    // Prepare test emails
    const testEmails = [
      {
        name: 'Training Inquiry Response',
        to: 'lostspace003@outlook.com',
        replyTo: 'training@gennoor.com',
        subject: 'AI Development Framework - Complete Training Information',
        attachments: pdfFiles.slice(0, 1).map(f => ({
          filename: f,
          path: path.join(pdfDir, f)
        })),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0C1426 0%, #1e2936 100%); padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0;">Gennoor Tech</h1>
              <p style="color: #94A3B8; margin: 10px 0 0 0;">AI Training Excellence</p>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #2563EB;">AI Development Framework Training</h2>
              <p>Thank you for your interest in our comprehensive AI training programs!</p>

              <h3>📚 Course Details:</h3>
              <ul>
                <li><strong>Duration:</strong> 5 days intensive training</li>
                <li><strong>Certification:</strong> AI-103 (Azure AI App & Agent Developer)</li>
                <li><strong>Platform:</strong> Azure AI Foundry</li>
                <li><strong>Trainer:</strong> 16+ Microsoft Certifications</li>
                <li><strong>Format:</strong> Online/Onsite Available</li>
              </ul>

              <h3>✨ What You'll Learn:</h3>
              <ul>
                <li>Building AI agents with Semantic Kernel</li>
                <li>Azure AI Foundry platform mastery</li>
                <li>MLOps and deployment strategies</li>
                <li>Real-world project implementation</li>
              </ul>

              <p><strong>Next Batch:</strong> March 25, 2026</p>
              <p><strong>Investment:</strong> $2,000 (Early bird discount applied)</p>

              <p>Please find attached our detailed course brochure.</p>
            </div>
            <div style="background: #0C1426; padding: 20px; text-align: center;">
              <p style="color: #94A3B8; margin: 0; font-size: 12px;">
                © 2026 Gennoor Tech Private Limited<br>
                www.gennoor.com | training@gennoor.com
              </p>
            </div>
          </div>
        `
      },
      {
        name: 'Certification Roadmap',
        to: 'lostspace003@outlook.com',
        replyTo: 'enquiry@gennoor.com',
        subject: 'Microsoft AI Certifications 2025-2026 - Complete Guide',
        attachments: pdfFiles.map(f => ({
          filename: f,
          path: path.join(pdfDir, f)
        })),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a73e8; padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0;">Microsoft AI Certification Path</h1>
            </div>
            <div style="padding: 30px;">
              <h2>Your Journey to AI Excellence</h2>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f0f8ff;">
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Code</th>
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Certification</th>
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Level</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd;"><strong>AI-901</strong></td>
                  <td style="padding: 12px; border: 1px solid #ddd;">Azure AI Fundamentals</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">Foundation</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 12px; border: 1px solid #ddd;"><strong>AI-103</strong></td>
                  <td style="padding: 12px; border: 1px solid #ddd;">Azure AI App & Agent Developer</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">Associate</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd;"><strong>AI-300</strong></td>
                  <td style="padding: 12px; border: 1px solid #ddd;">MLOps Engineer Associate</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">Advanced</td>
                </tr>
              </table>

              <h3>🎯 Why Choose Gennoor Tech?</h3>
              <ul>
                <li>100% Exam Pass Guarantee</li>
                <li>Hands-on Labs with Azure AI Foundry</li>
                <li>Expert Trainers with Real-world Experience</li>
                <li>Post-training Support & Mentorship</li>
              </ul>

              <p><strong>Special Offer:</strong> Complete all 3 certifications and save 25%!</p>

              <p>All bootcamp brochures attached for your reference.</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <p>For enrollment: <strong>enquiry@gennoor.com</strong></p>
            </div>
          </div>
        `
      }
    ];

    console.log('\n📤 Sending Test Email...\n');

    for (const email of testEmails) {
      console.log(`   📨 Sending: ${email.name}`);
      console.log(`      To: ${email.to}`);
      console.log(`      Subject: ${email.subject}`);

      try {
        const mailOptions = {
          from: `"Gennoor Tech" <${process.env.SMTP_USER}>`,
          to: email.to,
          subject: email.subject,
          html: email.html
        };

        // Add reply-to if specified
        if (email.replyTo) {
          mailOptions.replyTo = email.replyTo;
        }

        // Add attachments if specified
        if (email.attachments && email.attachments.length > 0) {
          mailOptions.attachments = email.attachments;
          console.log(`      📎 Attachments: ${email.attachments.length} file(s)`);
        }

        const info = await transporter.sendMail(mailOptions);

        console.log(`      ✅ Sent successfully!`);
        console.log(`      Message ID: ${info.messageId}`);
        console.log(`      Response: ${info.response}\n`);
      } catch (error) {
        console.log(`      ❌ Failed to send`);
        console.log(`      Error: ${error.message}\n`);
      }
    }

    console.log('=' .repeat(60));
    console.log('✅ EMAIL CAMPAIGN COMPLETE!');
    console.log('\n💡 Check inbox at: lostspace003@outlook.com');
    console.log('📧 Emails sent with:');
    console.log('   • Professional HTML formatting');
    console.log('   • PDF attachments (bootcamp brochures)');
    console.log('   • Department-specific reply-to addresses');

  } catch (error) {
    console.log('   ❌ SMTP connection failed!');
    console.log(`   Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify SMTP credentials in .env.local');
    console.log('   3. Ensure port 465 is not blocked');
    console.log('   4. Check if 2FA is enabled on email account');
  }
}

// Run the test
testEmail().catch(console.error);
