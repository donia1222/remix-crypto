"use client"

import React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Bitcoin, Coins, DollarSign, Wallet } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden text-white ">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Hero Content */}
      <motion.div className="container px-4 md:px-6 mx-auto relative z-10 h-full flex items-center">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Die Zukunft der Kryptowährungen ist hier
            </h1>
            <p className="text-gray-300 md:text-xl max-w-2xl mx-auto">
              Kaufen, verkaufen und tauschen Sie Kryptowährungen mit Leichtigkeit. Sichere und moderne Plattform für
              alle Ihre digitalen Vermögenswerte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white w-full sm:w-auto"
                  onClick={() => {
                    // Add your registration or sign-up logic here
                    window.location.href = "/registrieren"
                  }}
                >
                  Jetzt starten <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto"
                  onClick={() => {
                    const element = document.getElementById("maerkte")
                    if (element) {
                      const headerHeight = 64
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - headerHeight
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      })
                    }
                  }}
                >
                  Märkte ansehen
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

// Particle Background Component with Crypto Icons
function ParticleBackground() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      speed: number
      icon: number
      opacity: number
      rotation: number
      rotationSpeed: number
    }>
  >([])

  useEffect(() => {
    // Create particles on component mount
    const particleCount = window.innerWidth < 768 ? 15 : 25
    const newParticles = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.2 + 0.1,
        icon: Math.floor(Math.random() * 4),
        opacity: Math.random() * 0.5 + 0.1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
      })
    }

    setParticles(newParticles)

    // Animation loop
    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time

      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // Move particles upward
          let newY = particle.y - particle.speed * (delta / 16)
          // If particle goes off screen, reset to bottom
          if (newY < -10) {
            newY = 110
            particle.x = Math.random() * 100
          }

          return {
            ...particle,
            y: newY,
            rotation: (particle.rotation + particle.rotationSpeed * (delta / 16)) % 360,
          }
        }),
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const iconComponents = [
    <Bitcoin key="bitcoin" />,
    <Coins key="coins" />,
    <DollarSign key="dollar" />,
    <Wallet key="wallet" />,
  ]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-gray-700"
          initial={false}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            width: particle.size,
            height: particle.size,
          }}
        >
          {React.cloneElement(iconComponents[particle.icon], {
            size: particle.size,
            className: "text-gray-700",
          })}
        </motion.div>
      ))}
    </div>
  )
}
