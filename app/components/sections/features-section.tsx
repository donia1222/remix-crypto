"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { TrendingUp, Shield, Users, RefreshCw } from "lucide-react"

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  const controls = useAnimation()

  // Datos de características - TODOS VERDES
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Automatisierter Handel",
      description: "Richten Sie automatisierte Handelsstrategien mit unseren fortschrittlichen Tools ein.",
      color: "from-green-600 to-green-500",
      bgGlow: "radial-gradient(circle at center, rgba(34, 197, 94, 0.15), transparent 70%)",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Integrierte Versicherungen",
      description: "Ihre Vermögenswerte sind durch unser Versicherungsprogramm gegen Vorfälle geschützt.",
      color: "from-green-600 to-green-500",
      bgGlow: "radial-gradient(circle at center, rgba(34, 197, 94, 0.15), transparent 70%)",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Aktive Gemeinschaft",
      description: "Treten Sie einer globalen Gemeinschaft von Tradern bei, um Strategien und Wissen auszutauschen.",
      color: "from-green-600 to-green-500",
      bgGlow: "radial-gradient(circle at center, rgba(34, 197, 94, 0.15), transparent 70%)",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Ständige Updates",
      description: "Wir verbessern unsere Plattform kontinuierlich mit neuen Funktionen und Tools.",
      color: "from-green-600 to-green-500",
      bgGlow: "radial-gradient(circle at center, rgba(34, 197, 94, 0.15), transparent 70%)",
    },
  ]

  // Seguimiento de la posición del mouse para efectos de iluminación
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animación automática para seleccionar características en intervalos
  useEffect(() => {
    if (isInView) {
      controls.start("visible")

      // Auto-selección de características cada 3 segundos
      const interval = setInterval(() => {
        setSelectedFeature((prev) => {
          if (prev === null || prev >= features.length - 1) {
            return 0
          }
          return prev + 1
        })
      }, 3000)

      return () => clearInterval(interval)
    } else {
      controls.start("hidden")
      setSelectedFeature(null)
    }
  }, [isInView, controls, features.length])

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1,
      },
    },
  }

  return (
    <section
      id="funktionen"
      ref={sectionRef}
      className="w-full py-16 md:py-28  bg-gradient-to-b from-gray-950 to-gray-950 relative overflow-hidden"
    >
      {/* Efecto de luz que sigue al cursor - VERDE */}
      <motion.div
        className="absolute opacity-30 pointer-events-none"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle at center, rgba(26, 183, 84, 0.44), transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Partículas de fondo mejoradas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(
                Math.random() * 100 + 155,
              )}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.3 + 0.1})`,
            }}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              x: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              opacity: [0.1, 0.3, 0.1, 0.4, 0.1],
              scale: [1, 1.5, 1, 2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Líneas de cuadrícula */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-col items-center justify-center space-y-6 text-center mb-12"
        >
          <div className="space-y-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block rounded-full bg-gradient-to-r from-green-600 to-green-500 p-px"
            >
              <div className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-green-400">
                Premium Funktionen
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold tracking-tighter sm:text4xl md:text-4xl text-gray-400  p-4">
              Alles, was Sie für den Handel benötigen
            </h2>
            <motion.p
              className="max-w-[800px] mx-auto text-gray-300 md:text-base/relaxed lg:text-base/relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Unsere Plattform bietet fortschrittliche Tools und eine intuitive Benutzeroberfläche für Trader aller
              Erfahrungsstufen.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => {
                setHoveredFeature(index)
                setSelectedFeature(index)
              }}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative"
            >
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)",
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
                animate={{
                  y: selectedFeature === index ? -5 : 0,
                  scale: selectedFeature === index ? 1.02 : 1,
                  boxShadow:
                    selectedFeature === index
                      ? "inset 0 1px 0 rgba(255, 255, 255, 0.26), 0 20px 40px -8px rgba(0, 0, 0, 0.4)"
                      : "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 15px 35px -5px rgba(0, 0, 0, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-full flex-col items-center space-y-4 rounded-2xl border border-gray-700/80 p-6 bg-gray-900/70 backdrop-blur-xl transition-all duration-300 relative overflow-hidden shadow-lg"
                style={{
                  background:
                    selectedFeature === index || hoveredFeature === index
                      ? "linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.9))"
                      : "linear-gradient(145deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.8))",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px -8px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Fondo de resplandor */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: feature.bgGlow,
                    transform: "translate(-50%, -50%)",
                    left: "50%",
                    top: "50%",
                    width: "200%",
                    height: "200%",
                  }}
                />

                {/* Gradiente de fondo que se anima al hacer hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  animate={{
                    scale: hoveredFeature === index ? [1, 1.2, 1] : 1,
                    opacity: hoveredFeature === index || selectedFeature === index ? [0.05, 0.15, 0.05] : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: hoveredFeature === index || selectedFeature === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                />

                {/* Borde brillante */}
                <AnimatePresence>
                  {(hoveredFeature === index || selectedFeature === index) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(145deg, transparent, transparent, transparent, rgba(34, 197, 94, 0.2))`,
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "exclude",
                        padding: "1px",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Icono con gradiente y animación 3D */}
                <motion.div
                  className={`relative rounded-xl bg-gradient-to-br ${feature.color} p-3.5 text-white shadow-lg`}
                  whileHover={{
                    rotateY: [0, 10, -10, 0],
                    rotateX: [0, -10, 10, 0],
                    scale: 1.1,
                  }}
                  animate={{
                    rotateY: selectedFeature === index ? [0, 5, -5, 0] : 0,
                    rotateX: selectedFeature === index ? [0, -5, 5, 0] : 0,
                    scale: selectedFeature === index ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: selectedFeature === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "loop",
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {feature.icon}

                  {/* Efecto de brillo en el icono */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                    animate={{
                      background: [
                        "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 70%)",
                        "radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.4), transparent 70%)",
                        "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 70%)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>

                {/* Título con animación */}
                <motion.h3
                  className="text-lg font-bold text-white text-center"
                  animate={{
                    color:
                      hoveredFeature === index || selectedFeature === index
                        ? ["gray", "#a7f3d0", "gray"]
                        : "gray",
                  }}
                  transition={{
                    duration: 3,
                    repeat: hoveredFeature === index || selectedFeature === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {feature.title}
                </motion.h3>

                {/* Descripción con animación de aparición */}
                <motion.p
                  className="text-gray-200 text-center text-sm flex-grow"
                  initial={{ opacity: 0.7 }}
                  animate={{
                    opacity: hoveredFeature === index || selectedFeature === index ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.description}
                </motion.p>

                {/* Línea decorativa que aparece al hacer hover */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color}`}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{
                    scaleX: hoveredFeature === index || selectedFeature === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
