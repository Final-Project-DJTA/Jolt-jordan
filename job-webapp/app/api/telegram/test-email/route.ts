import { NextResponse } from 'next/server';
import { sendTestEmail, testEmailConfig } from '@/config/nodemailer';

export async function GET(req: Request) {
  try {
    // Verify configuration
    const configResult = await testEmailConfig();
    
    return NextResponse.json({
      success: true,
      emailConfig: configResult
    });
  } catch (error) {
    console.error('Error testing email config:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Get email from request body
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email is required' 
        },
        { status: 400 }
      );
    }
    
    // Send test email
    const result = await sendTestEmail(email);
    
    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
