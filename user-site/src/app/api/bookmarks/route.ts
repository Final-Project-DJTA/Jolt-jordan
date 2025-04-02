import BookmarkModel from "@/db/models/BookmarkModel";
import { errHandler } from "@/app/helpers/errHandler";
import { CustomError } from "@/types";

export async function GET(req:Request) {
    try {
        const userId = req.headers.get("x-user-id") as string
        const {searchParams} = new URL(req.url)
        const status = searchParams.get("status") as | "interested" | "not_interested" | "none" | undefined

        const bookmarks = await BookmarkModel.getAll(userId, status)
        return Response.json(bookmarks)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}

export async function POST(req:Request) {
    try {
        const userId = req.headers.get("x-user-id") as string
        const {jobId} = await req.json()

        const res = await BookmarkModel.create({userId, jobId})
        return Response.json(res)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}

export async function PATCH(req:Request) {
    try {
        const userId = req.headers.get("x-user-id") as string
        const {jobId, status} = await req.json()

        const res = await BookmarkModel.updateStatus(userId, jobId, status)
        return Response.json(result)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}