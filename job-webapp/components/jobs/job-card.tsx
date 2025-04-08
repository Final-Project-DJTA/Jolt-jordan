"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, MapPin, Calendar, Building, Wallet, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import Confetti from "@/components/ui/confetti"
import { JobType } from "@/types"
import { useBookmark } from "@/context/BookmarkContext"

interface JobCardProps {
  job: JobType
  isInBookmarkPage?: boolean
}

export default function JobCard({ job, isInBookmarkPage = false }: JobCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmark()
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(job._id))
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleBookmark = async (e: React.MouseEvent) => {
    if (bookmarked) return
    const success = await addBookmark(job._id)
    if (success) {
      setBookmarked(true)
      setConfettiPosition({ x: e.clientX, y: e.clientY })
      setShowConfetti(true)
    }
  }

  const handleRemove = async () => {
    const success = await removeBookmark(job._id)
    if (success) setBookmarked(false)
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
                    disabled={bookmarked}
                    className={`rounded-full transition-all duration-300 ${
                      bookmarked
                        ? "text-yellow-600 bg-yellow-100"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={handleBookmark}
                  >
                    <motion.div
                      animate={bookmarked ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Bookmark className="h-4 w-4" />
                    </motion.div>
                  </Button>

                  {isInBookmarkPage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemove}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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
              <div className="text-sm text-gray-500">
                {job.detail?.requirements?.length || 0} requirements
              </div>
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
