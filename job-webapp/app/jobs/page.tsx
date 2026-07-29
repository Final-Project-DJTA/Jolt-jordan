"use client"

import { useState, useEffect } from "react"
import JobListings from "@/components/jobs/job-listings"
import { motion } from "framer-motion"
import Image from "next/image"
import SalaryCalculator from "@/components/jobs/salary-calculator"
import LoadingAnimation from "@/components/ui/loading-animation"

export default function JobsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={isLoaded ? { rotate: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative w-12 h-12"
        >
          <Image src="/images/logo.svg" alt="Jolt Jordan Logo" fill className="object-contain" />
        </motion.div>
        <h1 className="text-3xl font-bold text-primary">Browse Jobs</h1>
      </div>
      <p className="text-gray-600 mb-8">Find the perfect job opportunity that matches your skills and career goals.</p>

      <SalaryCalculator />

      <JobListings />
    </div>
  )
}

