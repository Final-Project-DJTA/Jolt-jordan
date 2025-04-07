"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobCard from "@/components/jobs/job-card"
import type { JobType } from "@/types"

type BookmarkStatus = "interested" | "not_interested" | "none" | "all"

export default function BookmarksList() {
  const [activeTab, setActiveTab] = useState<BookmarkStatus>("all")
  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBookmarks = async (status: BookmarkStatus) => {
    try {
      setLoading(true)
      const params = status === "all" ? "" : `?status=${status}`
      const res = await fetch(`/api/bookmarks${params}`)
      const data = await res.json()

      const jobList = Array.isArray(data)
        ? data.map((item) => item.job) // Extract job from bookmark
        : []

      setJobs(jobList)
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks(activeTab)
  }, [activeTab])

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={(tab) => setActiveTab(tab as BookmarkStatus)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="not_interested">Not Interested</TabsTrigger>
          <TabsTrigger value="none">No Status</TabsTrigger>
        </TabsList>

        {["all", "interested", "not_interested", "none"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-500">No jobs in this category.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
