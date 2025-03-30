"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { JobType } from "@/types"
import {
  Bookmark,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Globe,
  Users,
  CheckCircle,
  ListChecks,
  Gift,
} from "lucide-react"

interface JobDetailProps {
  job: JobType
}

export default function JobDetail({ job }: JobDetailProps) {
  const [bookmarkStatus, setBookmarkStatus] = useState<"none" | "interested" | "not-interested">("none")

  const handleBookmark = (status: "interested" | "not-interested") => {
    setBookmarkStatus(status === bookmarkStatus ? "none" : status)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={job.company.logo || "/placeholder.svg"}
                    alt={job.company.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">{job.name}</h1>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{job.company.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={`${
                    bookmarkStatus === "interested"
                      ? "text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => handleBookmark("interested")}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {bookmarkStatus === "interested" ? "Interested" : "Mark as Interested"}
                </Button>
                <Button
                  variant="outline"
                  className={`${
                    bookmarkStatus === "not-interested"
                      ? "text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => handleBookmark("not-interested")}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {bookmarkStatus === "not-interested" ? "Not Interested" : "Mark as Not Interested"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <Badge variant="outline" className="bg-primary/5 text-primary">
                {job.category}
              </Badge>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="space-y-4">
                  <p className="text-gray-700">{job.description}</p>

                  <h3 className="text-lg font-semibold text-primary mt-6 flex items-center">
                    <ListChecks className="h-5 w-5 mr-2" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {job.detail.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <ListChecks className="h-5 w-5 mr-2" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {job.detail.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {job.detail.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Apply for this job</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">Apply Now</Button>
            <p className="text-sm text-gray-500 mt-4">
              This will redirect you to the company&apos;s application process.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={job.company.logo || "/placeholder.svg"}
                  alt={job.company.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{job.company.name}</h3>
                <p className="text-sm text-gray-500">{job.company.industry}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-start">
                <Users className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm font-medium">Company Size</p>
                  <p className="text-sm text-gray-600">{job.company.size} employees</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm font-medium">Headquarters</p>
                  <p className="text-sm text-gray-600">{job.company.headquarters}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary hover:underline"
                  >
                    {job.company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Similar Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-500">No similar jobs found at the moment.</p>
            <Link href="/jobs">
              <Button variant="outline" className="w-full">
                Browse All Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

