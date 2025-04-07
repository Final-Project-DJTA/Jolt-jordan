"use client"

import { useState, useEffect } from "react"
import ProfileForm from "@/components/profile/profile-form"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function EditProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Add this line
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch profile")
        }
        
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Edit Profile</h1>
        {user && <ProfileForm user={user} />}
      </div>
    </div>
  )
}

