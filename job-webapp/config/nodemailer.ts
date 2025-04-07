import nodemailer from 'nodemailer';

// Configure nodemailer with your email service
// For Gmail, you may need to use an "app password" if 2FA is enabled
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export async function sendVerificationEmail(to: string, token: string, telegramId: string) {
  // Base URL should be your application's URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/telegram/verify?token=${token}&telegramId=${telegramId}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Jolt Jordan" <no-reply@jolt-jordan.com>',
    to,
    subject: 'Verify your Telegram account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your Telegram account</h2>
        <p>Click the button below to verify your Telegram account with Jolt Jordan:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-size: 16px;">
            Verify Account
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this verification, you can ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Test the email configuration
export async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}
