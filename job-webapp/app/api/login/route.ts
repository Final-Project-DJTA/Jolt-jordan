import { errHandler } from "@/helpers/errHandler";
import { signToken } from "@/helpers/jwt";
import UserModel from "@/db/models/userModel";
import { CustomError } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // User authentication logic...
    const user = await UserModel.login(email, password);
    
    // Generate JWT token
    const accessToken = signToken({ _id: user._id.toString(), username: user.username });
    
    // Set cookie - Review this part carefully
    const response = NextResponse.json(
      { 
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );
    
    // Set the Authorization cookie with proper attributes
    response.cookies.set(
      {
        name: "Authorization",
        value: `Bearer ${accessToken}`,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      }
      // "Set-Cookie",
      // `Authorization=Bearer ${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );
    console.log("LOGIN TOKEN PAYLOAD:", { _id: user._id.toString(), username: user.username });

    return response;
  } catch (error) {
    return errHandler(error as CustomError);
  }
}