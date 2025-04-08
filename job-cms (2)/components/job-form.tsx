"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"

import type { JobType } from "@/lib/types"
import { jobCategories } from "@/lib/data" // We'll keep using the categories from mock data
import { createJob, updateJob } from "@/lib/client-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface JobFormProps {
  job?: JobType
  isEditing?: boolean
}

export function JobForm({ job, isEditing = false }: JobFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [formData, setFormData] = useState({
    name: job?.name || "",
    slug: job?.slug || "",
    location: job?.location || "",
    category: job?.category || jobCategories[0],
    salary: job?.salary || "",
    description: job?.description || "",
    excerpt: job?.excerpt || "",
    company: {
      name: job?.company?.name || "",
      industry: job?.company?.industry || "",
      size: job?.company?.size || "",
      website: job?.company?.website || "",
      headquarters: job?.company?.headquarters || "",
      logo: job?.company?.logo || "",
    },
    detail: {
      responsibilities: job?.detail?.responsibilities || [""],
      requirements: job?.detail?.requirements || [""],
      benefits: job?.detail?.benefits || [""],
    },
    tags: job?.tags || [],
  })

  // Debug log for initial tags when editing
  useEffect(() => {
    if (isEditing && job) {
      console.log("Editing job with tags:", job.tags);
      console.log("Tags in form data:", formData.tags);
    }
  }, [isEditing, job, formData.tags]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as object),
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (
    section: "responsibilities" | "requirements" | "benefits",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => {
      const newArray = [...prev.detail[section]]
      newArray[index] = value
      return {
        ...prev,
        detail: {
          ...prev.detail,
          [section]: newArray,
        },
      }
    })
  }

  const addArrayItem = (section: "responsibilities" | "requirements" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [section]: [...prev.detail[section], ""],
      },
    }))
  }

  const removeArrayItem = (section: "responsibilities" | "requirements" | "benefits", index: number) => {
    setFormData((prev) => {
      const newArray = [...prev.detail[section]]
      newArray.splice(index, 1)
      return {
        ...prev,
        detail: {
          ...prev.detail,
          [section]: newArray,
        },
      }
    })
  }

  // Tag handling functions
  const addTag = () => {
    if (tagInput.trim() === "") return
    
    // Don't add duplicate tags
    if (formData.tags.includes(tagInput.trim())) {
      toast({
        title: "Duplicate Tag",
        description: "This tag has already been added.",
        variant: "destructive",
      })
      return
    }
    
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }))
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Add validation for category
    if (!formData.category) {
      toast({
        title: "Missing Category",
        description: "Please select a job category",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true)

    try {
      // CRITICAL FIX: Create a clean data object
      const cleanFormData = {
        name: formData.name,
        slug: formData.slug,
        location: formData.location,
        category: formData.category,
        salary: formData.salary,
        description: formData.description,
        excerpt: formData.excerpt,
        company: { ...formData.company },
        detail: {
          responsibilities: [...formData.detail.responsibilities],
          requirements: [...formData.detail.requirements],
          benefits: [...formData.detail.benefits],
        },
        // IMPORTANT: Explicitly include tags array
        tags: [...formData.tags],
      }
      
      console.log("🔄 Form submission started")
      console.log("🏷️ Tags being submitted:", cleanFormData.tags)
      console.log("📄 Form data structure:", JSON.stringify(cleanFormData, null, 2))

      if (isEditing && job) {
        console.log("✏️ Updating job:", job._id || job.slug)
        const identifier = job._id || job.slug
        const result = await updateJob(identifier, cleanFormData)
        
        console.log("✅ Update result:", result)
        console.log("🏷️ Tags after update:", result?.tags)
        
        toast({
          title: "Job Updated",
          description: "The job has been updated successfully.",
        })
      } else {
        const result = await createJob(cleanFormData);
        console.log("Create result:", result);
        toast({
          title: "Job Created",
          description: "The job has been created successfully.",
        });
      }
      router.push("/jobs");
    } catch (error) {
      console.error("❌ Error submitting job:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} job. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Job Title</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} 
                onValueChange={(value) => handleSelectChange(value, "category")}
                required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input id="salary" name="salary" value={formData.salary} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Short Description</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Company Information</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company.name">Company Name</Label>
                <Input
                  id="company.name"
                  name="company.name"
                  value={formData.company.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company.industry">Industry</Label>
                <Input
                  id="company.industry"
                  name="company.industry"
                  value={formData.company.industry}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company.size">Company Size</Label>
                <Input
                  id="company.size"
                  name="company.size"
                  value={formData.company.size}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company.website">Website</Label>
                <Input
                  id="company.website"
                  name="company.website"
                  value={formData.company.website}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company.headquarters">Headquarters</Label>
                <Input
                  id="company.headquarters"
                  name="company.headquarters"
                  value={formData.company.headquarters}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company.logo">Logo URL</Label>
                <Input id="company.logo" name="company.logo" value={formData.company.logo} onChange={handleChange} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Job Details</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Responsibilities</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("responsibilities")}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.detail.responsibilities.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayChange("responsibilities", index, e.target.value)}
                    required
                  />
                  {formData.detail.responsibilities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("responsibilities", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Requirements</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("requirements")}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.detail.requirements.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                    required
                  />
                  {formData.detail.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("requirements", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Benefits</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("benefits")}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {formData.detail.benefits.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={item} onChange={(e) => handleArrayChange("benefits", index, e.target.value)} required />
                  {formData.detail.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("benefits", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="tags">Tags</Label>
              </div>
              <div className="flex gap-2">
                <Input 
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tag and press Enter"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="text-primary-foreground/70 hover:text-primary-foreground ml-1 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Add technologies or skills required for this job (e.g., React, JavaScript, Marketing)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/jobs")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Job"
          ) : (
            "Create Job"
          )}
        </Button>
      </div>
    </form>
  )
}