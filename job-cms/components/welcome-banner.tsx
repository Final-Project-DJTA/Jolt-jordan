"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/data"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export function WelcomeBanner() {
  const [showFox, setShowFox] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFox(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
          <p className="text-primary-foreground/80 max-w-md">
            Manage your job listings and track applications all in one place. Need to post a new job? Click the button
            to get started.
          </p>
          <Button asChild className="mt-4 bg-secondary text-primary hover:bg-secondary/90">
            <Link href="/jobs/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post New Job
            </Link>
          </Button>
        </div>

        {showFox && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="relative h-32 w-32 md:h-40 md:w-40"
          >
            <motion.img
              src="/jojo-logo.svg"
              alt="Jojo Jobs"
              className="h-full w-full object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -top-6 -right-2 bg-white text-primary px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Hi there!
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>
    </div>
  )
}

