import JobModel from "@/db/models/jobModel";
import { errHandler } from "@/helpers/errHandler";
import { CustomError } from "@/types";

export async function GET(req:Request, context: {params: {slug:string}}) {
    try {
        const {slug} = context.params
        const job = await JobModel.findBySlug(slug)
        
        if(!job){
            return Response.json({message: "Job not found"}, {status: 404})
        }

        return Response.json(job)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}