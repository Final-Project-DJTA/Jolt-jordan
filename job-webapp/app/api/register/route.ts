import { errHandler } from "@/helpers/errHandler";
import UserModel from "@/db/models/userModel";
import { CustomError } from "@/types";

export async function POST(req: Request) {
  try {
    const { name, email, username, password, telegramId, role } =
      await req.json();
    console.log("Registering new user:", name, email, username);

    const result = await UserModel.create({
      name,
      email,
      username,
      password,
      telegramId,
      role: role || "user",
    });
    
    return Response.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errHandler(error as CustomError);
  }
}
