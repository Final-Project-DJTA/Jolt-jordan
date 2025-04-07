import { NextResponse } from 'next/server';
import UserModel from '@/db/models/userModel';
import { errHandler } from "@/helpers/errHandler";
import { CustomError } from "@/types";

// Simple in-memory cache to store user state in the Telegram chat
// In production, use a proper database or Redis
const userStates: Record<number, { state: string; data?: any }> = {};

export async function POST(req: Request) {
  // Debug information to console for troubleshooting
  console.log("=== TELEGRAM WEBHOOK RECEIVED ===");
  
  try {
    // Get raw body for inspection
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);
    
    // Parse the body as JSON
    const update = JSON.parse(rawBody);
    console.log("Parsed update:", JSON.stringify(update, null, 2));
    
    // Bot token should be stored in environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error("Missing TELEGRAM_BOT_TOKEN environment variable");
      throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable');
    }

    // Check if it's a message event
    if (update.message) {
      const { chat, text, from } = update.message;
      const chatId = chat.id;
      const telegramId = from.id.toString();
      
      console.log(`📱 Received message: "${text || '[no text]'}" from user ${from.username || from.first_name} (ID: ${telegramId}, Chat ID: ${chatId})`);
      
      // Handle /start command - this is triggered when a user starts the bot
      if (text === '/start') {
        console.log(`🚀 Processing /start command for chat ID ${chatId}`);
        // Reset user state
        userStates[chatId] = { state: 'INITIAL' };
        
        try {
          // Send welcome message with a button to link account
          const result = await sendTelegramMessage(
            chatId,
            'Welcome to Jolt Jordan! I can help you receive job notifications and updates. Please link your account to get started.',
            [
              [{ text: 'Link My Account', callback_data: 'link_account' }]
            ]
          );
          
          console.log("Welcome message sent successfully:", result);
          return NextResponse.json({ ok: true });
        } catch (msgError) {
          console.error("Error sending welcome message:", msgError);
          throw msgError;
        }
      }
      
      // Check user state
      const userState = userStates[chatId] || { state: 'INITIAL' };
      console.log(`User state for ${chatId}: ${userState.state}`);
      
      // If we're expecting an email
      if (userState.state === 'AWAITING_EMAIL') {
        console.log(`Processing email: ${text}`);
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          console.log('Invalid email format');
          await sendTelegramMessage(
            chatId,
            'That doesn\'t look like a valid email address. Please try again:'
          );
          return NextResponse.json({ ok: true });
        }

        // Check if email exists in our database
        console.log(`Checking if email exists: ${text}`);
        const user = await UserModel.findByEmail(text);
        if (!user) {
          console.log(`Email not found in database: ${text}`);
          await sendTelegramMessage(
            chatId,
            'This email is not registered in our system. Please sign up on our website first at ' + 
            process.env.NEXT_PUBLIC_APP_URL
          );
          return NextResponse.json({ ok: true });
        }

        if (user.telegramVerified) {
          console.log(`Email ${text} is already linked to a Telegram account`);
          await sendTelegramMessage(
            chatId,
            'This email is already linked to a Telegram account.'
          );
          return NextResponse.json({ ok: true });
        }

        try {
          // Generate verification token
          console.log(`Generating verification token for user: ${user._id.toString()}`);
          const token = await UserModel.generateVerificationToken(user._id.toString());
          
          // Import the sendVerificationEmail function
          console.log('Preparing to send verification email');
          const { sendVerificationEmail } = await import('@/config/nodemailer');
          
          // Send verification email
          console.log(`Sending verification email to: ${text}`);
          await sendVerificationEmail(text, token, telegramId);

          // Update user's telegram ID (unverified)
          console.log(`Updating Telegram ID for user: ${text} to ${telegramId}`);
          await UserModel.updateTelegramId(text, telegramId, false);

          // Reset state
          userStates[chatId] = { state: 'INITIAL' };

          console.log('Verification email sent successfully');
          await sendTelegramMessage(
            chatId,
            'We\'ve sent a verification link to your email. Please check your inbox and click the link to complete the verification process.'
          );
        } catch (error) {
          console.error('Error in email verification process:', error);
          await sendTelegramMessage(
            chatId,
            'Sorry, we encountered an error while processing your request. Please try again later.'
          );
        }
        
        return NextResponse.json({ ok: true });
      } else {
        // Default response if we don't understand the message
        console.log('Unrecognized command, sending help message');
        await sendTelegramMessage(
          chatId, 
          'I don\'t understand that command. Type /start to begin the account linking process.'
        );
        return NextResponse.json({ ok: true });
      }
    }
    
    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const { data, message, from } = update.callback_query;
      const chatId = message.chat.id;
      const telegramId = from.id.toString();
      
      console.log(`👆 Received callback query: ${data} from user ${from.username || from.first_name} (ID: ${telegramId})`);
      
      if (data === 'link_account') {
        console.log(`User ${telegramId} is starting account linking process`);
        userStates[chatId] = { state: 'AWAITING_EMAIL' };
        await sendTelegramMessage(
          chatId,
          'Please enter the email address you used to register on our website:'
        );
      }
      
      // Answer callback query to remove the "loading" state from the button
      console.log('Answering callback query to remove loading state');
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            callback_query_id: update.callback_query.id
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error answering callback query: ${JSON.stringify(errorData)}`);
        }
      } catch (cbError) {
        console.error("Error answering callback query:", cbError);
      }
      
      return NextResponse.json({ ok: true });
    }
    
    // Default response for other updates
    console.log('Received unhandled update type');
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return errHandler(error as CustomError);
  }
}

// Helper function to send Telegram messages
async function sendTelegramMessage(
  chatId: number | string, 
  text: string, 
  replyMarkup?: any[][]
) {
  console.log(`📤 Sending message to chat ${chatId}: "${text}"`);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('Missing bot token when trying to send message');
    throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable');
  }
  
  const payload: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };

  if (replyMarkup) {
    payload.reply_markup = {
      inline_keyboard: replyMarkup
    };
    console.log('Adding inline keyboard to message', JSON.stringify(replyMarkup));
  }

  console.log(`Sending request to Telegram API: ${JSON.stringify(payload)}`);
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram API error (${response.status}): ${errorText}`);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Failed to send Telegram message: ${errorData.description || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`Failed to send Telegram message: ${errorText}`);
      }
    }
    
    const responseData = await response.json();
    console.log('Message sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;
  }
}
