import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const { chatId, message } = await req.json();
    
    if (!botToken) {
      return NextResponse.json({ error: 'Missing Telegram bot token in environment variables' }, { status: 500 });
    }
    
    console.log(`Sending test message to chat ${chatId}: "${message}"`);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message || 'Test message from Jolt Jordan application'
      })
    });
    
    const data = await response.json();
    console.log('Telegram API response:', data);
    
    if (!data.ok) {
      return NextResponse.json({ error: data.description }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, response: data });
  } catch (error) {
    console.error('Error sending test message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}