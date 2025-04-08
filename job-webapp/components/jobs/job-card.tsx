"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { JobType, BookmarkStatus } from "@/types"
import { Bookmark, MapPin, Calendar, Building, Wallet, Star } from "lucide-react"
import { motion } from "framer-motion"
import Confetti from "@/components/ui/confetti"

interface JobCardProps {
  job: JobType
}

export default function JobCard({ job }: JobCardProps) {
  const [bookmarkStatus, setBookmarkStatus] = useState<BookmarkStatus>("none")
  const [isHovered, setIsHovered] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const userId = "mock-user-id"

  const handleBookmark = async (status: BookmarkStatus, e: React.MouseEvent) => {
    const newStatus = status === bookmarkStatus ? "none" : status

    try {
      await fetch("/api/bookmark", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ jobId: job._id, status: newStatus }),
      })
      setBookmarkStatus(newStatus)

      if (newStatus === "interested") {
        setConfettiPosition({ x: e.clientX, y: e.clientY })
        setShowConfetti(true)
      }
    } catch (error) {
      console.error("Bookmark update failed", error)
    }
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
        .map((s) => s.trim().replace(/,/g, "")) // ganti koma, jangan titik
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
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden border-transparent transition-all duration-300">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden"
                    animate={isHovered ? { rotate: [0, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={job.company.logo || "/placeholder.svg"}
                      alt={job.company.name}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full transition-all duration-300 ${
                      bookmarkStatus === "interested"
                        ? "text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={(e) => handleBookmark("interested", e)}
                  >
                    <motion.div
                      animate={bookmarkStatus === "interested" ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Star className="h-4 w-4" />
                    </motion.div>
                    <span className="sr-only">Interested</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full transition-all duration-300 ${
                      bookmarkStatus === "not_interested"
                        ? "text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={(e) => handleBookmark("not_interested", e)}
                  >
                    <motion.div
                      animate={bookmarkStatus === "not_interested" ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Bookmark className="h-4 w-4" />
                    </motion.div>
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
                  <Wallet className="h-3.5 w-3.5 mr-1" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <motion.div
              className="border-t border-gray-100 bg-gray-50 p-4 flex justify-between items-center"
              animate={isHovered ? { backgroundColor: "rgba(212, 175, 55, 0.1)" } : {}}
            >
              <div className="text-sm text-gray-500">{job.detail.requirements.length} requirements</div>
              <Link href={`/jobs/${job.slug}`}>
                <Button className="bg-primary hover:bg-primary/90 transition-all duration-300">
                  View Details
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <Confetti
        isActive={showConfetti}
        x={confettiPosition.x}
        y={confettiPosition.y}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  )
}
