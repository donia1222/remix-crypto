"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Shield, Lock, Database, LinkIcon, Check, ArrowRight } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function BlockchainVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeBlock, setActiveBlock] = useState<number | null>(null)
  const [autoAnimate, setAutoAnimate] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  // Datos de los bloques
  const blocks = [
    {
      id: 1,
      title: "Genesis Block",
      hash: "0x8f7d8b3c...",
      data: "First Transaction",
      icon: <Database className="h-6 w-6" />,
      color: "from-purple-600 to-blue-600",
    },
    {
      id: 2,
      title: "Block #2",
      hash: "0x3a9c7d2e...",
      data: "Transfer: 5 BTC",
      icon: <LinkIcon className="h-6 w-6" />,
      color: "from-blue-600 to-cyan-600",
    },
    {
      id: 3,
      title: "Block #3",
      hash: "0x6b2f1e8d...",
      data: "Smart Contract",
      icon: <Shield className="h-6 w-6" />,
      color: "from-cyan-600 to-teal-600",
    },
    {
      id: 4,
      title: "Block #4",
      hash: "0x9d4e2f1c...",
      data: "NFT Minting",
      icon: <Lock className="h-6 w-6" />,
      color: "from-teal-600 to-green-600",
    },
    {
      id: 5,
      title: "New Block",
      hash: "0x5e8f3a2b...",
      data: "Pending...",
      icon: <Check className="h-6 w-6" />,
      color: "from-green-600 to-emerald-600",
    },
  ]

  // Auto-animación
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoAnimate) {
      interval = setInterval(() => {
        setActiveBlock((prev) => {
          if (prev === null) return 0
          return (prev + 1) % blocks.length
        })
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoAnimate, blocks.length])

  // Mostrar información después de un tiempo
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowInfo(true)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  // Función para mostrar la información del bloque seleccionado
  const renderBlockInfo = () => {
    if (activeBlock === null) return null

    const block = blocks[activeBlock]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-20 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-xl max-w-md mx-auto"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${block.color} flex items-center justify-center`}>
            <div className="text-white">{block.icon}</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{block.title}</h3>
            <p className="text-sm text-gray-400">{block.hash}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded p-3 text-sm text-gray-300 font-mono mb-4">{block.data}</div>

        <div className="text-sm text-gray-400">
          {activeBlock > 0 ? (
            <div className="flex items-center">
              <span>Previous Hash:</span>
              <span className="ml-1 text-cyan-400">{blocks[activeBlock - 1].hash.substring(0, 8)}...</span>
            </div>
          ) : (
            <div className="text-purple-400">Genesis Block - No Previous Hash</div>
          )}
        </div>

        {activeBlock < blocks.length - 1 && (
          <div className="flex items-center mt-2 text-sm text-gray-400">
            <span>Next Block:</span>
            <span className="ml-1 text-green-400">{blocks[activeBlock + 1].title}</span>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <section
      ref={containerRef}
      id="blockchain"
      className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden bg-gray-950"
    >
      {/* Fondo con efecto de cuadrícula */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Contenido principal */}
      <motion.div className="container px-4 md:px-6 mx-auto relative z-10" style={{ opacity, y }}>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 p-4"
          >
            Blockchain Technologie
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-300 text-lg"
          >
            Entdecken Sie, wie die Blockchain-Technologie Transaktionen sicher, transparent und unveränderlich macht.
          </motion.p>
        </div>

        {/* Visualización de la blockchain */}
        <div className="relative">
          {/* Línea conectora */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 transform -translate-y-1/2 origin-left"
          />

          {/* Bloques */}
          <div className="flex justify-between items-center relative py-20">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    y: activeBlock === index ? [-5, 5, -5] : 0,
                    boxShadow: activeBlock === index ? "0 0 20px rgba(124, 58, 237, 0.5)" : "0 0 0px rgba(0, 0, 0, 0)",
                    scale: activeBlock === index ? 1.1 : 1,
                  }}
                  transition={{
                    y: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      ease: "easeInOut",
                    },
                    boxShadow: {
                      duration: 0.2,
                    },
                    scale: {
                      duration: 0.3,
                    },
                  }}
                  onClick={() => {
                    setActiveBlock(index)
                    setAutoAnimate(false)
                  }}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${block.color} flex items-center justify-center cursor-pointer shadow-lg transform transition-all duration-300`}
                >
                  <motion.div
                    animate={{ rotate: activeBlock === index ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    {block.icon}
                  </motion.div>
                </motion.div>

                {/* Número de bloque */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-400">
                  #{block.id}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Información del bloque seleccionado */}
        <AnimatePresence mode="wait">{activeBlock !== null && renderBlockInfo()}</AnimatePresence>

        {/* Información sobre la blockchain */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-20 grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  title: "Dezentralisiert",
                  description:
                    "Keine zentrale Kontrolle. Die Blockchain wird von einem Netzwerk von Computern auf der ganzen Welt verwaltet.",
                  icon: <Database className="h-10 w-10 text-purple-500" />,
                  delay: 0,
                },
                {
                  title: "Unveränderlich",
                  description:
                    "Einmal in der Blockchain gespeichert, können Daten nicht mehr geändert oder gelöscht werden.",
                  icon: <Lock className="h-10 w-10 text-cyan-500" />,
                  delay: 0.1,
                },
                {
                  title: "Transparent",
                  description:
                    "Alle Transaktionen sind öffentlich und können von jedem eingesehen werden, was Vertrauen schafft.",
                  icon: <Shield className="h-10 w-10 text-teal-500" />,
                  delay: 0.2,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + item.delay }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}

      </motion.div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-500/30"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              x: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              opacity: [0.2, 0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* CSS para el patrón de cuadrícula */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(124, 58, 237, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  )
}
