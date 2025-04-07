"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
            animate={isLoaded ? { rotate: 0, opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="relative w-10 h-10 md:w-12 md:h-12"
          >
            <Image src="/images/logo.svg" alt="Jolt Jordan Logo" fill className="object-contain" priority />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={isLoaded ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Jolt Jordan
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

