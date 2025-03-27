import jobModel from "@/db/models/jobmodel";

export async function GET (){
    const jobs = await jobModel.getAll()

    console.log(jobs,'ini jobs dari mongo db<<');
    
    return Response.json(jobs)
}