"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Trash2, Download } from "lucide-react"

export default function CVGenerateForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  })

  const [education, setEducation] = useState([
    { degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" },
  ])

  const [experience, setExperience] = useState([
    { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
  ])

  const [skills, setSkills] = useState([""])

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [name]: value }
    setEducation(newEducation)
  }

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newExperience = [...experience]
    newExperience[index] = { ...newExperience[index], [name]: value }
    setExperience(newExperience)
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = value
    setSkills(newSkills)
  }

  const addEducation = () => {
    setEducation([
      ...education,
      { degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" },
    ])
  }

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index))
    }
  }

  const addExperience = () => {
    setExperience([
      ...experience,
      { title: "", company: "", location: "", startDate: "", endDate: "", description: "" },
    ])
  }

  const removeExperience = (index: number) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index))
    }
  }

  const addSkill = () => {
    setSkills([...skills, ""])
  }

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      // Here you would typically send the data to your API
      console.log("CV generation form submitted:", {
        personalInfo,
        education,
        experience,
        skills,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setIsGenerated(true)
      setIsGenerating(false)
    } catch (error) {
      console.error("CV generation error:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Enter your basic information for your CV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, Country"
                      value={personalInfo.location}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="linkedin.com/in/username"
                      value={personalInfo.linkedin}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="yourwebsite.com"
                      value={personalInfo.website}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    placeholder="A brief summary of your professional background and goals"
                    className="min-h-[100px]"
                    value={personalInfo.summary}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={() => document.querySelector('[data-value="education"]')?.click()}>
                  Next: Education
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Add your educational background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Education #{index + 1}</h3>
                      {education.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree/Certificate</Label>
                        <Input
                          id={`degree-${index}`}
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`institution-${index}`}>Institution</Label>
                        <Input
                          id={`institution-${index}`}
                          name="institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edu-location-${index}`}>Location</Label>
                        <Input
                          id={`edu-location-${index}`}
                          name="location"
                          value={edu.location}
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                          <Input
                            id={`edu-start-${index}`}
                            name="startDate"
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(index, e)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                          <Input
                            id={`edu-end-${index}`}
                            name="endDate"
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => handleEducationChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`edu-description-${index}`}>Description (optional)</Label>
                      <Textarea
                        id={`edu-description-${index}`}
                        name="description"
                        placeholder="Relevant coursework, achievements, etc."
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addEducation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('[data-value="personal"]')?.click()}
                >
                  Previous: Personal Info
                </Button>
                <Button type="button" onClick={() => document.querySelector('[data-value="experience"]')?.click()}>
                  Next: Experience
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Add your work experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Experience #{index + 1}</h3>
                      {experience.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Job Title</Label>
                        <Input
                          id={`title-${index}`}
                          name="title"
                          value={exp.title}
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company</Label>
                        <Input
                          id={`company-${index}`}
                          name="company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`exp-location-${index}`}>Location</Label>
                        <Input
                          id={`exp-location-${index}`}
                          name="location"
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                          <Input
                            id={`exp-start-${index}`}
                            name="startDate"
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, e)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                          <Input
                            id={`exp-end-${index}`}
                            name="endDate"
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`exp-description-${index}`}>Description</Label>
                      <Textarea
                        id={`exp-description-${index}`}
                        name="description"
                        placeholder="Describe your responsibilities and achievements"
                        className="min-h-[100px]"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addExperience} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('[data-value="education"]')?.click()}
                >
                  Previous: Education
                </Button>
                <Button type="button" onClick={() => document.querySelector('[data-value="skills"]')?.click()}>
                  Next: Skills
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add your technical and professional skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g., JavaScript, Project Management, etc."
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                      />
                      {skills.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={addSkill} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('[data-value="experience"]')?.click()}
                >
                  Previous: Experience
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate CV"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>

      {isGenerated && (
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-primary mb-2">Your CV has been generated!</h2>
              <p className="text-gray-600 mb-6">
                Your professional CV has been created based on the information you provided.
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

