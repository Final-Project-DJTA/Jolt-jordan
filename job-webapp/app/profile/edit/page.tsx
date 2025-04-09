"use client"

// Add dynamic export to prevent static generation
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { UserType } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Form validation schema
const formSchema = z.object({
  avatar: z.string().optional(),
  location: z.string().optional(),
  jobPosition: z.string().max(500, "Job position cannot exceed 500 characters").optional(), // Changed from bio to jobPosition
  skills: z.string().optional(), // Will be split into array before submission
})

type FormValues = z.infer<typeof formSchema>

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState<UserType | null>(null)
  const [skillsInput, setSkillsInput] = useState("")
  const router = useRouter()

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      location: "",
      jobPosition: "", // Changed from bio to jobPosition
      skills: "",
    },
  })

  // Fetch profile data
  useEffect(() => {
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
        console.log("Profile data:", data)
        setUserData(data)

        // Set form values
        form.reset({
          avatar: data.profile?.avatar || "",
          location: data.profile?.location || "",
          jobPosition: data.profile?.jobPosition || "", // Changed from bio to jobPosition
        })

        // Set skills input (comma-separated string)
        setSkillsInput(data.profile?.skills?.join(", ") || "")
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router, form])

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      // Parse skills from comma-separated input
      const skills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "")

      // Prepare data for submission
      const updatedProfile = {
        avatar: values.avatar,
        location: values.location,
        jobPosition: values.jobPosition, // Changed from bio to jobPosition
        skills,
      }

      console.log("Submitting profile update with data:", updatedProfile)

      // Submit to API
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
        cache: "no-store", // Critical: Prevent fetch caching
      })

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`)
      }

      // Show success message
      toast.success("Profile updated successfully")
      
      // Add a more reliable approach to handle avatar updates
      try {
        // Attempt to pre-load the new image if it exists
        if (values.avatar) {
          const img = new Image();
          img.src = values.avatar + '?nocache=' + Date.now();
          
          // Wait a bit for the image to start loading
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Force all browsers to clear their image cache for this domain
          const links = document.querySelectorAll('link[rel="prefetch"], link[rel="preload"]');
          links.forEach(link => link.parentNode?.removeChild(link));
          
          // Remove the image from browser cache if possible
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => caches.delete(name));
            });
          }
        }
      } catch (err) {
        console.error("Cache clearing error:", err);
        // Continue even if this fails
      }
      
      // Generate a strong cache-busting parameter
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2);
      const nonce = `${timestamp}-${random}`;
      
      // Force router refresh
      router.refresh();
      
      // Hard redirect with cache busting
      window.location.href = `/profile?nocache=${nonce}`;
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  // Calculate initials for avatar
  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {userData?.profile?.avatar ? (
                <AvatarImage src={userData.profile.avatar} alt={userData.name} />
              ) : null}
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{userData?.name}</CardTitle>
              <CardDescription>@{userData?.username}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Avatar URL Field */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for your profile picture
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Position Field */}
              <FormField
                control={form.control}
                name="jobPosition" // Changed from bio to jobPosition
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your current or desired job position..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills Field (custom handling) */}
              <div className="space-y-2">
                <FormLabel>Skills</FormLabel>
                <Input
                  placeholder="JavaScript, React, Node.js"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
                <FormDescription>
                  Enter your skills separated by commas
                </FormDescription>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

