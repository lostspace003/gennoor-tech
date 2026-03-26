const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 ADVANCED EMAIL DEBUGGING');
console.log('='.repeat(60));

// Test different connection methods
async function testConnection() {
  console.log('\n📧 Configuration Details:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Pass Length: ${process.env.SMTP_PASS?.length} characters`);

  // Method 1: SSL on port 465
  console.log('\n🔐 Method 1: SSL (Port 465)');
  try {
    const transporter1 = nodemailer.createTransporter({
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

    await transporter1.verify();
    console.log('   ✅ SUCCESS! SSL connection works');

    // Try sending email
    console.log('\n📨 Sending test email...');
    const info = await transporter1.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Gennoor Tech Email Test - SUCCESS',
      text: 'Your SMTP configuration is working correctly!',
      html: '<b>Your SMTP configuration is working correctly!</b>'
    });
    console.log('   ✅ Email sent! Message ID:', info.messageId);

  } catch (error) {
    console.log('   ❌ Failed:', error.message);
  }

  // Method 2: TLS/STARTTLS on port 587
  console.log('\n🔐 Method 2: TLS/STARTTLS (Port 587)');
  try {
    const transporter2 = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter2.verify();
    console.log('   ✅ SUCCESS! TLS connection works');

    // Try sending email
    console.log('\n📨 Sending test email...');
    const info = await transporter2.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Gennoor Tech Email Test - SUCCESS',
      text: 'Your SMTP configuration is working correctly!',
      html: '<b>Your SMTP configuration is working correctly!</b>'
    });
    console.log('   ✅ Email sent! Message ID:', info.messageId);

  } catch (error) {
    console.log('   ❌ Failed:', error.message);
  }

  // Method 3: Plain authentication (less secure)
  console.log('\n🔐 Method 3: Plain Authentication (Port 25)');
  try {
    const transporter3 = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: 25,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter3.verify();
    console.log('   ✅ SUCCESS! Plain connection works');

  } catch (error) {
    console.log('   ❌ Failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 NEXT STEPS:');
  console.log('1. Check your Hostinger control panel for:');
  console.log('   • SMTP Authentication settings');
  console.log('   • App-specific passwords');
  console.log('   • Email account status');
  console.log('2. Common Hostinger SMTP settings:');
  console.log('   • Server: smtp.hostinger.com');
  console.log('   • Ports: 465 (SSL) or 587 (TLS)');
  console.log('   • Username: Full email address');
  console.log('   • Password: Email password OR app password');
  console.log('3. Alternative: Try webmail password if different');
}

testConnection().catch(console.error);