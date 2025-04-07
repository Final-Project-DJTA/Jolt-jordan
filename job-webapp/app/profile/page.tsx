"use client"

import { useState, useEffect } from "react"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mock user data - in a real app, this would come from your database
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    username: "johndoe",
    profile: {
      avatar: "/placeholder.svg?height=100&width=100",
      location: "New York, NY",
      bio: "Experienced software developer with a passion for creating user-friendly applications.",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      appliedJobs: [],
      savedJobs: [],
    },
  }

  return (
    <div className="container mx-auto py-12">
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 right-8 z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
            className="relative w-16 h-16 cursor-pointer"
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image src="/images/logo.svg" alt="Jolt Jordan Logo" fill className="object-contain" />
          </motion.div>
        </motion.div>
      )}
      <ProfileHeader user={user} />
      <div className="mt-8">
        <ProfileTabs user={user} />
      </div>
    </div>
  )
}

