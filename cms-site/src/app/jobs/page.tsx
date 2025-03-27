import Link from "next/link"
import { Search, MapPin, Filter, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            JobPortal
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/jobs" className="text-primary font-medium">
              Browse Jobs
            </Link>
            <Link href="/companies" className="text-gray-600 hover:text-primary">
              Companies
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex space-x-3">
            <Button variant="outline">Sign In</Button>
            <Button>Post a Job</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Job</h1>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input placeholder="Job title, keywords, or company" className="pl-10" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input placeholder="Location" className="pl-10" />
            </div>
            <Button size="lg" className="md:w-auto w-full">
              Search Jobs
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Job Type</h4>
                    <div className="space-y-2">
                      {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                        <div className="flex items-center space-x-2" key={type}>
                          <Checkbox id={`job-type-${type.toLowerCase()}`} />
                          <label htmlFor={`job-type-${type.toLowerCase()}`} className="text-sm">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Experience Level</h4>
                    <div className="space-y-2">
                      {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
                        <div className="flex items-center space-x-2" key={level}>
                          <Checkbox id={`exp-${level.toLowerCase().replace(" ", "-")}`} />
                          <label htmlFor={`exp-${level.toLowerCase().replace(" ", "-")}`} className="text-sm">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Salary Range</h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-50k">$0 - $50K</SelectItem>
                        <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                        <SelectItem value="100k-150k">$100K - $150K</SelectItem>
                        <SelectItem value="150k+">$150K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Posted Date</h4>
                    <div className="space-y-2">
                      {["Last 24 hours", "Last 3 days", "Last 7 days", "Last 14 days", "Last 30 days"].map((date) => (
                        <div className="flex items-center space-x-2" key={date}>
                          <Checkbox id={`date-${date.toLowerCase().replace(/\s+/g, "-")}`} />
                          <label htmlFor={`date-${date.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm">
                            {date}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Showing <span className="font-medium">1,206</span> jobs
              </p>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary-high">Highest Salary</SelectItem>
                    <SelectItem value="salary-low">Lowest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Link href={`/jobs/${job.id}`} key={job.id}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <Building2 className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                            <span>{job.company}</span>
                            <span className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {job.location}
                            </span>
                            <span>${job.salary}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={job.type === "Full-time" ? "default" : "outline"}>{job.type}</Badge>
                          <span className="text-gray-400 text-sm">{job.posted}</span>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 line-clamp-2">{job.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex">
                <Button variant="outline" size="icon" className="rounded-l-md rounded-r-none">
                  &lt;
                </Button>
                <Button variant="outline" size="sm" className="rounded-none bg-primary text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" className="rounded-none">
                  2
                </Button>
                <Button variant="outline" size="sm" className="rounded-none">
                  3
                </Button>
                <Button variant="outline" size="sm" className="rounded-none">
                  ...
                </Button>
                <Button variant="outline" size="sm" className="rounded-none">
                  12
                </Button>
                <Button variant="outline" size="icon" className="rounded-r-md rounded-l-none">
                  &gt;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "120K - 150K",
    type: "Full-time",
    posted: "2 days ago",
    description:
      "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces and implementing features for our web applications.",
    skills: ["React", "TypeScript", "CSS", "HTML"],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "110K - 140K",
    type: "Full-time",
    posted: "3 days ago",
    description:
      "As a Product Manager, you will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product requirements.",
    skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "90K - 120K",
    type: "Full-time",
    posted: "1 week ago",
    description:
      "We're seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills.",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "GrowthLabs",
    location: "Chicago, IL",
    salary: "70K - 90K",
    type: "Contract",
    posted: "3 days ago",
    description:
      "We are looking for a Marketing Specialist to join our team and help with our marketing campaigns. You will be responsible for implementing marketing strategies and analyzing results.",
    skills: ["Digital Marketing", "SEO", "Content Creation", "Analytics"],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Austin, TX",
    salary: "130K - 160K",
    type: "Full-time",
    posted: "5 days ago",
    description:
      "As a DevOps Engineer, you will be responsible for building and maintaining our infrastructure, deployment pipelines, and monitoring systems. You will work closely with our development team.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
]

