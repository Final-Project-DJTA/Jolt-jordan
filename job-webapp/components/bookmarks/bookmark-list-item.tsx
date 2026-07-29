"use client"

import { JobType } from "@/types"
import { useBookmark } from "@/context/BookmarkContext"
import { MapPin, Calendar, Building, Wallet, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

type Props = {
  job: JobType
}

export default function BookmarkListItem({ job }: Props) {
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
    <motion.div
      className="border rounded-lg p-5 bg-white flex flex-col gap-4 shadow-sm"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={job.company.logo || "/placeholder.svg"}
            alt={job.company.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <Link href={`/jobs/${job.slug}`}>
            <h3 className="text-lg font-semibold text-primary hover:underline">{job.name}</h3>
          </Link>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <Building className="h-4 w-4 mr-1" />
            {job.company.name}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={handleRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <Wallet className="h-4 w-4 mr-1" />
          {formatSalary(job.salary)}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Posted {formatDate(job.createdAt)}
        </div>
      </div>
    </motion.div>
  )
}
