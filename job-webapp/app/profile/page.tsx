"use client"

import { useState, useEffect } from "react"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
    
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Make sure this is added
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch profile")
        }
        
        const userData = await response.json()
        // Make sure the data structure is consistent with what components expect
        if (userData && !userData.profile && userData._id) {
          // If we get separated user and profile data, restructure it
          const { _id, name, email, username, ...profileData } = userData;
          setUser({
            _id,
            name, 
            email,
            username,
            profile: profileData // Put the rest of the data in profile
          })
        } else {
          // Data already has the right structure
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        // Use fallback mock data if needed
        setUser({
          name: "User",
          email: "user@example.com",
          username: "user",
          profile: {
            avatar: "/placeholder.svg?height=100&width=100",
            location: "",
            bio: "",
            skills: [],
            tags: [],
            appliedJobs: [],
            savedJobs: [],
          }
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfile()
  }, [router])

  // Use the fetched user data or fall back to mock data if still loading
  const userData = user || {
    name: "Loading...",
    email: "",
    username: "",
    profile: {
      avatar: "/placeholder.svg?height=100&width=100",
      location: "",
      bio: "",
      skills: [],
      tags: [],
      appliedJobs: [],
      savedJobs: [],
    },
  }

  // Make sure both components get the data they expect
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
            {/* Add conditional rendering to avoid empty src */}
            <Image 
              src="/images/logo.svg" 
              alt="Jolt Jordan Logo" 
              fill 
              className="object-contain" 
            />
          </motion.div>
        </motion.div>
      )}
      <ProfileHeader user={userData} />
      <div className="mt-8">
        <ProfileTabs user={userData} />
      </div>
    </div>
  )
}

