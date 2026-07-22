const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

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

    // Prepare test emails
    const testEmails = [
      {
        name: 'Training Inquiry',
        to: 'jalalkhan@gennoor.com',
        subject: 'Test: New Training Inquiry - Azure AI Foundry Bootcamp',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0C1426 0%, #1e2936 100%); padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0;">Gennoor Tech</h1>
              <p style="color: #94A3B8; margin: 10px 0 0 0;">Training Inquiry Received</p>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #2563EB;">New Training Inquiry</h2>
              <p><strong>Name:</strong> Test User</p>
              <p><strong>Email:</strong> testuser@example.com</p>
              <p><strong>Phone:</strong> +91 9999999999</p>
              <p><strong>Company:</strong> Test Company Ltd</p>
              <p><strong>Training Program:</strong> Azure AI Foundry & Semantic Kernel Bootcamp</p>
              <p><strong>Message:</strong><br>
              I'm interested in the Azure AI Foundry bootcamp. Please share more details about the upcoming batches and pricing.</p>
            </div>
            <div style="background: #0C1426; padding: 20px; text-align: center;">
              <p style="color: #94A3B8; margin: 0; font-size: 12px;">
                © 2026 Gennoor Tech Private Limited<br>
                www.gennoor.com | training@gennoor.com
              </p>
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
        const info = await transporter.sendMail({
          from: `"Gennoor Tech Training" <${process.env.SMTP_USER}>`,
          to: email.to,
          subject: email.subject,
          html: email.html
        });

        console.log(`      ✅ Sent successfully!`);
        console.log(`      Message ID: ${info.messageId}`);
        console.log(`      Response: ${info.response}\n`);
      } catch (error) {
        console.log(`      ❌ Failed to send`);
        console.log(`      Error: ${error.message}\n`);
      }
    }

    console.log('=' .repeat(60));
    console.log('✅ EMAIL TEST COMPLETE!');
    console.log('\n💡 Check your inbox at jalalkhan@gennoor.com');

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
