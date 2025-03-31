"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronRight, Lightbulb } from "lucide-react"
import Link from "next/link"

const questions = [
  {
    id: 1,
    question: "What type of work environment do you prefer?",
    options: [
      { id: "a", text: "Remote work", category: "remote" },
      { id: "b", text: "Office environment", category: "office" },
      { id: "c", text: "Hybrid model", category: "hybrid" },
      { id: "d", text: "Flexible schedule", category: "flexible" },
    ],
  },
  {
    id: 2,
    question: "Which industry interests you the most?",
    options: [
      { id: "a", text: "Technology", category: "tech" },
      { id: "b", text: "Healthcare", category: "healthcare" },
      { id: "c", text: "Finance", category: "finance" },
      { id: "d", text: "Creative arts", category: "creative" },
    ],
  },
  {
    id: 3,
    question: "What's your preferred company size?",
    options: [
      { id: "a", text: "Startup (1-50 employees)", category: "startup" },
      { id: "b", text: "Small company (51-200 employees)", category: "small" },
      { id: "c", text: "Medium company (201-1000 employees)", category: "medium" },
      { id: "d", text: "Large corporation (1000+ employees)", category: "large" },
    ],
  },
]

export default function JobQuiz() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (category: string) => {
    const newAnswers = [...answers, category]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
  }

  const getJobRecommendation = () => {
    // This is a simplified recommendation logic
    // In a real app, you would have more sophisticated matching
    if (answers.includes("remote") && answers.includes("tech")) {
      return "Software Developer"
    } else if (answers.includes("office") && answers.includes("finance")) {
      return "Financial Analyst"
    } else if (answers.includes("healthcare")) {
      return "Healthcare Administrator"
    } else if (answers.includes("creative")) {
      return "UX/UI Designer"
    } else {
      return "Project Manager"
    }
  }

  return (
    <div className="my-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="mx-auto flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Lightbulb className="h-4 w-4" />
          {isOpen ? "Close Job Matcher" : "Find Your Perfect Job Match"}
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
                <CardTitle>Job Matcher Quiz</CardTitle>
                <CardDescription>Answer a few questions to find your ideal job match</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!showResult ? (
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-secondary h-2 rounded-full"
                        initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <h3 className="text-xl font-medium text-primary">{questions[currentQuestion].question}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questions[currentQuestion].options.map((option) => (
                        <motion.div key={option.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-secondary/10 hover:text-primary"
                            onClick={() => handleAnswer(option.category)}
                          >
                            <span className="mr-2">{option.id.toUpperCase()}.</span> {option.text}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Your Ideal Job Match</h3>
                    <p className="text-gray-600 mb-6">Based on your answers, we think you'd be a great:</p>

                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl font-bold text-secondary mb-8"
                    >
                      {getJobRecommendation()}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/jobs">
                        <Button className="bg-primary hover:bg-primary/90">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Browse Related Jobs
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={resetQuiz}>
                        Take Quiz Again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

