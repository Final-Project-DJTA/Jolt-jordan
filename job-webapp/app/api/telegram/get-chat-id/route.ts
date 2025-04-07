import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json(
        { success: false, error: 'Missing TELEGRAM_BOT_TOKEN' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const data = await response.json();
    
    // Extract chat IDs from the updates
    const chatIds = data.result
      .filter(update => update.message && update.message.chat)
      .map(update => ({
        chat_id: update.message.chat.id,
        username: update.message.chat.username || 'unknown',
        first_name: update.message.chat.first_name || 'unknown',
        message: update.message.text,
        date: new Date(update.message.date * 1000).toISOString()
      }));
    
    return NextResponse.json({
      success: true,
      chat_ids: chatIds
    });
    
  } catch (error) {
    console.error('Error getting chat IDs:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
