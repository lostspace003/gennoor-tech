require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendTraining() {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const pdfDir = './public/Gennoor-Bootcamp-Brochures';
  const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
  const pdfFile = pdfFiles[0];

  const mailOptions = {
    from: '"Gennoor Training Team" <jalalkhan@gennoor.com>',
    to: 'lostspace003@outlook.com',
    replyTo: 'training@gennoor.com',
    subject: 'AI Development Framework Training - Complete Information',
    html: '<h2>AI Training Program</h2><p>Dear User,</p><p>Thank you for your interest in our AI Development Framework training!</p><ul><li>Duration: 5 days</li><li>Certification: AI-103</li><li>Platform: Azure AI Foundry</li></ul><p>Please find attached our detailed brochure.</p><p>Contact: training@gennoor.com</p>',
    attachments: [{
      filename: pdfFile,
      path: path.join(pdfDir, pdfFile)
    }]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Training email sent! ID:', info.messageId);
    console.log('📎 With PDF:', pdfFile);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendTraining();
