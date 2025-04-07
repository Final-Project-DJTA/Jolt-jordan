import { NextResponse } from 'next/server';
import UserModel from '@/db/models/userModel';
import { errHandler } from '@/helpers/errHandler';
import { CustomError } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const telegramId = searchParams.get('telegramId');

    if (!token || !telegramId) {
      return new Response(
        '<html><body><h1>Error</h1><p>Invalid verification link.</p></body></html>', 
        { 
          status: 400,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Verify token and update Telegram ID
    await UserModel.verifyTokenAndUpdateTelegramId(token, telegramId);

    // Return success HTML page
    return new Response(
      `<html>
        <head>
          <title>Telegram Account Verified</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .success { color: green; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .btn { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">Success!</h1>
            <p>Your Telegram account has been successfully verified and linked to your Jolt Jordan account.</p>
            <p>You can now receive job notifications directly on Telegram!</p>
            <a href="/" class="btn">Return to Homepage</a>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  } catch (error) {
    const errorMessage = (error as CustomError).message || 'Verification failed';
    
    return new Response(
      `<html>
        <head>
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .error { color: red; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .btn { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">Verification Failed</h1>
            <p>${errorMessage}</p>
            <p>The verification link may be invalid or expired.</p>
            <a href="/" class="btn">Return to Homepage</a>
          </div>
        </body>
      </html>`,
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
