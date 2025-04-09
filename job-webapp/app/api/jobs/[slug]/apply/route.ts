import JobModel from "@/db/models/jobModel"
import { errHandler } from "@/helpers/errHandler"
import { CustomError } from "@/types"

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 })

    const { jobId } = await req.json()
    if (!jobId) return Response.json({ message: "Job ID is required" }, { status: 400 })

    const res = await JobModel.applyJob(userId, jobId)
    return Response.json(res)
  } catch (error) {
    return errHandler(error as CustomError)
  }
}
