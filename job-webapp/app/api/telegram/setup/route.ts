import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'status';
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json({ error: 'Missing Telegram bot token in environment variables' }, { status: 500 });
    }

    // Get webhook info
    if (action === 'status') {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // Set webhook to current URL
    if (action === 'set') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      
      if (!appUrl) {
        return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL in environment variables' }, { status: 500 });
      }
      
      const webhookUrl = `${appUrl}/api/telegram/webhook`;
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          drop_pending_updates: true,
          allowed_updates: ["message", "callback_query"]
        })
      });
      
      const data = await response.json();
      return NextResponse.json({ 
        success: data.ok, 
        message: data.ok ? 'Webhook set successfully' : data.description,
        webhook_url: webhookUrl
      });
    }
    
    // Delete webhook
    if (action === 'delete') {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`);
      const data = await response.json();
      return NextResponse.json({ 
        success: data.ok, 
        message: data.ok ? 'Webhook deleted successfully' : data.description 
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error with webhook setup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
