import { NextResponse } from "next/server"
import { Job } from "@/lib/mongodb/models"
import dbConnect from "@/lib/mongodb/connection"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await dbConnect()
    
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }
    
    // Try to find the job by ID or slug
    const job = await Job.findOne({
      $or: [
        { _id: id },
        { slug: id }
      ]
    })
    
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    
    // Return the job data with focus on tags
    return NextResponse.json({
      id: job._id,
      name: job.name,
      slug: job.slug,
      tags: job.tags,
      hasTagsField: job.tags !== undefined,
      tagType: typeof job.tags,
      isArray: Array.isArray(job.tags),
      tagCount: Array.isArray(job.tags) ? job.tags.length : 'not an array'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}