"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, DollarSign } from "lucide-react"

// Location-based salary multipliers for Indonesia
const locationAdjustments: Record<string, number> = {
  Remote: 1.5,
  Jakarta: 1.4,
  Tangerang: 1.3,
  Surabaya: 1.2,
  Bekasi: 1.2,
  Bandung: 1.15,
  Medan: 1.1,
  Makassar: 1.1,
  Yogyakarta: 1.05,
  Semarang: 1.0,
  Denpasar: 1.0,
  Palembang: 0.95,
  Pontianak: 0.95,
  Other: 0.9,
}

const categories = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Creative",
  "Manufacturing",
  "Retail",
]

export default function SalaryCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [experience, setExperience] = useState("mid")
  const [location, setLocation] = useState("Jakarta")
  const [category, setCategory] = useState("Technology")
  const [skills, setSkills] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [salary, setSalary] = useState(0)

  const calculateSalary = () => {
    let baseSalary = 70000000 // Starting average in IDR

    // Experience-based multiplier
    if (experience === "entry") baseSalary *= 0.8
    if (experience === "mid") baseSalary *= 1
    if (experience === "senior") baseSalary *= 1.5
    if (experience === "executive") baseSalary *= 2.2

    // Location-based adjustment (based on selected city)
    const locationMultiplier = locationAdjustments[location] || 1
    baseSalary *= locationMultiplier

    // Category/Industry adjustment
    if (category === "Non-profit") baseSalary *= 0.85
    if (category === "Education") baseSalary *= 0.9
    if (category === "Healthcare") baseSalary *= 1.1
    if (category === "Finance") baseSalary *= 1.3
    if (category === "Technology") baseSalary *= 1.25
    if (category === "Creative") baseSalary *= 1.1
    if (category === "Manufacturing") baseSalary *= 1.05
    if (category === "Retail") baseSalary *= 1

    // Skills bonus
    const skillsList = skills.split(",").filter((s) => s.trim().length > 0)
    baseSalary += skillsList.length * 1500000

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
                      <Label htmlFor="location">Location</Label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(locationAdjustments).map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Industry / Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Key Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., JavaScript, React, Data Analysis"
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
                      <h3 className="text-lg font-medium text-primary mb-2">Perkiraan Gaji Tahunan</h3>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center"
                      >
                        <DollarSign className="h-8 w-8 text-secondary" />
                        <span className="text-4xl font-bold text-secondary">
                          Rp {salary.toLocaleString("id-ID")}
                        </span>
                        <span className="text-lg text-gray-500 ml-1">/tahun</span>
                      </motion.div>
                      <p className="text-sm text-gray-600 mt-2">
                        Berdasarkan pengalaman, lokasi, industri, dan keterampilan
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
