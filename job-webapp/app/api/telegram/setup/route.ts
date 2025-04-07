import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'status';
    
    // Get bot token from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { success: false, error: 'Missing TELEGRAM_BOT_TOKEN environment variable' },
        { status: 500 }
      );
    }

    // Get webhook URL from environment or use default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    console.log("Base URL from env:", baseUrl);
    
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing NEXT_PUBLIC_APP_URL environment variable' },
        { status: 500 }
      );
    }
    
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;
    console.log("Webhook URL:", webhookUrl);
    
    // Check action
    if (action === 'set') {
      // Set webhook
      console.log(`Setting webhook to: ${webhookUrl}`);
      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          drop_pending_updates: true,
          allowed_updates: ["message", "callback_query"] // Only allow these update types
        }),
      });
      
      const data = await response.json();
      console.log('Webhook setup response:', data);
      
      return NextResponse.json({
        success: data.ok,
        result: data.result || data.description,
        webhook_url: webhookUrl
      });
    } 
    else if (action === 'remove') {
      // Remove webhook
      const response = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      return NextResponse.json({
        success: data.ok,
        result: data.result || data.description
      });
    } 
    else if (action === 'test') {
      // Test sending a message (to chat ID from query param)
      const chatId = searchParams.get('chat_id');
      if (!chatId) {
        return NextResponse.json(
          { success: false, error: 'Missing chat_id parameter' },
          { status: 400 }
        );
      }
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'This is a test message from your Jolt Jordan bot. If you see this, the bot is working correctly!',
        }),
      });
      
      const data = await response.json();
      
      return NextResponse.json({
        success: data.ok,
        result: data.result || data.description
      });
    } 
    else if (action === 'getUpdates') {
      // Get recent updates to help debugging
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
      const data = await response.json();
      
      return NextResponse.json({
        success: data.ok,
        updates: data.result || [],
      });
    }
    else {
      // Get webhook info (default)
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const data = await response.json();
      
      return NextResponse.json({
        success: data.ok,
        webhook_info: data.result,
        current_setup: {
          webhook_url: webhookUrl,
          base_url: baseUrl,
          env_vars_set: {
            TELEGRAM_BOT_TOKEN: !!botToken,
            NEXT_PUBLIC_APP_URL: !!baseUrl
          }
        }
      });
    }
  } catch (error) {
    console.error('Error in telegram setup:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
