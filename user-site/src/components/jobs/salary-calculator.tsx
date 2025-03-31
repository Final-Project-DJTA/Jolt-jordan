"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, DollarSign } from "lucide-react"

export default function SalaryCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [experience, setExperience] = useState("mid")
  const [location, setLocation] = useState("urban")
  const [industry, setIndustry] = useState("tech")
  const [skills, setSkills] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [salary, setSalary] = useState(0)

  const calculateSalary = () => {
    // This is a simplified calculation
    let baseSalary = 70000

    // Experience multiplier
    if (experience === "entry") baseSalary *= 0.8
    if (experience === "mid") baseSalary *= 1
    if (experience === "senior") baseSalary *= 1.5
    if (experience === "executive") baseSalary *= 2.2

    // Location adjustment
    if (location === "rural") baseSalary *= 0.9
    if (location === "suburban") baseSalary *= 1
    if (location === "urban") baseSalary *= 1.2
    if (location === "major") baseSalary *= 1.4

    // Industry adjustment
    if (industry === "nonprofit") baseSalary *= 0.85
    if (industry === "education") baseSalary *= 0.9
    if (industry === "healthcare") baseSalary *= 1.1
    if (industry === "finance") baseSalary *= 1.3
    if (industry === "tech") baseSalary *= 1.25

    // Skills bonus (simplified)
    const skillsList = skills.split(",").filter((skill) => skill.trim().length > 0)
    baseSalary += skillsList.length * 2000

    setSalary(Math.round(baseSalary))
    setShowResult(true)
  }

  return (
    <div className="my-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="mx-auto flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Calculator className="h-4 w-4" />
          {isOpen ? "Close Salary Calculator" : "Estimate Your Market Value"}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6"
          >
            <Card className="border-secondary/20">
              <CardHeader className="bg-secondary/10">
                <CardTitle>Salary Calculator</CardTitle>
                <CardDescription>Estimate your market value based on experience, location, and skills</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                          <SelectItem value="executive">Executive Level (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location Type</Label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rural">Rural Area</SelectItem>
                          <SelectItem value="suburban">Suburban Area</SelectItem>
                          <SelectItem value="urban">Urban Area</SelectItem>
                          <SelectItem value="major">Major City</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="nonprofit">Non-profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Key Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., JavaScript, React, Project Management"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Add specialized skills to increase your estimated value</p>
                  </div>

                  <Button onClick={calculateSalary} className="bg-primary hover:bg-primary/90 w-full">
                    Calculate Estimated Salary
                  </Button>
                </div>

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-8 text-center"
                    >
                      <h3 className="text-lg font-medium text-primary mb-2">Your Estimated Market Value</h3>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center"
                      >
                        <DollarSign className="h-8 w-8 text-secondary" />
                        <span className="text-4xl font-bold text-secondary">{salary.toLocaleString()}</span>
                        <span className="text-lg text-gray-500 ml-1">/year</span>
                      </motion.div>
                      <p className="text-sm text-gray-600 mt-2">
                        Based on your experience, location, industry, and skills
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

