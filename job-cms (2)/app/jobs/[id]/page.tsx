"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Building, Calendar, Edit, MapPin } from "lucide-react"
import { use, useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { getJob } from "@/lib/data"
import { Separator } from "@/components/ui/separator"
import { DeleteJobDialog } from "@/components/delete-job-dialog"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const unwrappedParams = use(params) as { id: string }
  const  id = unwrappedParams.id;

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
        <Button asChild className="mt-4">
          <Link href="/jobs">Back to Jobs</Link>
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
        <h1 className="text-3xl font-bold tracking-tight">{job.name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          {job.company.name}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/jobs/${job._id}/edit`}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Link>
        </Button>
        <DeleteJobDialog jobId={job._id} jobName={job.name} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.detail.responsibilities.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.detail.requirements.map((item: string, index:number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.detail.benefits.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Salary</h4>
                <p className="text-sm text-muted-foreground">{job.salary}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium">Location</h4>
                <p className="text-sm text-muted-foreground">{job.location}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p className="text-sm text-muted-foreground">{job.category}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium">Posted</h4>
                <p className="text-sm text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {job.company.logo ? (
                    <img
                      src={job.company.logo || "/placeholder.svg"}
                      alt={job.company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{job.company.name}</h4>
                  <p className="text-sm text-muted-foreground">{job.company.industry}</p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium">Company Size</h4>
                <p className="text-sm text-muted-foreground">{job.company.size}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium">Headquarters</h4>
                <p className="text-sm text-muted-foreground">{job.company.headquarters}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium">Website</h4>
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {job.company.website}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

