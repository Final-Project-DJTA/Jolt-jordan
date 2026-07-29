"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JobType } from "@/types"
import JobCard from "@/components/jobs/job-card"
import { Search, Filter } from "lucide-react"

const categories = [
  "All Categories",
  "Technology",
  "Marketing",
  "Finance",
  "Design",
  "Sales",
  "Customer Service",
  "Engineering",
  "Healthcare",
  "Education",
]

const salaryRanges = [
  { label: "All Salary", value: "all" },
  { label: "< 5.000.000", value: "<5000000" },
  { label: "5.000.000 - 10.000.000", value: "5000000-10000000" },
  { label: "> 10.000.000", value: ">10000000" },
]

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedSalary, setSelectedSalary] = useState("all")
  const [jobs, setJobs] = useState<JobType[]>([])
  const [locations, setLocations] = useState<string[]>([])

  const parseSalaryToNumber = (salaryString: string): [number, number] => {
    const clean = salaryString
      .replace(/Rp/g, "")
      .replace(/\./g, "")
      .replace(/,/g, "")
      .trim()

    const numbers = clean.split("-").map((num) => parseInt(num.trim()))
    return numbers.length === 2 ? [numbers[0], numbers[1]] : [numbers[0], numbers[0]]
  }

  const matchesSalaryRange = (salary: string, selected: string): boolean => {
    const [min, max] = parseSalaryToNumber(salary)
    const selectedMin = parseInt(selected.replace(/[^\d]/g, ""))

    if (selected.startsWith("<")) return max < selectedMin
    if (selected.startsWith(">")) return min > selectedMin
    if (selected.includes("-")) {
      const [rangeMin, rangeMax] = selected.split("-").map(Number)
      return min >= rangeMin && max <= rangeMax
    }

    return true
  }

  const fetchJobs = async (filters?: {
    name?: string
    category?: string
    location?: string
  }) => {
    const query = new URLSearchParams()

    if (filters?.name) query.append("name", filters.name)
    if (filters?.category && filters.category !== "All Categories")
      query.append("category", filters.category)
    if (filters?.location && filters.location !== "All Locations")
      query.append("location", filters.location)

    const res = await fetch(`/api/jobs?${query.toString()}`, {
      cache: "no-store",
    })

    if (!res.ok) return

    const data: JobType[] = await res.json()

    const parsedJobs = data.map((job) => ({
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    }))

    const filteredJobs =
      selectedSalary !== "all"
        ? parsedJobs.filter((job) => matchesSalaryRange(job.salary, selectedSalary))
        : parsedJobs

    setJobs(filteredJobs)

    if (!filters) {
      const locationSet = new Set(parsedJobs.map((job) => job.location))
      setLocations(["All Locations", ...Array.from(locationSet)])
    }
  }

  const handleSearch = () => {
    fetchJobs({
      name: searchTerm,
      category: selectedCategory,
      location: selectedLocation,
    })
  }

  useEffect(() => {
    fetchJobs()
  }, [selectedSalary])

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="relative col-span-2">
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

          <Select value={selectedSalary} onValueChange={setSelectedSalary}>
            <SelectTrigger>
              <SelectValue placeholder="Select salary range" />
            </SelectTrigger>
            <SelectContent>
              {salaryRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
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
                setSelectedSalary("all")
                fetchJobs()
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
