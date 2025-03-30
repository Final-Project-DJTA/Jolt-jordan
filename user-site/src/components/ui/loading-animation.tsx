"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="relative w-20 h-20 mb-4"
        >
          <Image src="/images/logo.svg" alt="Jolt Jordan Logo" fill className="object-contain" />
        </motion.div>
        <motion.div
          animate={{
            width: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full w-40"
        />
      </div>
    </div>
  )
}

