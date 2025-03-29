"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, FileText, Check, AlertCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function CVCheckForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsUploading(false)
      setIsAnalyzing(true)

      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock feedback
      setFeedback(`
        ## CV Analysis Results
        
        ### Strengths:
        - Strong technical skills section
        - Clear work experience descriptions
        - Good education background
        
        ### Areas for Improvement:
        - Add more quantifiable achievements
        - Include a professional summary at the top
        - Consider adding relevant certifications
        
        ### Recommendations:
        1. Highlight your key achievements with metrics
        2. Tailor your CV for each job application
        3. Use action verbs to start bullet points
        4. Keep your CV concise (1-2 pages)
      `)

      setIsAnalyzing(false)
    } catch (err) {
      setError("An error occurred while analyzing your CV. Please try again.")
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  return (
    <div>
      <Card className="border-primary/20 mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" id="cv-upload" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <label htmlFor="cv-upload" className="flex flex-col items-center justify-center cursor-pointer">
                <FileUp className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-lg font-medium text-gray-700 mb-1">{file ? file.name : "Upload your CV"}</p>
                <p className="text-sm text-gray-500">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF file up to 5MB"}
                </p>
              </label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!file || isUploading || isAnalyzing}
            >
              {isUploading ? (
                "Uploading..."
              ) : isAnalyzing ? (
                "Analyzing..."
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Check CV
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {feedback && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">CV Analysis Complete</h2>
                <div className="prose prose-sm max-w-none">
                  {feedback.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Link href="/profile/cv/optimize">
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Optimize Your CV
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


