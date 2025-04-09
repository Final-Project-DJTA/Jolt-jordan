import JobModel from "@/db/models/jobModel"
import { errHandler } from "@/helpers/errHandler"
import { CustomError } from "@/types"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.pathname.split("/").pop(); // ambil slug dari URL

    if (!slug) {
      return Response.json({ message: "Slug is required" }, { status: 400 });
    }

    const job = await JobModel.findBySlug(slug);

    if (!job) {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }

    return Response.json(job);
  } catch (error) {
    return errHandler(error as CustomError);
  }
}
