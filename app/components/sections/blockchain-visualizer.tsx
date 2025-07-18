"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Shield, BadgeDollarSign, Database, LinkIcon, Check, PartyPopper } from 'lucide-react'

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
      icon: <BadgeDollarSign className="h-6 w-6" />,
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
        className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-xl max-w-md mx-auto"
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
    <section ref={containerRef} id="blockchain" className="">
      {/* Fondo con efecto de cuadrícula */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Contenido principal */}
      <motion.div className="container px-4 md:px-6 mx-auto relative z-10" style={{ opacity, y }}>
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
                  title: "Unabhängig 💪",
                  description:
                    "Vollständige Kontrolle über deine Finanzen und Transaktionen. Du entscheidest selbst über deine Investitionen und kannst deine Plattform dazu frei auswählen.",
                  icon: <PartyPopper className="h-10 w-10 text-green-500" />,
                  delay: 0,
                },
                {
                  title: "Gewinne 🤑",
                  description:
                    "Die wenigsten Menschen werden durch Krypto und Trading zum Millionär und verlieren durch zu hohe Erwartungen ihr Geld. Lerne deine Risiken zu minimieren und sichere lieber auch mal kleinere Gewinne ab.",
                  icon: <BadgeDollarSign className="h-10 w-10 text-green-500" />,
                  delay: 0.1,
                },
                {
                  title: "Vertrauen 😇",
                  description:
                    "Wir schaffen Vertrauen. Unsere Transaktionen sind öffentlich einsehbar. Im Nextrade-Abo hast du zusätzlichen Einblick zu exklusive Informationen.",
                  icon: <Shield className="h-10 w-10 text-green-500" />,
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
                  <h3 className="text-xl font-bold text-gray-400 mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Partículas flotantes - MODIFICADO para evitar problemas con los botones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-500/30 pointer-events-none"
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
              duration: 15 + i * 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </section>
  )
}