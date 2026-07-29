"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ParticleBackground from "@/components/ui/particle-background"

export default function Navbar() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <header className="bg-primary text-primary-foreground relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto flex items-center justify-between py-4 relative z-10">
        <Link href="/" className="group">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold relative"
          >
            <span className="text-white">Jolt</span>
            <span className="text-secondary"> Jordan</span>
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-secondary"
              initial={{ width: 0 }}
              animate={isLoaded ? { width: "100%" } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.span>
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

