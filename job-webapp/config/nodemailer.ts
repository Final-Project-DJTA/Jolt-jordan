import nodemailer from 'nodemailer';

// Configure nodemailer with your email service
// For Gmail, you may need to use an "app password" if 2FA is enabled
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // For port 587, use secure: false with STARTTLS
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  tls: {
    rejectUnauthorized: false // Helps with self-signed certificates, but only use in development
  },
  debug: true, // Show debug information
});

export async function sendVerificationEmail(to: string, token: string, telegramId: string) {
  // Base URL should be your application's URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/telegram/verify?token=${token}&telegramId=${telegramId}`;
  
  console.log(`Attempting to send email to ${to} with verification URL: ${verificationUrl}`);
  console.log(`Using email credentials: ${process.env.EMAIL_USER}`);
  
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
    console.log('Sending email with Nodemailer...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Detailed error sending email:', error);
    
    // Try using an alternative method for testing - Ethereal email
    console.log('Attempting to use Ethereal test account as fallback...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      const info = await testTransporter.sendMail(mailOptions);
      console.log('Test email sent:', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return info;
    } catch (fallbackError) {
      console.error('Even fallback email failed:', fallbackError);
      throw error; // Throw the original error
    }
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
    
    // Try using Ethereal for testing
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('Created test account:', testAccount.user);
      console.log('Test account works - use these credentials for testing');
      return {
        success: false,
        mainError: error,
        etherealTestAccount: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      };
    } catch (testError) {
      console.error('Could not create test account:', testError);
      return false;
    }
  }
}

// Function to send a test email (useful for debugging)
export async function sendTestEmail(to: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Jolt Jordan Test" <no-reply@jolt-jordan.com>',
    to,
    subject: 'Test Email from Jolt Jordan',
    text: 'This is a test email from Jolt Jordan. If you received this, email sending is working properly!',
    html: '<h1>Test Email</h1><p>This is a test email from Jolt Jordan. If you received this, email sending is working properly!</p>'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    
    // Try using Ethereal as fallback
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      const info = await testTransporter.sendMail(mailOptions);
      console.log('Fallback test email sent with Ethereal:', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      
      return {
        success: true,
        fallback: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
        etherealAccount: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      };
    } catch (fallbackError) {
      console.error('Even fallback email failed:', fallbackError);
      throw error;
    }
  }
}
