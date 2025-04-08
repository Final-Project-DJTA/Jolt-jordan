import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import User from '@/lib/mongodb/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log("👉 Processing login request");
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    const { email, password } = body;
    
    console.log(`👉 Login attempt for: ${email}`);
    
    // Find user - note the +password to include the password field which is normally excluded
    const user = await User.findOne({ email: body.email }).select('+password');
    
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    
    // Log that we found the user and check password
    console.log(`👉 User found with ID: ${user._id}`);

    console.log('Password from request:', password);
    console.log('Hashed password from DB:', user.password);
    
    // Check if password exists
    if (!user.password) {
      console.log(`❌ User has no password set in database`);
      return NextResponse.json({ error: "Account requires password reset" }, { status: 401 });
    }
    
    // Check if password matches
    const trimmedPassword = body.password.trim();
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log('Password comparison result:', isMatch);
      
    if (!isMatch) {
      console.log(`❌ Password doesn't match for user: ${email}`);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    
    console.log(`✅ Authentication successful for user: ${email}`);
    
    // Create JWT token
    const JWT_SECRET = process.env.JWT_SECRET || "rahasia";
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: (user as any).role || 'user' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Prepare user data for response (excluding password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: (user as any).role || 'user'
    };
    
    // Create response
    const response = NextResponse.json({ user: userData });
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false, // Set to false in development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    console.log('Cookie set in response:', response.cookies.get('token'));
    
    console.log(`👉 Auth completed, returning successful response with token cookie`);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      error: "An error occurred during login" 
    }, { status: 500 });
  }
}