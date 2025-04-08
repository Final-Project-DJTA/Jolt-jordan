import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import User from '@/lib/mongodb/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log("Processing registration request");
    await dbConnect();
    
    const body = await request.json();
    console.log(`Registration attempt for: ${body.email}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    
    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = bcrypt.hashSync(body.password, 10);
    // console.log(body.password,'ini register<<<<<')
    // console.log(hashedPassword,'ini hashpassword<<<<<')
    
    
    // Create new user
    const newUser = await User.create({
      name: body.name,
      email: body.email,
      username: body.username || body.email.split('@')[0],
      phoneNumber: body.phoneNumber || '1234567890',
      password: body.password,
      role: 'admin' // For testing
    });
    
    console.log(`User registered successfully: ${newUser._id}`);
    
    // Return user (excluding password)
    return NextResponse.json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}