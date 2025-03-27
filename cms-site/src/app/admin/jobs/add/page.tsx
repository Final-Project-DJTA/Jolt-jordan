"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Building2, ChevronLeft, Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types based on the provided schema
export type JobType = {
  _id: string
  name: string
  slug: string
  location: string
  category: string
  salary: string
  description: string
  excerpt: string
  company: Company
  detail: Detail
  createdAt: Date
  updatedAt: Date
}

export type Company = {
  name: string
  industry: string
  size: string
  website: string
  headquarters: string
  logo: string
}

export type Detail = {
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

export default function AddJobPage() {
  const router = useRouter()

  // State for form data
  const [formData, setFormData] = useState<Omit<JobType, "_id" | "createdAt" | "updatedAt">>({
    name: "",
    slug: "",
    location: "",
    category: "",
    salary: "",
    description: "",
    excerpt: "",
    company: {
      name: "",
      industry: "",
      size: "",
      website: "",
      headquarters: "",
      logo: "",
    },
    detail: {
      responsibilities: [""],
      requirements: [""],
      benefits: [""],
    },
  })

  // Handle input changes for basic job fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
      setFormData({
        ...formData,
        name: value,
        slug: slug,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle company input changes
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      company: {
        ...formData.company,
        [name]: value,
      },
    })
  }

  // Handle array field changes (responsibilities, requirements, benefits)
  const handleArrayFieldChange = (
    field: "responsibilities" | "requirements" | "benefits",
    index: number,
    value: string,
  ) => {
    const updatedArray = [...formData.detail[field]]
    updatedArray[index] = value

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        [field]: updatedArray,
      },
    })
  }

  // Add new item to array fields
  const addArrayItem = (field: "responsibilities" | "requirements" | "benefits") => {
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        [field]: [...formData.detail[field], ""],
      },
    })
  }

  // Remove item from array fields
  const removeArrayItem = (field: "responsibilities" | "requirements" | "benefits", index: number) => {
    if (formData.detail[field].length > 1) {
      const updatedArray = [...formData.detail[field]]
      updatedArray.splice(index, 1)

      setFormData({
        ...formData,
        detail: {
          ...formData.detail,
          [field]: updatedArray,
        },
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would send this data to your API
    console.log("Submitting job:", formData)

    // Mock successful submission
    alert("Job added successfully!")
    router.push("/admin/jobs")
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col bg-gray-900 text-white">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Briefcase className="h-6 w-6" />
            <span>JobPortal</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <div className="py-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Dashboard</h4>
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                <Briefcase className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/admin/jobs"
                className="flex items-center gap-3 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
              </Link>
              <Link
                href="/admin/applications"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                <Briefcase className="h-4 w-4" />
                Applications
              </Link>
              <Link
                href="/admin/companies"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                <Building2 className="h-4 w-4" />
                Companies
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <Link
              href="/admin/jobs"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Jobs
            </Link>
            <h1 className="text-lg font-semibold">Add New Job</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic-info" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="company-info">Company Info</TabsTrigger>
                <TabsTrigger value="job-details">Job Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic details about the job posting.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Job Title</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. Senior Frontend Developer"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          placeholder="e.g. senior-frontend-developer"
                          value={formData.slug}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          URL-friendly version of the job title. Auto-generated but can be edited.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g. San Francisco, CA or Remote"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          name="category"
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        name="salary"
                        placeholder="e.g. $80K - $120K"
                        value={formData.salary}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Short Description</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        placeholder="Brief overview of the position (1-2 sentences)"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        rows={2}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        This will be displayed in job listings and search results.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed description of the job"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company-info">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Enter details about the company offering this position.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        name="name"
                        placeholder="e.g. Acme Inc."
                        value={formData.company.name}
                        onChange={handleCompanyChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          name="industry"
                          placeholder="e.g. Information Technology"
                          value={formData.company.industry}
                          onChange={handleCompanyChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Company Size</Label>
                        <Select
                          value={formData.company.size}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                size: value,
                              },
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1001+">1001+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          placeholder="e.g. https://www.example.com"
                          value={formData.company.website}
                          onChange={handleCompanyChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="headquarters">Headquarters</Label>
                        <Input
                          id="headquarters"
                          name="headquarters"
                          placeholder="e.g. San Francisco, CA"
                          value={formData.company.headquarters}
                          onChange={handleCompanyChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo">Company Logo</Label>
                      <div className="flex items-center gap-4">
                        {formData.company.logo ? (
                          <div className="relative h-16 w-16 rounded-md border overflow-hidden">
                            <img
                              src={formData.company.logo || "/placeholder.svg"}
                              alt="Company logo"
                              className="h-full w-full object-contain"
                            />
                            <button
                              type="button"
                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  company: {
                                    ...formData.company,
                                    logo: "",
                                  },
                                })
                              }}
                            >
                              <Trash2 className="h-6 w-6 text-white" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-gray-50">
                            <Building2 className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            id="logo"
                            name="logo"
                            placeholder="Enter logo URL or upload an image"
                            value={formData.company.logo}
                            onChange={handleCompanyChange}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter a URL or upload a company logo (recommended size: 200x200px)
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="job-details">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>
                      Add specific details about the job responsibilities, requirements, and benefits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Responsibilities</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem("responsibilities")}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <Separator />
                      {formData.detail.responsibilities.map((item, index) => (
                        <div key={`resp-${index}`} className="flex gap-2">
                          <Input
                            placeholder={`Responsibility ${index + 1}`}
                            value={item}
                            onChange={(e) => handleArrayFieldChange("responsibilities", index, e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem("responsibilities", index)}
                            disabled={formData.detail.responsibilities.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Requirements</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("requirements")}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <Separator />
                      {formData.detail.requirements.map((item, index) => (
                        <div key={`req-${index}`} className="flex gap-2">
                          <Input
                            placeholder={`Requirement ${index + 1}`}
                            value={item}
                            onChange={(e) => handleArrayFieldChange("requirements", index, e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem("requirements", index)}
                            disabled={formData.detail.requirements.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Benefits</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("benefits")}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <Separator />
                      {formData.detail.benefits.map((item, index) => (
                        <div key={`ben-${index}`} className="flex gap-2">
                          <Input
                            placeholder={`Benefit ${index + 1}`}
                            value={item}
                            onChange={(e) => handleArrayFieldChange("benefits", index, e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem("benefits", index)}
                            disabled={formData.detail.benefits.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/jobs")}>
                Cancel
              </Button>
              <Button type="submit">Create Job</Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

