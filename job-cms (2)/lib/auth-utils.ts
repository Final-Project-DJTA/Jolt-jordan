import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

interface TokenData {
  userId: string;
  role?: string;
}

export async function getServerUser(request: NextRequest): Promise<TokenData | null> {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenData;
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}