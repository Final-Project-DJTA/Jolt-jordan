import { NextResponse } from "next/server"
import { api } from "@/lib/mongodb/api"

export async function GET(request: Request) {
  try {
    // Get search params if any
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let jobs
    if (search) {
      jobs = await api.searchJobs(search)
    } else if (category) {
      jobs = await api.getJobsByCategory(category)
    } else {
      jobs = await api.getJobs()
    }

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json()
    const newJob = await api.createJob(jobData)
    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}

