import { errHandler } from "@/helpers/errHandler";
import UserModel from "@/db/models/userModel";
import { CustomError } from "@/types";

export async function POST(req: Request) {
  try {
    const { name, email, username, password, telegramId, role } =
      await req.json();
    console.log(name, email, username, password, telegramId, role);

    await UserModel.create({
      name,
      email,
      username,
      password,
      telegramId,
      role,
    });
    return Response.json(
      { message: "Registration successfull" },
      { status: 201 }
    );
  } catch (error) {
    return errHandler(error as CustomError);
  }
}
