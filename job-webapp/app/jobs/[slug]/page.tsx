import { notFound } from "next/navigation"
import JobDetail from "@/components/jobs/job-detail"
import type { JobType } from "@/types"

export default async function JobDetailPageComponent({ params }: { params: { slug: string } }) {
  // Extract slug first to resolve the warning
  const { slug } = params;
  
  // Now use the extracted slug variable
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) return notFound()

  const jobData = await res.json()

  const job: JobType = {
    ...jobData,
    createdAt: new Date(jobData.createdAt),
    updatedAt: new Date(jobData.updatedAt),
  }

  return (
    <div className="container mx-auto py-12">
      <JobDetail job={job} />
    </div>
  )
}
