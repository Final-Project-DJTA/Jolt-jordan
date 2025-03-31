"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobType } from "@/types"
import JobCard from "@/components/jobs/job-card"
import { Search, Filter } from "lucide-react"

// Mock job data
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
  {
    _id: "4",
    name: "Product Manager",
    slug: "product-manager",
    location: "Chicago, IL",
    category: "Product",
    salary: "$110,000 - $140,000",
    description: "We're looking for a Product Manager to lead our product development efforts.",
    excerpt: "Lead the development of innovative products that solve real customer problems.",
    company: {
      name: "InnovateCo",
      industry: "Technology",
      size: "101-500",
      website: "https://innovateco.com",
      headquarters: "Chicago, IL",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Define product vision and strategy",
        "Work with cross-functional teams",
        "Analyze market trends and competition",
      ],
      requirements: [
        "3+ years of product management experience",
        "Strong analytical skills",
        "Excellent communication abilities",
      ],
      benefits: ["Competitive salary", "Health and dental insurance", "401(k) matching"],
    },
    createdAt: new Date("2023-04-28"),
    updatedAt: new Date("2023-04-28"),
  },
  {
    _id: "5",
    name: "Data Scientist",
    slug: "data-scientist",
    location: "Seattle, WA",
    category: "Data",
    salary: "$130,000 - $160,000",
    description: "Join our data science team to extract insights from complex datasets.",
    excerpt: "Turn data into actionable insights that drive business decisions.",
    company: {
      name: "DataDrive",
      industry: "Data Analytics",
      size: "51-200",
      website: "https://datadrive.com",
      headquarters: "Seattle, WA",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Develop machine learning models",
        "Analyze large datasets",
        "Present findings to stakeholders",
      ],
      requirements: [
        "MS or PhD in a quantitative field",
        "Experience with Python and data science libraries",
        "Knowledge of machine learning algorithms",
      ],
      benefits: ["Competitive salary", "Flexible work schedule", "Continuous learning opportunities"],
    },
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-20"),
  },
  {
    _id: "6",
    name: "DevOps Engineer",
    slug: "devops-engineer",
    location: "Remote",
    category: "Engineering",
    salary: "$110,000 - $140,000",
    description: "We're seeking a DevOps Engineer to improve our infrastructure and deployment processes.",
    excerpt: "Build and maintain the infrastructure that powers our applications.",
    company: {
      name: "CloudSys",
      industry: "Cloud Computing",
      size: "201-500",
      website: "https://cloudsys.com",
      headquarters: "Denver, CO",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Implement CI/CD pipelines",
        "Manage cloud infrastructure",
        "Ensure system reliability and security",
      ],
      requirements: [
        "3+ years of DevOps experience",
        "Experience with AWS or Azure",
        "Knowledge of containerization technologies",
      ],
      benefits: ["Competitive salary", "Remote work", "Professional development budget"],
    },
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
  },
]

// Categories for filtering
const categories = ["All Categories", "Engineering", "Design", "Product", "Data", "Marketing", "Sales"]

// Locations for filtering
const locations = [
  "All Locations",
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Chicago, IL",
  "Seattle, WA",
]

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [jobs, setJobs] = useState<JobType[]>(mockJobs)

  const handleSearch = () => {
    let filteredJobs = mockJobs

    // Filter by search term
    if (searchTerm) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filteredJobs = filteredJobs.filter((job) => job.category === selectedCategory)
    }

    // Filter by location
    if (selectedLocation !== "All Locations") {
      filteredJobs = filteredJobs.filter((job) => job.location === selectedLocation)
    }

    setJobs(filteredJobs)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
            <Filter className="mr-2 h-4 w-4" />
            Filter Results
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job._id} job={job} />)
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All Categories")
                setSelectedLocation("All Locations")
                setJobs(mockJobs)
              }}
              className="mt-2 text-primary"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

