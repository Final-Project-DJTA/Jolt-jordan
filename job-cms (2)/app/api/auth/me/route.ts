import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-utils';
import dbConnect from '@/lib/mongodb/connection';
import User from '@/lib/mongodb/models/User';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    // Verify token
    const userData = await getServerUser(request);
    
    if (!userData || !userData.userId) {
      return NextResponse.json({ user: null });
    }
    
    await dbConnect();
    
    // Get user data
    const user = await User.findById(userData.userId);
    
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    // Return user without password
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      role: (user as any).role || 'user'
    };
    
    return NextResponse.json({ user: sanitizedUser });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ user: null });
  }
}