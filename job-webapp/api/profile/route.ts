import { errHandler } from "@/helpers/errHandler";
import UserModel from "@/db/models/userModel";
import { CustomError } from "@/types";

export async function GET(req:Request) {
    try {
        const userId = req.headers.get("x-user-id")
        if(!userId) return Response.json({message: "Unauthorized"}, {status: 401})

        const profile = await UserModel.getProfile(userId)
        return Response.json(profile)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}

export async function PATCH(req:Request) {
    try {
        const userId = req.headers.get("x-user-id")
        if(!userId) return Response.json({message: "Unauthorized"}, {status: 401})

        const body = await req.json()
        const res = await UserModel.editProfile(userId, body)
        return Response.json({message: res})
    } catch (error) {
        return errHandler(error as CustomError)
    }
}