"use client"
import { useEffect, useState } from "react"
import type { JobType } from "@/types"
import BookmarkCard from "./bookmark-card" // pastikan path-nya benar

export default function BookmarksList() {
  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/bookmarks`)
      const data = await res.json()

      const jobList = Array.isArray(data)
        ? data.map((item) => item.job)
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
    fetchBookmarks()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : jobs.length > 0 ? (
        jobs.map((job) => <BookmarkCard key={job._id} job={job} />)
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">You haven't bookmarked any jobs yet.</p>
        </div>
      )}
    </div>
  )
}
