"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { JobType } from "@/types"
import { Bookmark, MapPin, Calendar, Building, DollarSign } from "lucide-react"

interface JobCardProps {
  job: JobType
}

export default function JobCard({ job }: JobCardProps) {
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={job.company.logo || "/placeholder.svg"}
                  alt={job.company.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <Link href={`/${job.slug}`}>
                  <h3 className="text-xl font-semibold text-primary hover:text-primary/80 transition-colors">
                    {job.name}
                  </h3>
                </Link>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  <span>{job.company.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${
                  bookmarkStatus === "interested"
                    ? "text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleBookmark("interested")}
              >
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Interested</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${
                  bookmarkStatus === "not-interested"
                    ? "text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleBookmark("not-interested")}
              >
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Not Interested</span>
              </Button>
            </div>
          </div>

          <p className="mt-3 text-gray-600">{job.excerpt}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary">
              {job.category}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">{job.detail.requirements.length} requirements</div>
          <Link href={`/${job.slug}`}>
            <Button className="bg-primary hover:bg-primary/90">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

