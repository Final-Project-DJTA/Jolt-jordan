"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CVGenerateForm from "@/components/cv/cv-generate-form"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/hooks/use-toast"

export default function CVGeneratePage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  
  // Define the form steps
  const steps = [
    "Personal Info",
    "Education",
    "Experience",
    "Skills",
    "Review"
  ]

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 401) {
            toast({
              title: "Authentication Required",
              description: "Please login to access this feature",
              variant: "destructive",
            })
            router.push("/login")
            return
          }
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }

        const data = await response.json()
        
        // Prepare the profile data
        const processedData = {
          personalInfo: data.profile?.personalInfo || {
            fullName: data.name || "",
            email: data.email || "",
            position: data.profile?.jobPosition || "",
            location: data.profile?.location || "",
            phone: "",
            linkedin: "",
            github: "",
            summary: ""
          },
          education: data.profile?.education || [],
          experience: data.profile?.experience || [],
          skills: data.profile?.skills || []
        }
        
        setProfileData(processedData)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle completed form
  const handleFormComplete = (finalData) => {
    // Save the data to the profile
    saveToProfile(finalData)
    
    // Redirect to the CV preview page
    router.push("/profile/create-resume")
  }
  
  // Save data to profile
  const saveToProfile = async (data) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`)
      }

      toast({
        title: "Profile Updated",
        description: "Your CV data has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save your CV data.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p>Loading your profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Generate CV</h1>
        <p className="text-gray-600 mb-6">Fill in your details to generate a professional CV</p>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`text-sm ${currentStep === index ? 'font-bold text-primary' : 'text-gray-500'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <CVGenerateForm 
          profileData={profileData}
          currentStep={currentStep}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          onComplete={handleFormComplete}
          totalSteps={steps.length}
        />
      </div>
    </div>
  )
}

