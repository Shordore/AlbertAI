"use client"

import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export function RoboAnimation() {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute bottom-[-8rem] left-[-4rem] w-full h-full"
        animate={{
          y: [60, 0, 60],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-4 bg-[#1E40AF]/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <Bot className="w-32 h-32 text-[#1E40AF] relative z-10 transform -translate-x-16" />
        </div>
      </motion.div>
    </div>
  )
}

