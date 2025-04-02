import { errHandler } from "@/app/helpers/errHandler";
import { signToken } from "@/app/helpers/jwt";
import UserModel from "@/db/models/UserModel";
import { CustomError } from "@/types";
import { cookies } from "next/headers";

export async function POST(req:Request) {
    try {
        const {email, password} = await req.json()
        const user = await UserModel.login(email, password)

        const accessToken = signToken({_id: user.userId.toString(), username: user.username})
        const cookieStore = await cookies()
        cookieStore.set("Authorization", `Bearer ${accessToken}`)

        return Response.json({accessToken})
    } catch (error) {
        return errHandler(error as CustomError)
    }
}