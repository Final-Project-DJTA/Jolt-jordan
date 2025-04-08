"use client"

import { useState, useEffect } from "react"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileTabs from "@/components/profile/profile-tabs"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

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
          credentials: "include",
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Profile API response:", data)
        
        // Properly structure the user and profile data
        // Check if data is already properly structured
        if (data && data.profile) {
          // Data already has the expected structure
          setUser(data)
        } 
        // Handle case where profile might be embedded differently
        else if (data && data._id) {
          // Extract user fields vs profile fields
          const { 
            _id, name, email, username, role, telegramId, telegramVerified,
            // Everything else goes into profile
            ...profileFields 
          } = data;
          
          // Create properly structured user object
          setUser({
            _id,
            name,
            email,
            username,
            role: role || "user",
            telegramId,
            telegramVerified,
            // Ensure profile is properly structured
            profile: {
              // Include known profile fields
              userId: _id,
              avatar: profileFields.avatar || "",
              location: profileFields.location || "",
              bio: profileFields.bio || "",
              skills: profileFields.skills || [],
              tags: profileFields.tags || [],
              appliedJobs: profileFields.appliedJobs || [],
              savedJobs: profileFields.savedJobs || [],
              personalInfo: profileFields.personalInfo || {},
              education: profileFields.education || [],
              experience: profileFields.experience || []
            }
          })
        } else {
          console.error("Unexpected data structure from API:", data)
          throw new Error("Invalid data structure received from API")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        // Use fallback mock data if needed
        setUser({
          name: "User",
          email: "user@example.com",
          username: "user",
          profile: {
            avatar: "",
            location: "",
            bio: "",
            skills: [],
            tags: [],
            appliedJobs: [],
            savedJobs: [],
            personalInfo: {},
            education: [],
            experience: []
          }
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfile()
  }, [router])

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
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
            <Image 
              src="/images/logo.svg" 
              alt="Jolt Jordan Logo" 
              fill 
              className="object-contain" 
            />
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

