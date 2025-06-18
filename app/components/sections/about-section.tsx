"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { TrendingUp, Brain, Zap } from "lucide-react"
import { useRef } from "react"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Transform values for parallax effects
  const y = useTransform(smoothProgress, [0, 1], [100, -100])
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 1.1])
  const rotate = useTransform(smoothProgress, [0, 1], [5, -5])

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  }

  const skillVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-950 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        style={{ y, opacity: useTransform(smoothProgress, [0, 1], [0.3, 0]) }}
        className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-cyan-900/10"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div style={{ opacity }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Texto */}
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={textVariants}
            >
              <div className="inline-block rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-1 text-sm text-green-400 border border-gray-700">
                Über uns
              </div>
      
            </motion.div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={1}
                variants={textVariants}
                className="relative"
              >
                <motion.span whileHover={{ scale: 1.02 }} className="inline-block">
                  🚀 Mein Name ist Jathu und ich bin der Gründer von Nextrade Swiss.
Ich möchte das Trading-Erlebnis auf ein neues Level bringen.  Mit meiner Leidenschaft für den Kryptomarkt 💎
                  und einem klaren Ziel vor Augen setze ich auf Transparenz, Effizienz und Innovation.
                </motion.span>
              </motion.p>

              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={2}
                variants={textVariants}
              >
                <motion.span whileHover={{ scale: 1.02 }} className="inline-block">
                  📊 Mit Nextrade stelle ich euch nicht nur meine aktuellen Einschätzungen zur aktuellen Marktlage zur
                  Verfügung, sondern gewähre auch Einblicke in meine laufenden und vergangenen Trades – ganz gleich, ob
                  diese im Plus oder Minus sind. Je nach Mitgliedschaft stehen dir mehr oder weniger Informationen zur
                  Verfügung.
                </motion.span>
              </motion.p>

              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={3}
                variants={textVariants}
              >
       <motion.span
      whileHover={{ scale: 1.02 }}
      className="inline-block font-bold"
    >
      Wichtiger Hinweis: Alle Informationen stellen keine Finanz- oder Anlageberatung
      im rechtlichen Sinne dar. Jede Investitionsentscheidung liegt in der
      Eigenverantwortung der Nutzer.
    </motion.span>
              </motion.p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 justify-center">
              {[
                { icon: TrendingUp, text: "Crypto" },
                { icon: Zap, text: "Trading" },
                { icon: Brain, text: "IT" },
              ].map((skill, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={skillVariants}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(246, 59, 59, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                  className="flex items-center gap-2 text-green-500 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                >
                  <skill.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{skill.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Imagen con efectos avanzados */}
          <motion.div
            style={{ y: useTransform(smoothProgress, [0, 1], [50, -50]) }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative max-w-[280px] w-full">
              {/* Animated background glow */}
              <motion.div
                style={{ rotate, scale }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Orbiting elements */}
              <motion.div
                className="absolute -inset-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-red-400 rounded-full" />
                <div className="absolute top-1/2 left-0 w-1 h-1 bg-purple-400 rounded-full transform -translate-y-1/2" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                <img
                  src="/eeec3693-d0d9-4a22-9bb4-e9ae22047f2c.jpg"
                  alt="Professioneller Trader"
                  className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent h-1/3" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <p className="text-white font-medium text-sm">💡 "Transparenz und Ehrlichkeit im Trading 📈"</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
