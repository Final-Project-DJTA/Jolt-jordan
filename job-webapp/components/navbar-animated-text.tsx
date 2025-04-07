"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ParticleBackground from "@/components/ui/particle-background"

export default function Navbar() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [sparkPosition, setSparkPosition] = useState(0)

  useEffect(() => {
    setIsLoaded(true)

    // Animate the spark across the text
    if (isLoaded) {
      const interval = setInterval(() => {
        setSparkPosition((prev) => (prev < 100 ? prev + 10 : 0))
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isLoaded])

  return (
    <header className="bg-primary text-primary-foreground relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto flex items-center justify-between py-4 relative z-10">
        <Link href="/" className="group relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            className="text-2xl font-bold relative overflow-hidden"
          >
            <span className="relative z-10">Jolt Jordan</span>

            {/* Animated spark effect */}
            <motion.div
              className="absolute top-0 h-full w-[20px] bg-gradient-to-r from-transparent via-secondary to-transparent"
              style={{
                left: `${sparkPosition}%`,
                filter: "blur(8px)",
                opacity: 0.8,
              }}
            />

            {/* Underline effect on hover */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-secondary origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="hover:text-secondary transition-colors">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/bookmarks" className="hover:text-secondary transition-colors">
                Bookmarks
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-secondary transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/login">
                <Button variant="outline" className="bg-secondary text-primary-foreground hover:bg-secondary/90">
                  Login
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

