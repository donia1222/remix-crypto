"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loader for 2 seconds then fade out
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-950 z-[100]"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 1],
            opacity: 1,
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.5, 0.8, 1],
          }}
          className="relative"
        >
          <motion.img src="/A5.png" alt="Krypto Logo" className="h-24 w-auto" />
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-purple-600 to-cyan-600 mt-4 rounded-full"
        />
      </div>
    </motion.div>
  )
}
