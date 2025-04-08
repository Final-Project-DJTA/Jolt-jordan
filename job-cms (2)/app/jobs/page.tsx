"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

import { fetchJobs } from "@/lib/client-api"
import type { JobType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobCard } from "@/components/job-card"
import { jobCategories } from "@/lib/data" // We'll keep using the categories from mock data for now
import { ProtectedRoute } from "@/components/add-protected-route"

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")

  // Fetch jobs on initial load and when filters change
  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true)
        const data = await fetchJobs(categoryFilter === "all" ? "" : categoryFilter, searchTerm ? searchTerm : "")
        setJobs(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again.")
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      getJobs()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [categoryFilter, searchTerm])

  return (
    <ProtectedRoute>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Vacancies</h1>
        <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
          <Link href="/jobs/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Job
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {jobCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-center">
            <div className="h-6 w-32 bg-muted rounded mx-auto mb-2"></div>
            <div className="text-sm text-muted-foreground">Loading jobs...</div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive p-8 text-center">
          <h3 className="text-lg font-medium text-destructive">Error</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job: JobType) => <JobCard key={job._id} job={job} showActions />)
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}

