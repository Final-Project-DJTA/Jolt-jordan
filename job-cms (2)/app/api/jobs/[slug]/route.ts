import { NextResponse } from "next/server"
import { api } from "@/lib/mongodb/api"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    // Await params before accessing slug
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    console.log("Fetching job with ID/slug:", slug)
    
    // First try by ID
    let job = await api.getJobById(slug)
    
    // If not found, try by slug
    if (!job) {
      job = await api.getJobBySlug(slug)
    }

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Ensure tags exists and is an array
    if (!job.tags) {
      job.tags = [];
    }

    console.log("Job retrieved with tags:", job.tags)
    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    // Await params before accessing slug
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    console.log("🔍 Updating job with ID/slug:", slug)
    
    // Get raw data to avoid automatic transformations
    const rawData = await request.text()
    console.log("🔍 Raw request data:", rawData)
    
    // Parse manually
    const jobData = JSON.parse(rawData)
    console.log("📦 Parsed job data:", jobData)
    console.log("🏷️ Tags in request:", jobData.tags)
    
    // Make sure tags are correctly handled
    if (!Array.isArray(jobData.tags)) {
      console.log("⚠️ Tags is not an array, fixing...")
      jobData.tags = jobData.tags ? [jobData.tags] : []
    }
    
    // Create a clean copy for update to ensure tags are included
    const updateData = {
      name: jobData.name,
      slug: jobData.slug,
      location: jobData.location,
      category: jobData.category,
      salary: jobData.salary,
      description: jobData.description,
      excerpt: jobData.excerpt,
      company: jobData.company,
      detail: jobData.detail,
      tags: [...jobData.tags] // Explicitly use spread operator to copy the array
    }
    
    console.log("🔄 Final update data:", updateData)
    console.log("🏷️ Tags in update data:", updateData.tags)
    
    // Update job in database
    const updatedJob = await api.updateJob(slug, updateData)
    
    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    
    console.log("✅ Job updated successfully")
    console.log("🏷️ Tags in updated job:", updatedJob.tags)
    
    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error("❌ Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    // Await params before accessing slug
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    const deletedJob = await api.deleteJob(slug)

    if (!deletedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}