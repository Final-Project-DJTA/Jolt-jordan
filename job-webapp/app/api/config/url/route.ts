import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return the app URL from environment variables
    return NextResponse.json({
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });
  } catch (error) {
    console.error('Error getting app URL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}