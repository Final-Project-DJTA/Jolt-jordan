"use client"

import { motion } from "framer-motion"

export function LogoLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-24 h-24 mx-auto mb-4"
        >
          <img src="/jojo-logo.svg" alt="Jojo Jobs Loading" className="w-full h-full object-contain" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary text-white px-4 py-2 rounded-full font-medium"
        >
          Loading Jojo Jobs...
        </motion.div>
      </div>
    </div>
  )
}

