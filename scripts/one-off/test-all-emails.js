const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testAllEmails() {
  console.log('📧 TESTING ALL EMAIL SCENARIOS');
  console.log('='.repeat(60));

  // Create transporter
  const transporter = nodemailer.createTransport({
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

  // Test user email
  const testUserEmail = 'lostspace003@outlook.com';
  const testUserName = 'Test User';

  // Find PDF files for attachments
  const pdfDir = path.join(__dirname, 'public', 'Gennoor-Bootcamp-Brochures');
  const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf')).slice(0, 2);

  const emailScenarios = [
    {
      name: 'Training Inquiry',
      from: 'training@gennoor.com',
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
          </ul>

          <p>Please find attached our detailed course brochures.</p>

          <p>For immediate enrollment or questions, please contact:</p>
          <ul>
            <li>📧 Email: training@gennoor.com</li>
            <li>📞 Phone: +966 50 123 4567</li>
          </ul>

          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Training Team</strong><br>
            Gennoor Tech<br>
            <em>Empowering AI Excellence</em>
          </p>
        </div>
      `,
      attachments: pdfFiles.slice(0, 1).map(file => ({
        filename: file,
        path: path.join(pdfDir, file)
      }))
    },
    {
      name: 'Certification Query',
      from: 'enquiry@gennoor.com',
      subject: 'Microsoft AI Certifications - Your Path to Success',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">Microsoft AI Certification Roadmap 2025-2026</h2>

          <p>Dear ${testUserName},</p>

          <p>Thank you for inquiring about Microsoft AI certifications. Here's our recommended path:</p>

          <h3>📊 Certification Track:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>AI-901</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">Azure AI Fundamentals</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>AI-103</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">Azure AI App & Agent Developer</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>AI-300</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">MLOps Engineer Associate</td>
            </tr>
          </table>

          <h3>✅ Why Choose Gennoor Tech:</h3>
          <ul>
            <li>16+ Active Microsoft Certifications</li>
            <li>Expert trainers with real-world experience</li>
            <li>100% exam pass guarantee</li>
            <li>Hands-on labs with Azure AI Foundry</li>
          </ul>

          <p>Attached are our certification bootcamp brochures for your review.</p>

          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Certification Team</strong><br>
            Gennoor Tech<br>
            📧 enquiry@gennoor.com
          </p>
        </div>
      `,
      attachments: pdfFiles.slice(0, 2).map(file => ({
        filename: file,
        path: path.join(pdfDir, file)
      }))
    },
    {
      name: 'Sales Follow-up',
      from: 'sales@gennoor.com',
      subject: 'Special Offer: 20% Early Bird Discount on AI Bootcamps',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>🎉 Limited Time Offer!</h1>
            <h2>20% OFF All AI Bootcamps</h2>
          </div>

          <div style="padding: 20px;">
            <p>Dear ${testUserName},</p>

            <p>Great news! We're offering an exclusive early bird discount on our flagship AI training programs.</p>

            <h3>🔥 Featured Bootcamps:</h3>
            <ul>
              <li><strong>Azure AI Foundry & Semantic Kernel</strong> - 5 days intensive</li>
              <li><strong>Microsoft Applied Skills</strong> - 6 certifications in 5 days</li>
              <li><strong>AI Development Framework</strong> - Complete AI solution architect track</li>
            </ul>

            <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #1a73e8; margin: 20px 0;">
              <strong>💰 Your Savings:</strong><br>
              Regular Price: $2,500<br>
              <span style="color: #d93025; font-size: 18px;"><strong>Discounted Price: $2,000</strong></span><br>
              <em>Valid until: March 31, 2026</em>
            </div>

            <p><strong>Register now to secure your spot!</strong></p>

            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Sales Team</strong><br>
              Gennoor Tech<br>
              📧 sales@gennoor.com<br>
              📞 +966 50 123 4567
            </p>
          </div>
        </div>
      `,
      attachments: []
    },
    {
      name: 'Schedule Confirmation',
      from: 'schedule@gennoor.com',
      subject: 'Training Schedule Confirmed - AI-103 Bootcamp',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #34a853; color: white; padding: 15px; text-align: center;">
            <h2>✅ Training Schedule Confirmed!</h2>
          </div>

          <div style="padding: 20px;">
            <p>Dear ${testUserName},</p>

            <p>Your training schedule has been confirmed. Here are the details:</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📅 Schedule Details:</h3>
              <table style="width: 100%;">
                <tr><td><strong>Course:</strong></td><td>AI-103 Azure AI Developer</td></tr>
                <tr><td><strong>Dates:</strong></td><td>March 20-24, 2026</td></tr>
                <tr><td><strong>Time:</strong></td><td>9:00 AM - 5:00 PM (GMT+3)</td></tr>
                <tr><td><strong>Format:</strong></td><td>Online via Microsoft Teams</td></tr>
                <tr><td><strong>Trainer:</strong></td><td>Syed Jalal Ud Din</td></tr>
              </table>
            </div>

            <h3>📋 Pre-Training Checklist:</h3>
            <ul>
              <li>✓ Azure subscription activated</li>
              <li>✓ Visual Studio Code installed</li>
              <li>✓ Python 3.9+ installed</li>
              <li>✓ Course materials downloaded</li>
            </ul>

            <p>Meeting link and materials will be sent 24 hours before the session.</p>

            <p style="margin-top: 30px;">
              See you in training!<br>
              <strong>Training Coordination</strong><br>
              Gennoor Tech<br>
              📧 schedule@gennoor.com
            </p>
          </div>
        </div>
      `,
      attachments: []
    },
    {
      name: 'Welcome Email',
      from: 'info@gennoor.com',
      subject: 'Welcome to Gennoor Tech - Your AI Learning Journey Begins',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a73e8 0%, #34a853 100%); color: white; padding: 30px; text-align: center;">
            <h1>Welcome to Gennoor Tech!</h1>
            <p style="font-size: 18px;">Your Gateway to AI Excellence</p>
          </div>

          <div style="padding: 20px;">
            <p>Dear ${testUserName},</p>

            <p>Welcome to Gennoor Tech! We're thrilled to have you join our community of AI professionals and learners.</p>

            <h3>🚀 What We Offer:</h3>
            <ul>
              <li><strong>14 Specialized Bootcamps</strong> covering all aspects of AI</li>
              <li><strong>26 Microsoft Courses</strong> with official certifications</li>
              <li><strong>Expert Trainers</strong> with 16+ Microsoft certifications</li>
              <li><strong>Hands-on Labs</strong> using Azure AI Foundry</li>
            </ul>

            <h3>📚 Popular Learning Paths:</h3>
            <ol>
              <li>AI Fundamentals → AI Developer → AI Architect</li>
              <li>Data Science → MLOps → AI Engineer</li>
              <li>Copilot Studio → Semantic Kernel → AI Agents</li>
            </ol>

            <div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>🎁 New Member Benefits:</strong>
              <ul style="margin: 5px 0;">
                <li>Free consultation session</li>
                <li>10% discount on first bootcamp</li>
                <li>Access to exclusive webinars</li>
              </ul>
            </div>

            <p>Explore our complete catalog of training programs attached.</p>

            <p style="margin-top: 30px;">
              Welcome aboard!<br>
              <strong>Gennoor Tech Team</strong><br>
              📧 info@gennoor.com<br>
              🌐 www.gennoor.com
            </p>
          </div>
        </div>
      `,
      attachments: pdfFiles.map(file => ({
        filename: file,
        path: path.join(pdfDir, file)
      }))
    }
  ];

  // Send each email scenario
  for (const scenario of emailScenarios) {
    console.log(`\n📨 Testing: ${scenario.name}`);
    console.log(`   From: ${scenario.from}`);
    console.log(`   To: ${testUserEmail}`);
    console.log(`   Attachments: ${scenario.attachments.length} PDF(s)`);

    try {
      const info = await transporter.sendMail({
        from: `"Gennoor Tech" <${scenario.from}>`,
        to: testUserEmail,
        subject: scenario.subject,
        html: scenario.html,
        attachments: scenario.attachments,
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'Gennoor Tech Email System'
        }
      });

      console.log(`   ✅ Sent successfully! ID: ${info.messageId}`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 EMAIL TEST SUMMARY');
  console.log(`✅ All email scenarios tested`);
  console.log(`📧 Emails sent to: ${testUserEmail}`);
  console.log(`📎 PDFs attached where applicable`);
  console.log('\n💡 Check the inbox at lostspace003@outlook.com');
  console.log('   You should receive 5 different email types:');
  console.log('   1. Training Inquiry (with PDF)');
  console.log('   2. Certification Query (with 2 PDFs)');
  console.log('   3. Sales Follow-up');
  console.log('   4. Schedule Confirmation');
  console.log('   5. Welcome Email (with all PDFs)');
}

testAllEmails().catch(console.error);