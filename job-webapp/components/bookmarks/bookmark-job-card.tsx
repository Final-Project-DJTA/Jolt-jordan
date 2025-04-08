"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Building, Wallet, Trash2 } from "lucide-react"
import { JobType } from "@/types"
import { useBookmark } from "@/context/BookmarkContext"

type Props = {
  job: JobType
}

export default function BookmarkJobCard({ job }: Props) {
  const { removeBookmark } = useBookmark()

  const handleRemove = async () => {
    await removeBookmark(job._id)
  }

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const formatSalary = (salary: string) => {
    const parts = salary
      .replace(/Rp|\s/g, "")
      .split("-")
      .map((s) => s.trim().replace(/,/g, ""))
      .map((n) => Number(n))

    if (parts.length === 2) {
      const [min, max] = parts
      return `Rp ${min.toLocaleString("id-ID")} - Rp ${max.toLocaleString("id-ID")}`
    }

    if (parts.length === 1) {
      return `Rp ${parts[0].toLocaleString("id-ID")}`
    }

    return salary
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={job.company.logo || "/placeholder.svg"}
                alt={job.company.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <Link href={`/jobs/${job.slug}`}>
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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
            <Wallet className="h-3.5 w-3.5 mr-1" />
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
