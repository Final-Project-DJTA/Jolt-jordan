import JobModel from "@/db/models/jobModel";
import { errHandler } from "@/helpers/errHandler";
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
        
        if(category || location || salary){
            const res = await JobModel.filterJobs({
                category: category || undefined,
                location: location || undefined,
                salary: salary || undefined
            })
            return Response.json(res)
        }

        const jobs = await JobModel.getAll()
        return Response.json(jobs)
    } catch (error) {
        return errHandler(error as CustomError)
    }
}

// export async function POST(req:Request) {
//     try {
//         console.log("🔥 Masuk API /api/jobs");
// console.log("Headers:", req.headers);


//         const userId = req.headers.get("x-user-id")
//         if(!userId) return Response.json({message: "Unauthorized"}, {status: 401})
//             console.log("x-user-id:", req.headers.get("x-user-id"));
//         const {jobId} = await req.json()
//         if(!jobId) return Response.json({message: "Job ID is required"}, {status: 400})

//         const res = await JobModel.applyJob(userId, jobId)
//         return Response.json(res)
//     } catch (error) {
//         return errHandler(error as CustomError)
//     }
// }