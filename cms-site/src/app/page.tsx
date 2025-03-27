import Link from "next/link"
import { Search, Briefcase, Building2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            JobPortal
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/jobs" className="text-gray-600 hover:text-primary">
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

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Job Today</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse thousands of job listings from top companies and find the perfect opportunity for your career.
            </p>

            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4">
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
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Jobs</h2>
            <Link href="/jobs" className="text-primary hover:underline">
              View all jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link href={`/jobs/${job.id}`} key={job.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <Building2 className="text-primary" size={24} />
                      </div>
                      <Badge variant={job.type === "Full-time" ? "default" : "outline"}>{job.type}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="text-gray-500 mb-4">{job.company}</div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin size={16} className="mr-1" />
                      {job.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-primary font-medium">${job.salary}</div>
                      <div className="text-gray-400 text-sm">{job.posted}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Popular Job Categories</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Explore jobs by category and find opportunities in your field of expertise
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {jobCategories.map((category) => (
                <Link href={`/category/${category.slug}`} key={category.id}>
                  <Card className="h-full hover:shadow-md transition-shadow hover:border-primary">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="text-primary" size={20} />
                      </div>
                      <h3 className="font-medium mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} jobs</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">JobPortal</h3>
              <p className="text-gray-400">
                Find your dream job or the perfect candidate with our comprehensive job portal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/jobs" className="text-gray-400 hover:text-white">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="text-gray-400 hover:text-white">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/career-advice" className="text-gray-400 hover:text-white">
                    Career Advice
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/post-job" className="text-gray-400 hover:text-white">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="text-gray-400 hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sample data
const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "120K - 150K",
    type: "Full-time",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "110K - 140K",
    type: "Full-time",
    posted: "3 days ago",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "90K - 120K",
    type: "Full-time",
    posted: "1 week ago",
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "GrowthLabs",
    location: "Chicago, IL",
    salary: "70K - 90K",
    type: "Contract",
    posted: "3 days ago",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Austin, TX",
    salary: "130K - 160K",
    type: "Full-time",
    posted: "5 days ago",
  },
  {
    id: 6,
    title: "Content Writer",
    company: "MediaPulse",
    location: "Remote",
    salary: "60K - 80K",
    type: "Part-time",
    posted: "1 day ago",
  },
]

const jobCategories = [
  { id: 1, name: "Technology", count: 1420, slug: "technology" },
  { id: 2, name: "Marketing", count: 870, slug: "marketing" },
  { id: 3, name: "Design", count: 650, slug: "design" },
  { id: 4, name: "Finance", count: 920, slug: "finance" },
  { id: 5, name: "Healthcare", count: 1120, slug: "healthcare" },
  { id: 6, name: "Education", count: 760, slug: "education" },
  { id: 7, name: "Sales", count: 890, slug: "sales" },
  { id: 8, name: "Customer Service", count: 1050, slug: "customer-service" },
]

