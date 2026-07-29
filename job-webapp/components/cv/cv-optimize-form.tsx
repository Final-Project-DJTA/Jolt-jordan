"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Download, FileText, Sparkles, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CVOptimizeForm() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [currentCV, setCurrentCV] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [optimizedCV, setOptimizedCV] = useState("")

  const handleOptimize = async () => {
    if (!currentCV) {
      return
    }

    setIsOptimizing(true)

    try {
      // Simulate AI optimization
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock optimized CV
      const optimized = currentCV
        .split("\n")
        .map((line) => {
          // Add some "optimizations" to the CV text
          if (line.includes("experience") || line.includes("Experience")) {
            return line + " - Demonstrated exceptional results"
          }
          if (line.includes("skills") || line.includes("Skills")) {
            return line + " - Advanced proficiency"
          }
          if (line.includes("project") || line.includes("Project")) {
            return line + " - Delivered ahead of schedule"
          }
          return line
        })
        .join("\n")

      setOptimizedCV(optimized)
      setIsOptimized(true)
    } catch (error) {
      console.error("Optimization error:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="result" disabled={!isOptimized}>
            Result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Optimize Your CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-cv">Paste Your Current CV</Label>
                <Textarea
                  id="current-cv"
                  placeholder="Paste the content of your current CV here..."
                  className="min-h-[200px]"
                  value={currentCV}
                  onChange={(e) => setCurrentCV(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description (Optional)</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description to tailor your CV for a specific role..."
                  className="min-h-[150px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Adding a job description helps our AI tailor your CV for that specific role
                </p>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800">
                  Our AI will analyze your CV and suggest improvements to make it stand out to employers.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleOptimize}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!currentCV || isOptimizing}
              >
                {isOptimizing ? "Optimizing..." : "Optimize CV"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Optimized CV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-green-200 bg-green-50 rounded-md p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm">{optimizedCV}</pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

