"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Building2, ChevronLeft, Eye, EyeOff, MapPin, Plus, Save, Trash2, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Types based on the provided schema
export type UserType = {
  name: string
  email: string
  phoneNumber: string
  username: string
  password: string
  profile?: Profile
}

export type Profile = {
  avatar?: string
  location?: string
  bio?: string
  resume?: string
  skills?: string[]
  appliedJobs?: string[]
  savedJobs?: string[]
}

export default function ProfilePage() {
  const router = useRouter()

  // State for form data
  const [formData, setFormData] = useState<UserType>({
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    username: "johndoe",
    password: "********",
    profile: {
      avatar: "/placeholder.svg?height=200&width=200",
      location: "San Francisco, CA",
      bio: "Experienced software developer with a passion for creating user-friendly applications.",
      resume: "",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      appliedJobs: ["1", "3", "5"],
      savedJobs: ["2", "4", "6"],
    },
  })

  // State for new skill input
  const [newSkill, setNewSkill] = useState("")

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false)

  // State for password confirmation
  const [passwordConfirm, setPasswordConfirm] = useState("********")

  // Handle input changes for basic user fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle profile input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      profile: {
        ...formData.profile!,
        [name]: value,
      },
    })
  }

  // Add new skill
  const addSkill = () => {
    if (newSkill.trim() && !formData.profile?.skills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile!,
          skills: [...(formData.profile?.skills || []), newSkill.trim()],
        },
      })
      setNewSkill("")
    }
  }

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile!,
        skills: formData.profile?.skills?.filter((skill) => skill !== skillToRemove),
      },
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would send this data to your API
    console.log("Updating profile:", formData)

    // Mock successful submission
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            JobPortal
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/jobs" className="text-gray-600 hover:text-primary">
              Browse Jobs
            </Link>
            <Link href="/companies" className="text-gray-600 hover:text-primary">
              Companies
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex space-x-3">
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button>
              <Briefcase className="mr-2 h-4 w-4" />
              My Jobs
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary mr-2">
            <ChevronLeft className="h-4 w-4 inline" />
            <span className="ml-1">Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={formData.profile?.avatar || "/placeholder.svg?height=200&width=200"}
                      alt="Profile avatar"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{formData.name}</h2>
                  <p className="text-gray-500 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.profile?.location || "No location set"}
                  </p>
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Profile Completion</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.profile?.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {!formData.profile?.skills?.length && (
                        <p className="text-sm text-gray-500">No skills added yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Account Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Applied Jobs</span>
                        <span className="font-medium">{formData.profile?.appliedJobs?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Saved Jobs</span>
                        <span className="font-medium">{formData.profile?.savedJobs?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium">Jan 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="profile">Profile Details</TabsTrigger>
                  <TabsTrigger value="jobs">My Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passwordConfirm">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="passwordConfirm"
                            type={showPassword ? "text" : "password"}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordConfirm !== formData.password && passwordConfirm.length > 0 && (
                          <p className="text-sm text-red-500">Passwords do not match</p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>
                        Enhance your profile with additional information to stand out to employers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden border">
                            <img
                              src={formData.profile?.avatar || "/placeholder.svg?height=200&width=200"}
                              alt="Profile avatar"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              id="avatar"
                              name="avatar"
                              placeholder="Enter image URL or upload an image"
                              value={formData.profile?.avatar || ""}
                              onChange={handleProfileChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter a URL or upload a profile picture (recommended size: 200x200px)
                            </p>
                          </div>
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g. San Francisco, CA"
                          value={formData.profile?.location || ""}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell employers about yourself"
                          value={formData.profile?.bio || ""}
                          onChange={handleProfileChange}
                          rows={4}
                        />
                        <p className="text-xs text-gray-500">
                          A brief description of your professional background, skills, and career goals.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resume">Resume</Label>
                        <div className="flex gap-2">
                          <Input
                            id="resume"
                            name="resume"
                            placeholder="Upload your resume or enter a link"
                            value={formData.profile?.resume || ""}
                            onChange={handleProfileChange}
                          />
                          <Button type="button" variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Accepted formats: PDF, DOCX, DOC (Max size: 5MB)</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            id="skills"
                            placeholder="Add a skill (e.g. JavaScript, Project Management)"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addSkill()
                              }
                            }}
                          />
                          <Button type="button" onClick={addSkill}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.profile?.skills?.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 rounded-full hover:bg-gray-200 p-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {!formData.profile?.skills?.length && (
                            <p className="text-sm text-gray-500">No skills added yet</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="jobs">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Applied Jobs</CardTitle>
                        <CardDescription>Jobs you have applied for</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {appliedJobs.length > 0 ? (
                          <div className="space-y-4">
                            {appliedJobs.map((job) => (
                              <Link href={`/jobs/${job.id}`} key={job.id}>
                                <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                                    <Building2 className="text-primary" size={20} />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium">{job.title}</h3>
                                    <div className="text-sm text-gray-500">{job.company}</div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <MapPin size={12} className="mr-1" />
                                      {job.location}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline">{job.status}</Badge>
                                    <div className="text-xs text-gray-500 mt-1">Applied {job.appliedDate}</div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-lg font-medium">No applications yet</h3>
                            <p className="mt-1 text-gray-500">
                              You haven't applied to any jobs yet. Start browsing jobs to find your next opportunity.
                            </p>
                            <Button className="mt-4" asChild>
                              <Link href="/jobs">Browse Jobs</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Saved Jobs</CardTitle>
                        <CardDescription>Jobs you have saved for later</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {savedJobs.length > 0 ? (
                          <div className="space-y-4">
                            {savedJobs.map((job) => (
                              <Link href={`/jobs/${job.id}`} key={job.id}>
                                <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                                    <Building2 className="text-primary" size={20} />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium">{job.title}</h3>
                                    <div className="text-sm text-gray-500">{job.company}</div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <MapPin size={12} className="mr-1" />
                                      {job.location}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge>{job.type}</Badge>
                                    <div className="text-xs text-gray-500 mt-1">Saved {job.savedDate}</div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-lg font-medium">No saved jobs</h3>
                            <p className="mt-1 text-gray-500">
                              You haven't saved any jobs yet. Save jobs to apply to them later.
                            </p>
                            <Button className="mt-4" asChild>
                              <Link href="/jobs">Browse Jobs</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data for applied jobs
const appliedJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    status: "In Review",
    appliedDate: "2 days ago",
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    status: "Interview",
    appliedDate: "1 week ago",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Austin, TX",
    status: "Rejected",
    appliedDate: "2 weeks ago",
  },
]

// Sample data for saved jobs
const savedJobs = [
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    type: "Full-time",
    savedDate: "3 days ago",
  },
  {
    id: "4",
    title: "Marketing Specialist",
    company: "GrowthLabs",
    location: "Chicago, IL",
    type: "Contract",
    savedDate: "5 days ago",
  },
  {
    id: "6",
    title: "Content Writer",
    company: "MediaPulse",
    location: "Remote",
    type: "Part-time",
    savedDate: "1 week ago",
  },
]

