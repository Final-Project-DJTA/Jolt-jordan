import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

// Use a strong secret key in production
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d" // Token expires in 7 days

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getTokenFromCookies() {
  const cookieStore = cookies()
  return (await cookieStore).get("token")?.value
}

export function getTokenFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  return token
}

export function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    return decoded
  } catch (error) {
    return null
  }
}

