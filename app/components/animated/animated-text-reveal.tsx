"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"

export default function AnimatedTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Valores para el seguimiento del ratón
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Aplicar spring para suavizar el movimiento
  const springConfig = { damping: 25, stiffness: 100 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Valores para el efecto de scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Transformar el progreso del scroll en valores para animaciones
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])

  // Palabras que flotarán en el fondo con propiedades de animación
  const floatingWords = [
    {
      text: "BITCOIN",
      x: -25,
      y: -20,
      size: "text-6xl",
      color: "text-purple-500/10",
      floatDuration: 8,
      floatDelay: 0,
      floatDistance: 15,
    },
    {
      text: "ETHEREUM",
      x: 25,
      y: 20,
      size: "text-5xl",
      color: "text-cyan-500/10",
      floatDuration: 10,
      floatDelay: 1,
      floatDistance: 20,
    },
    {
      text: "BLOCKCHAIN",
      x: -15,
      y: 15,
      size: "text-7xl",
      color: "text-blue-500/10",
      floatDuration: 12,
      floatDelay: 2,
      floatDistance: 18,
    },
    {
      text: "NFT",
      x: 20,
      y: -25,
      size: "text-8xl",
      color: "text-pink-500/10",
      floatDuration: 9,
      floatDelay: 3,
      floatDistance: 25,
    },
    {
      text: "DEFI",
      x: -30,
      y: 0,
      size: "text-7xl",
      color: "text-green-500/10",
      floatDuration: 11,
      floatDelay: 4,
      floatDistance: 22,
    },
    {
      text: "CRYPTO",
      x: 0,
      y: -30,
      size: "text-9xl",
      color: "text-yellow-500/10",
      floatDuration: 14,
      floatDelay: 0.5,
      floatDistance: 30,
    },
    {
      text: "MINING",
      x: 15,
      y: 30,
      size: "text-6xl",
      color: "text-red-500/10",
      floatDuration: 9.5,
      floatDelay: 2.5,
      floatDistance: 17,
    },
    {
      text: "WALLET",
      x: -20,
      y: -10,
      size: "text-5xl",
      color: "text-indigo-500/10",
      floatDuration: 11,
      floatDelay: 1.5,
      floatDistance: 20,
    },
    {
      text: "TOKEN",
      x: 30,
      y: 10,
      size: "text-7xl",
      color: "text-orange-500/10",
      floatDuration: 10,
      floatDelay: 3.5,
      floatDistance: 24,
    },
  ]

  // Efecto para rastrear la posición del ratón
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Normalizar la posición del ratón entre -1 y 1
      const normalizedX = (clientX / innerWidth) * 2 - 1
      const normalizedY = (clientY / innerHeight) * 2 - 1

      setMousePosition({ x: normalizedX, y: normalizedY })
      mouseX.set(normalizedX)
      mouseY.set(normalizedY)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY])

  // Letras para el efecto de revelación
  const letters = "INNOVATION".split("")

  return (
    <section ref={containerRef} className="relative w-full py-32 md:py-40 lg:py-56 overflow-hidden bg-gray-950">
      {/* Palabras flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingWords.map((word, index) => (
          <motion.div
            key={index}
            className={`absolute whitespace-nowrap font-bold ${word.size} ${word.color} opacity-70`}
            style={{
              left: `${50 + word.x}%`,
              top: `${50 + word.y}%`,
              x: "-50%",
              y: "-50%",
              rotateX: useTransform(smoothMouseY, [-1, 1], [-5, 5]),
              rotateY: useTransform(smoothMouseX, [-1, 1], [5, -5]),
              z: useTransform(scrollYProgress, [0, 1], [0, word.x * 10]),
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.7,
              y: [`-${word.floatDistance}px`, `${word.floatDistance}px`, `-${word.floatDistance}px`],
              x: [`-${word.floatDistance * 0.5}px`, `${word.floatDistance * 0.7}px`, `-${word.floatDistance * 0.5}px`],
              rotate: [-2, 2, -2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              opacity: { duration: 1, delay: index * 0.1 },
              y: {
                duration: word.floatDuration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: word.floatDelay,
              },
              x: {
                duration: word.floatDuration * 1.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: word.floatDelay,
              },
              rotate: {
                duration: word.floatDuration * 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: word.floatDelay + 0.5,
              },
              scale: {
                duration: word.floatDuration * 1.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: word.floatDelay + 1,
              },
            }}
          >
            {word.text}
          </motion.div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          style={{
            opacity,
            scale,
            rotateX,
            y,
          }}
        >
          {/* Título con efecto de revelación de letras */}
          <div className="mb-8 relative">
            <div className="flex justify-center overflow-hidden">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Línea decorativa */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full mb-8"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1, delay: 1.5 }}
          />

          {/* Texto descriptivo */}
          <motion.p
            className="max-w-2xl text-gray-300 text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
       Wir verbinden modernste Technologie mit benutzerfreundlichem Design, um dir beste Krypto-Erfahrung zu bieten.
          </motion.p>

          {/* Círculos decorativos que siguen al ratón */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"
            style={{
              x: useTransform(smoothMouseX, [-1, 1], [-100, 100]),
              y: useTransform(smoothMouseY, [-1, 1], [-100, 100]),
            }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl"
            style={{
              x: useTransform(smoothMouseX, [-1, 1], [100, -100]),
              y: useTransform(smoothMouseY, [-1, 1], [100, -100]),
            }}
          />
        </motion.div>
      </div>

      {/* Líneas que cruzan la pantalla con el scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent w-full"
            style={{
              top: `${index * 25}%`,
              x: useTransform(
                scrollYProgress,
                [0, 1],
                [index % 2 === 0 ? "-100%" : "100%", index % 2 === 0 ? "100%" : "-100%"],
              ),
              opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]),
            }}
          />
        ))}
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"
            style={{
              left: `${index * 25}%`,
              y: useTransform(
                scrollYProgress,
                [0, 1],
                [index % 2 === 0 ? "-100%" : "100%", index % 2 === 0 ? "100%" : "-100%"],
              ),
              opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]),
            }}
          />
        ))}
      </div>
    </section>
  )
}
