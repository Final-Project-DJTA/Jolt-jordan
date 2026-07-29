"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, Briefcase, Eye, PlusCircle, UserPlus } from "lucide-react"

import { fetchDashboardStats, fetchJobs } from "@/lib/client-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCard } from "@/components/job-card"
import { WelcomeBanner } from "@/components/welcome-banner"
import type { JobType } from "@/lib/types"
import { ProtectedRoute } from '@/components/add-protected-route'


export default function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    newApplications: 0,
    activeJobs: 0,
    viewsToday: 0,
    popularCategories: [{ name: "", count: 0 }],
  })
  const [recentJobs, setRecentJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch dashboard stats
        const statsData = await fetchDashboardStats()
        setStats(statsData)

        // Fetch recent jobs
        const jobsData = await fetchJobs()
        setRecentJobs(jobsData.slice(0, 3))

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
          <div className="text-sm text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <div className="rounded-lg border border-destructive p-8 text-center max-w-md">
          <h3 className="text-lg font-medium text-destructive">Error</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>

    <div className="space-y-6">

      <WelcomeBanner />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
          <Link href="/jobs/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{stats.totalJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Briefcase className="mr-1 inline h-4 w-4 text-secondary" />
              {stats.activeJobs} active jobs
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardDescription>New Applications</CardDescription>
            <CardTitle className="text-3xl">{stats.newApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <UserPlus className="mr-1 inline h-4 w-4 text-secondary" />
              Last 7 days
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardDescription>Views Today</CardDescription>
            <CardTitle className="text-3xl">{stats.viewsToday}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Eye className="mr-1 inline h-4 w-4 text-secondary" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardDescription>Top Category</CardDescription>
            <CardTitle className="text-3xl">{stats.popularCategories[0]?.name || "None"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <BarChart3 className="mr-1 inline h-4 w-4 text-secondary" />
              {stats.popularCategories[0]?.count || 0} jobs
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Your most recently added job vacancies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
              {recentJobs.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">No jobs added yet</p>
              )}
              <Button variant="outline" asChild className="w-full">
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Job categories with the most listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-medium">{category.count} jobs</span>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/jobs">View All Categories</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>

  )
}

