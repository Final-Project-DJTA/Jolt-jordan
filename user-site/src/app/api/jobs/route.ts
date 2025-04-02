import JobModel from "@/db/models/JobModel";
import { errHandler } from "@/app/helpers/errHandler";
import { CustomError } from "@/types";

export async function GET(req:Request) {
    try {
        const {searchParams} = new URL(req.url)
        const name = searchParams.get("name")
        const category = searchParams.get("category")
        const location = searchParams.get("location")
        const salary = searchParams.get("salary")
        if(name){
            const res = await JobModel.searchByName(name)
            return Response.json(res)
        }
        if(category){
            const res = await JobModel.filterJobs({category, location, salary})
            return Response.json(res)
        }

        const jobs = await JobModel.getAll()
        return Response.json(jobs)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}

export async function POST(req:Request) {
    try {
        const userId = req.headers.get("x-user-id")
        if(!userId) return Response.json({message: "Unauthorized"}, {status: 401})

        const {jobId} = await req.json()
        if(!jobId) return Response.json({message: "Job ID is required"}, {status: 400})

        const res = await JobModel.applyJob(userId, jobId)
        return Response.json(res)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}