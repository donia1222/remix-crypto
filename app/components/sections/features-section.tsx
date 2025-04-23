"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Lock, Zap, Globe, TrendingUp, Shield, Users, RefreshCw } from "lucide-react"

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  // Datos de características
  const features = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Fortschrittliche Analyse",
      description: "Technische Analysetools und Echtzeit-Charts für fundierte Entscheidungen.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Maximale Sicherheit",
      description: "Hochmoderner Schutz für Ihre digitalen Vermögenswerte mit Zwei-Faktor-Authentifizierung.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Schnelle Transaktionen",
      description: "Führen Sie Transaktionen in Sekundenschnelle mit unserer Hochgeschwindigkeitsinfrastruktur durch.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Globaler Zugang",
      description: "Handeln Sie von überall auf der Welt mit unserer mehrsprachigen Plattform.",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Automatisierter Handel",
      description: "Richten Sie automatisierte Handelsstrategien mit unseren fortschrittlichen Tools ein.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Integrierte Versicherungen",
      description: "Ihre Vermögenswerte sind durch unser Versicherungsprogramm gegen Vorfälle geschützt.",
      color: "from-emerald-500 to-cyan-500",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Aktive Gemeinschaft",
      description: "Treten Sie einer globalen Gemeinschaft von Tradern bei, um Strategien und Wissen auszutauschen.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      title: "Ständige Updates",
      description: "Wir verbessern unsere Plattform kontinuierlich mit neuen Funktionen und Tools.",
      color: "from-blue-500 to-purple-500",
    },
  ]

  // Variantes para animaciones de contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Variantes para animaciones de elementos
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section id="funktionen" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-500/20"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Funktionen</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
              Alles, was Sie für den Handel benötigen
            </h2>
            <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Unsere Plattform bietet fortschrittliche Tools und eine intuitive Benutzeroberfläche für Trader aller
              Erfahrungsstufen.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 py-12 md:grid-cols-3 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative"
            >
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex h-full flex-col items-center space-y-2 rounded-xl border border-gray-800 p-4 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradiente de fondo que se anima al hacer hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  animate={{
                    scale: hoveredFeature === index ? [1, 1.2, 1] : 1,
                    opacity: hoveredFeature === index ? [0.05, 0.15, 0.05] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: hoveredFeature === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                />

                {/* Icono con gradiente */}
                <motion.div
                  className={`rounded-full bg-gradient-to-br ${feature.color} p-2.5 text-white shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Título con animación */}
                <motion.h3
                  className="text-base font-bold text-white text-center"
                  animate={{
                    color: hoveredFeature === index ? ["#ffffff", "#a5f3fc", "#ffffff"] : "#ffffff",
                  }}
                  transition={{
                    duration: 2,
                    repeat: hoveredFeature === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  {feature.title}
                </motion.h3>

                {/* Descripción */}
                <p className="text-gray-400 text-center text-xs flex-grow">{feature.description}</p>

                {/* Línea decorativa que aparece al hacer hover */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color}`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
