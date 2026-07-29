"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JobAlert() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentAlert, setCurrentAlert] = useState(0)

  const alerts = [
    {
      title: "New Senior Developer Position",
      company: "TechCorp",
      time: "Just now",
    },
    {
      title: "UX Designer Role - Remote",
      company: "DesignHub",
      time: "5 minutes ago",
    },
    {
      title: "Product Manager Opening",
      company: "InnovateCo",
      time: "15 minutes ago",
    },
  ]

  useEffect(() => {
    // Show first alert after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    // Cycle through alerts
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length)
    }, 8000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [alerts.length])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between bg-primary p-3">
              <div className="flex items-center text-white">
                <Bell className="h-5 w-5 mr-2" />
                <span className="font-medium">Job Alert</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-primary/80 h-8 w-8 p-0"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-primary">{alerts[currentAlert].title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {alerts[currentAlert].company} • {alerts[currentAlert].time}
              </p>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => setIsVisible(false)}
                >
                  View Job
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

