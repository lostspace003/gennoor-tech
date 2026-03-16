const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testAllMethods() {
  console.log('🔍 COMPREHENSIVE EMAIL TEST');
  console.log('='.repeat(60));

  console.log('\n📧 Configuration:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Pass: ${process.env.SMTP_PASS?.slice(0,3)}...${process.env.SMTP_PASS?.slice(-3)}`);

  const testMethods = [
    { name: 'SSL (Port 465)', port: 465, secure: true },
    { name: 'TLS (Port 587)', port: 587, secure: false },
    { name: 'Plain (Port 25)', port: 25, secure: false }
  ];

  for (const method of testMethods) {
    console.log(`\n🔐 Testing ${method.name}:`);

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: method.port,
        secure: method.secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Test connection
      await transporter.verify();
      console.log(`   ✅ Connection successful!`);

      // Send test email
      const info = await transporter.sendMail({
        from: `"Gennoor Tech" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `Test Email - ${method.name} Working!`,
        text: `This test email confirms that ${method.name} is working correctly for Gennoor Tech.`,
        html: `<h2>Success!</h2><p>This test email confirms that <b>${method.name}</b> is working correctly for Gennoor Tech.</p>`
      });

      console.log(`   ✅ Email sent! ID: ${info.messageId}`);
      console.log(`   📨 Check your inbox at: ${process.env.SMTP_USER}`);

      // If one method works, we're done
      console.log('\n' + '='.repeat(60));
      console.log('🎉 EMAIL CONFIGURATION SUCCESSFUL!');
      console.log(`✅ Use ${method.name} in your application`);
      console.log('\nUpdate .env.local with:');
      console.log(`SMTP_PORT=${method.port}`);
      console.log(`SMTP_SECURE=${method.secure}`);
      return;

    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('⚠️ ALL METHODS FAILED - ACTION REQUIRED:');
  console.log('\n1. Log into Hostinger Control Panel');
  console.log('2. Go to Email Accounts → jalalkhan@gennoor.com');
  console.log('3. Check for:');
  console.log('   • "SMTP Authentication" - must be enabled');
  console.log('   • "App Passwords" - create one if exists');
  console.log('   • Account status - must be active');
  console.log('\n4. Alternative credentials to try:');
  console.log('   • Your Hostinger webmail password');
  console.log('   • An app-specific password');
  console.log('   • Contact Hostinger support for SMTP credentials');
}

testAllMethods().catch(console.error);