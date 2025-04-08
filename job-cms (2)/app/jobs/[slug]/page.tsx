'use client'

import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Building, Calendar, Edit, MapPin, Tag } from "lucide-react"
import { useState, useEffect } from 'react' // Remove 'use' import that's causing errors

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DeleteJobDialog } from "@/components/delete-job-dialog"
import { Badge } from "@/components/ui/badge" // Add Badge import for tags

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const slug = params.slug // Access slug directly
  
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJob() {
      try {
        console.log("Fetching job with slug:", slug)
        const response = await fetch(`/api/jobs/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch job')
        }
        const data = await response.json()
        
        // Add debug logging for tags
        console.log("Job data received:", data)
        console.log("Tags in job data:", data.tags)
        console.log("Tags type:", Array.isArray(data.tags) ? "Array" : typeof data.tags)
        
        setJob(data)
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [slug])

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

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {job.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/jobs/${slug}/edit`}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Link>
        </Button>
        <DeleteJobDialog jobId={slug} jobName={job.name} />
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

          {/* Technology Tags Card */}
          {job.tags && job.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technologies & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

