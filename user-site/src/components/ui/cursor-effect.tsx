"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isVisible])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    },
  }

  return (
    <>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-secondary pointer-events-none z-50 hidden md:block"
          variants={variants}
          animate="default"
          transition={{ type: "spring", damping: 30, stiffness: 500, mass: 0.5 }}
        />
      )}
    </>
  )
}

