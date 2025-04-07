import { errHandler } from "@/helpers/errHandler";
import { signToken } from "@/helpers/jwt";
import UserModel from "@/db/models/userModel";
import { CustomError } from "@/types";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // User authentication logic...
    const user = await UserModel.login(email, password);
    
    // Generate JWT token
    const accessToken = signToken({ _id: user.userId.toString(), username: user.username });
    
    // Set cookie - Review this part carefully
    const response = Response.json(
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
    response.headers.set(
      "Set-Cookie",
      `Authorization=Bearer ${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );
    
    return response;
  } catch (error) {
    return errHandler(error as CustomError);
  }
}