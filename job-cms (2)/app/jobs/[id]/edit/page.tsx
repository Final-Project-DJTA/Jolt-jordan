"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect, use } from "react"

import { Button } from "@/components/ui/button"
import { JobForm } from "@/components/job-form"

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const unwrappedParams = use(params) as { id: string }// ✅ Unwrap the Promise
  const id = unwrappedParams.id // ✅ Access the property safely
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch job')
        }
        const data = await response.json()
        setJob(data)
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  if (loading) {
    return <div className="flex justify-center p-8">Loading job details...</div>
  }

  if (!job) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <p className="text-muted-foreground">The job you are looking for does not exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.push("/jobs")}>
          Back to Jobs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
          <p className="text-muted-foreground">Update the details for {job.name}</p>
        </div>
      </div>

      <JobForm job={job} isEditing />
    </div>
  )
}