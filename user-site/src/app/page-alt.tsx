"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import JobListings from "@/components/jobs/job-listings"
import { motion } from "framer-motion"
import Image from "next/image"
import JobQuiz from "@/components/home/job-quiz"
import LoadingAnimation from "@/components/ui/loading-animation"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="container mx-auto py-12">
      <section className="flex flex-col items-center justify-center text-center py-20">
        <div className="relative mb-8">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative w-32 h-32"
          >
            <Image src="/images/logo.svg" alt="Jolt Jordan Logo" fill className="object-contain" priority />
          </motion.div>

          {/* Badge positioned toward the thumb area with a connecting line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute left-[-80px] top-[40px]"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isLoaded ? { width: 40 } : {}}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="absolute top-1/2 right-0 h-[2px] bg-secondary transform -translate-y-1/2"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={isLoaded ? { scale: 1 } : {}}
              transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
              className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md relative right-[40px]"
            >
              Sparking your next job
            </motion.div>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-primary mb-6"
        >
          Find Your Dream Job Today
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8"
        >
          Connect with top employers and discover opportunities that match your skills and career goals.
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg"
            >
              Browse Jobs
            </Button>
          </Link>
        </motion.div>
      </section>

      <JobQuiz />

      <section className="mt-12">
        <h2 className="text-3xl font-bold text-primary mb-8">Latest Job Opportunities</h2>
        <JobListings />
      </section>
    </div>
  )
}

