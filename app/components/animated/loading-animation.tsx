"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLogo, setShowLogo] = useState(true)

  useEffect(() => {
    // First timer: End the loading state after 2 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Second timer: Keep the logo visible for a shorter time after loading completes
    const logoTimer = setTimeout(() => {
      setShowLogo(false)
    }, 3200) // 3.2 seconds total (2s loading + 1.2s extra)

    return () => {
      clearTimeout(loadingTimer)
      clearTimeout(logoTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {showLogo && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: 1, // Always fully opaque during display
            backgroundColor: "rgb(0 0 0)", // Pure black background
          }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="fixed inset-0 flex items-center justify-center z-[100] bg-black" // Added bg-black class for immediate black background
        >
          <div className="flex flex-col items-center z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.2, 1],
                opacity: 1,
                rotate: [0, 10, -10, 0],
              }}
              exit={{
                scale: 1.2,
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.5, 0.8, 1],
              }}
              className="relative"
            >
              <motion.img src="/A5.png" alt="Krypto Logo" className="h-16 w-auto sm:h-20 md:h-24" />

              {/* 3D effect glow behind logo */}
              <motion.div
                className="absolute inset-0 blur-lg bg-cyan-500/30 rounded-full -z-10 sm:blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                exit={{
                  scale: 2,
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  repeat: isLoading ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              />
            </motion.div>

            {isLoading ? (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-1 bg-gradient-to-r from-green-600 to-green-600 mt-3 rounded-full sm:mt-4 sm:w-[100px] md:w-[120px]"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-green-500 text-sm mt-3 font-light tracking-wider"
              >
                KRYPTO
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
