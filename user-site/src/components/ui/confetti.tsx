"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  isActive: boolean
  x: number
  y: number
  onComplete: () => void
}

export default function Confetti({ isActive, x, y, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  useEffect(() => {
    if (isActive) {
      const colors = ["#1E3A5F", "#D4AF37", "#FF5733", "#33FF57", "#3357FF"]
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        onComplete()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isActive, x, y, onComplete])

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: particle.x + (Math.random() - 0.5) * 200,
            y: particle.y + Math.random() * 200,
            opacity: 0,
            scale: 1,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  )
}

