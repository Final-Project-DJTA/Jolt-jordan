"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { JobType } from "@/types"
import JobCard from "@/components/jobs/job-card"

// Mock job data - in a real app, this would come from your database
const mockJobs: JobType[] = [
  {
    _id: "1",
    name: "Senior Frontend Developer",
    slug: "senior-frontend-developer",
    location: "New York, NY",
    category: "Engineering",
    salary: "$120,000 - $150,000",
    description: "We are looking for a Senior Frontend Developer to join our team.",
    excerpt: "Join our team as a Senior Frontend Developer and help build amazing user experiences.",
    company: {
      name: "TechCorp",
      industry: "Technology",
      size: "501-1000",
      website: "https://techcorp.com",
      headquarters: "New York, NY",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Develop new user-facing features",
        "Build reusable components",
        "Optimize applications for maximum speed",
      ],
      requirements: [
        "5+ years of experience with React",
        "Strong proficiency in JavaScript",
        "Experience with responsive design",
      ],
      benefits: ["Competitive salary", "Health insurance", "Flexible working hours"],
    },
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    _id: "2",
    name: "UX/UI Designer",
    slug: "ux-ui-designer",
    location: "Remote",
    category: "Design",
    salary: "$90,000 - $110,000",
    description: "We are seeking a talented UX/UI Designer to create amazing user experiences.",
    excerpt: "Create intuitive and engaging user experiences for our products.",
    company: {
      name: "DesignHub",
      industry: "Design",
      size: "51-200",
      website: "https://designhub.com",
      headquarters: "San Francisco, CA",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Create user flows and wireframes",
        "Design intuitive interfaces",
        "Collaborate with developers",
      ],
      requirements: [
        "3+ years of experience in UX/UI design",
        "Proficiency in Figma or Sketch",
        "Portfolio of design projects",
      ],
      benefits: ["Competitive salary", "Remote work", "Professional development budget"],
    },
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    _id: "3",
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    location: "Austin, TX",
    category: "Engineering",
    salary: "$100,000 - $130,000",
    description: "Join our team as a Full Stack Developer and work on exciting projects.",
    excerpt: "Build robust applications from front to back in our fast-paced environment.",
    company: {
      name: "CodeWorks",
      industry: "Software Development",
      size: "201-500",
      website: "https://codeworks.com",
      headquarters: "Austin, TX",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Develop both frontend and backend components",
        "Implement security and data protection",
        "Optimize applications for performance",
      ],
      requirements: [
        "4+ years of full stack development experience",
        "Experience with React and Node.js",
        "Knowledge of database systems",
      ],
      benefits: ["Competitive salary", "Stock options", "Flexible working hours"],
    },
    createdAt: new Date("2023-05-05"),
    updatedAt: new Date("2023-05-05"),
  },
]

// Mock bookmark statuses
const mockBookmarks = {
  interested: ["1"], // Job IDs that are marked as interested
  notInterested: ["2"], // Job IDs that are marked as not interested
  none: ["3"], // Job IDs that have no bookmark status
}

export default function BookmarksList() {
  const [activeTab, setActiveTab] = useState("all")

  // Filter jobs based on the active tab
  const getFilteredJobs = () => {
    switch (activeTab) {
      case "interested":
        return mockJobs.filter((job) => mockBookmarks.interested.includes(job._id))
      case "not-interested":
        return mockJobs.filter((job) => mockBookmarks.notInterested.includes(job._id))
      case "none":
        return mockJobs.filter((job) => mockBookmarks.none.includes(job._id))
      default:
        return mockJobs
    }
  }

  const filteredJobs = getFilteredJobs()

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="not-interested">Not Interested</TabsTrigger>
          <TabsTrigger value="none">No Status</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No bookmarked jobs found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interested" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No jobs marked as interested.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="not-interested" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No jobs marked as not interested.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="none" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No jobs without a bookmark status.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

