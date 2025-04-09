"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CVGenerateFormProps {
  profileData: any
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onComplete: (data: any) => void
}

export default function CVGenerateForm({
  profileData,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete
}: CVGenerateFormProps) {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      position: "",
      location: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      summary: ""
    },
    education: [],
    experience: [],
    skills: []
  })
  
  const [errors, setErrors] = useState<{
    personalInfo?: Record<string, string>;
    education?: Record<number, Record<string, string>>;
    experience?: Record<number, Record<string, string>>;
    skills?: string;
  }>({})
  
  const [skillsInput, setSkillsInput] = useState("")
  
  // Initialize form data from profile data when it's available
  useEffect(() => {
    if (profileData) {
      setFormData({
        personalInfo: profileData.personalInfo || formData.personalInfo,
        education: profileData.education || [],
        experience: profileData.experience || [],
        skills: profileData.skills || []
      })
      setSkillsInput(profileData.skills?.join(", ") || "")
    }
  }, [profileData])
  
  // Handle input changes for personal info
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: value
      }
    })
    
    // Clear error for this field if it exists
    if (errors.personalInfo?.[name]) {
      setErrors({
        ...errors,
        personalInfo: {
          ...errors.personalInfo,
          [name]: ""
        }
      })
    }
  }
  
  // Handle adding education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    })
  }
  
  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    }
    setFormData({
      ...formData,
      education: updatedEducation
    })
    
    // Clear error for this field if it exists
    if (errors.education?.[index]?.[field]) {
      const updatedErrors = { ...errors }
      if (updatedErrors.education?.[index]) {
        updatedErrors.education[index][field] = ""
      }
      setErrors(updatedErrors)
    }
  }
  
  // Handle removing education entry
  const removeEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      education: updatedEducation
    })
  }
  
  // Handle adding experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    })
  }
  
  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    }
    setFormData({
      ...formData,
      experience: updatedExperience
    })
    
    // Clear error for this field if it exists
    if (errors.experience?.[index]?.[field]) {
      const updatedErrors = { ...errors }
      if (updatedErrors.experience?.[index]) {
        updatedErrors.experience[index][field] = ""
      }
      setErrors(updatedErrors)
    }
  }
  
  // Handle removing experience entry
  const removeExperience = (index) => {
    const updatedExperience = formData.experience.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      experience: updatedExperience
    })
  }
  
  // Handle skills changes
  const handleSkillsChange = (e) => {
    const skillsString = e.target.value
    setSkillsInput(skillsString)
    
    const skillsArray = skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== "")
    
    setFormData({
      ...formData,
      skills: skillsArray
    })
    
    // Clear skills error if it exists
    if (errors.skills) {
      setErrors({
        ...errors,
        skills: ""
      })
    }
  }
  
  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        const personalInfoErrors = {}
        
        if (!formData.personalInfo.fullName?.trim()) {
          personalInfoErrors["fullName"] = "Full name is required"
        }
        
        if (!formData.personalInfo.email?.trim()) {
          personalInfoErrors["email"] = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
          personalInfoErrors["email"] = "Please enter a valid email"
        }
        
        if (Object.keys(personalInfoErrors).length > 0) {
          setErrors({ ...errors, personalInfo: personalInfoErrors })
          return false
        }
        
        return true
        
      case 1: // Education
        return true // Education is optional
        
      case 2: // Experience
        return true // Experience is optional
        
      case 3: // Skills
        return true // Skills are optional
        
      default:
        return true
    }
  }
  
  // Handle next button click
  const handleNext = () => {
    const isValid = validateStep()
    if (isValid) {
      onNext()
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before continuing.",
        variant: "destructive",
      })
    }
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete(formData)
  }
  
  // Render different form sections based on current step
  const renderFormSection = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="fullName" 
                  value={formData.personalInfo.fullName || ""} 
                  onChange={handlePersonalInfoChange} 
                  placeholder="John Doe"
                  className={errors.personalInfo?.fullName ? "border-red-500" : ""}
                />
                {errors.personalInfo?.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.personalInfo.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <Input 
                  name="position" 
                  value={formData.personalInfo.position || ""} 
                  onChange={handlePersonalInfoChange} 
                  placeholder="Software Developer"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="email" 
                  type="email"
                  value={formData.personalInfo.email || ""} 
                  onChange={handlePersonalInfoChange} 
                  placeholder="john.doe@example.com"
                  className={errors.personalInfo?.email ? "border-red-500" : ""}
                />
                {errors.personalInfo?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.personalInfo.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input 
                  name="phone" 
                  value={formData.personalInfo.phone || ""} 
                  onChange={handlePersonalInfoChange} 
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input 
                name="location" 
                value={formData.personalInfo.location || ""} 
                onChange={handlePersonalInfoChange} 
                placeholder="City, Country"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                <Input 
                  name="linkedin" 
                  value={formData.personalInfo.linkedin || ""} 
                  onChange={handlePersonalInfoChange} 
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub</label>
                <Input 
                  name="github" 
                  value={formData.personalInfo.github || ""} 
                  onChange={handlePersonalInfoChange} 
                  placeholder="github.com/johndoe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Professional Summary</label>
              <Textarea 
                name="summary" 
                value={formData.personalInfo.summary || ""} 
                onChange={handlePersonalInfoChange} 
                placeholder="Write a brief summary of your professional background and skills..."
                rows={4}
              />
            </div>
          </div>
        )
        
      case 1: // Education
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Education</h2>
            {formData.education.length === 0 ? (
              <p className="text-gray-500 italic">No education entries yet. Add your educational background below.</p>
            ) : (
              formData.education.map((edu, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Education #{index + 1}</h3>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Degree</label>
                        <Input 
                          value={edu.degree || ""} 
                          onChange={(e) => handleEducationChange(index, "degree", e.target.value)} 
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Institution</label>
                        <Input 
                          value={edu.institution || ""} 
                          onChange={(e) => handleEducationChange(index, "institution", e.target.value)} 
                          placeholder="University Name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input 
                          value={edu.location || ""} 
                          onChange={(e) => handleEducationChange(index, "location", e.target.value)} 
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date (YYYY-MM)</label>
                        <Input 
                          value={edu.startDate || ""} 
                          onChange={(e) => handleEducationChange(index, "startDate", e.target.value)} 
                          placeholder="2018-09"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date (YYYY-MM)</label>
                        <Input 
                          value={edu.endDate || ""} 
                          onChange={(e) => handleEducationChange(index, "endDate", e.target.value)} 
                          placeholder="2022-05"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea 
                        value={edu.description || ""} 
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)} 
                        placeholder="Additional details about your education..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            <Button 
              variant="outline" 
              type="button" 
              onClick={addEducation}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        )
        
      case 2: // Experience
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            {formData.experience.length === 0 ? (
              <p className="text-gray-500 italic">No experience entries yet. Add your work history below.</p>
            ) : (
              formData.experience.map((exp, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Experience #{index + 1}</h3>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <Input 
                          value={exp.title || ""} 
                          onChange={(e) => handleExperienceChange(index, "title", e.target.value)} 
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <Input 
                          value={exp.company || ""} 
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)} 
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input 
                          value={exp.location || ""} 
                          onChange={(e) => handleExperienceChange(index, "location", e.target.value)} 
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date (YYYY-MM)</label>
                        <Input 
                          value={exp.startDate || ""} 
                          onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)} 
                          placeholder="2020-01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date (YYYY-MM)</label>
                        <Input 
                          value={exp.endDate || ""} 
                          onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)} 
                          placeholder="2022-12 (or Present)"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea 
                        value={exp.description || ""} 
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)} 
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            <Button 
              variant="outline" 
              type="button" 
              onClick={addExperience}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        )
        
      case 3: // Skills
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter your skills (comma separated)
              </label>
              <Textarea 
                value={skillsInput} 
                onChange={handleSkillsChange}
                placeholder="JavaScript, React, Node.js, Python, SQL, Project Management..."
                rows={5}
              />
              <p className="text-sm text-gray-500 mt-1">
                Add your technical skills, soft skills, and any tools or technologies you're proficient in.
              </p>
            </div>
            
            {formData.skills.length > 0 && (
              <div className="pt-3">
                <h3 className="text-sm font-medium mb-2">Preview:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
        
      case 4: // Review
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review Your CV</h2>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary mb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="font-medium">Full Name:</div>
                <div>{formData.personalInfo.fullName}</div>
                
                <div className="font-medium">Position:</div>
                <div>{formData.personalInfo.position}</div>
                
                <div className="font-medium">Email:</div>
                <div>{formData.personalInfo.email}</div>
                
                <div className="font-medium">Phone:</div>
                <div>{formData.personalInfo.phone}</div>
                
                <div className="font-medium">Location:</div>
                <div>{formData.personalInfo.location}</div>
              </div>
              
              {formData.personalInfo.summary && (
                <>
                  <div className="font-medium mt-2">Summary:</div>
                  <p className="text-sm mt-1">{formData.personalInfo.summary}</p>
                </>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary mb-2">Education ({formData.education.length})</h3>
              {formData.education.length > 0 ? (
                formData.education.map((edu, index) => (
                  <div key={index} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="font-medium">{edu.degree}</div>
                    <div>{edu.institution}{edu.location ? `, ${edu.location}` : ""}</div>
                    <div className="text-sm text-gray-500">
                      {edu.startDate && edu.startDate}{edu.startDate && edu.endDate && " - "}{edu.endDate && edu.endDate}
                    </div>
                    {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No education entries added</p>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary mb-2">Experience ({formData.experience.length})</h3>
              {formData.experience.length > 0 ? (
                formData.experience.map((exp, index) => (
                  <div key={index} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="font-medium">{exp.title}</div>
                    <div>{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                    <div className="text-sm text-gray-500">
                      {exp.startDate && exp.startDate}{exp.startDate && exp.endDate && " - "}{exp.endDate && exp.endDate}
                    </div>
                    {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No experience entries added</p>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary mb-2">Skills ({formData.skills.length})</h3>
              {formData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added</p>
              )}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {renderFormSection()}
      
      <div className="mt-8 flex justify-between">
        <Button 
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < totalSteps - 1 ? (
          <Button 
            type="button"
            onClick={handleNext}
            className="flex items-center"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            Complete & Generate CV
          </Button>
        )}
      </div>
    </form>
  )
}
