"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, MessageSquare, RefreshCw, CheckCircle } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function ContactSection() {
  // State for contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Estado para el captcha
  const [captchaValue, setCaptchaValue] = useState("")
  const [userCaptchaInput, setUserCaptchaInput] = useState("")
  const [captchaError, setCaptchaError] = useState(false)
  const [captchaCanvas, setCaptchaCanvas] = useState<HTMLCanvasElement | null>(null)

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar el captcha
    if (userCaptchaInput.toUpperCase() !== captchaValue) {
      setCaptchaError(true)
      generateCaptcha()
      setUserCaptchaInput("")
      return
    }

    console.log("Form submitted:", contactForm)
    setFormSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false)
      setContactForm({
        name: "",
        email: "",
        message: "",
      })
      setUserCaptchaInput("")
      setCaptchaError(false)
      generateCaptcha()
    }, 3000)
  }

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Generar un nuevo captcha
  const generateCaptcha = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 150
    canvas.height = 50
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Generar un valor aleatorio de 5 caracteres
      const captchaText = Math.random().toString(36).substring(2, 7).toUpperCase()
      setCaptchaValue(captchaText)

      // Fondo con gradiente
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#1f2937")
      gradient.addColorStop(1, "#374151")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar líneas aleatorias con mejor estilo
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + Math.random() * 0.3})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.stroke()
      }

      // Dibujar puntos aleatorios
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(34, 197, 94, ${0.2 + Math.random() * 0.3})`
        ctx.beginPath()
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2)
        ctx.fill()
      }

      // Dibujar el texto con mejor estilo
      ctx.font = "bold 20px 'Courier New', monospace"
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 1
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Añadir sombra al texto
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      ctx.fillText(captchaText, canvas.width / 2, canvas.height / 2)
      ctx.strokeText(captchaText, canvas.width / 2, canvas.height / 2)

      setCaptchaCanvas(canvas)
    }
  }

  // Manejar cambios en el input del captcha
  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCaptchaInput(e.target.value)
    setCaptchaError(false)
  }

  // Generar captcha al cargar el componente
  React.useEffect(() => {
    generateCaptcha()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      id="kontakt"
      className="relative w-full py-16 md:py-24 overflow-hidden"
    >

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start"
        >
          {/* Left Column - Contact Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 px-4 py-2 text-sm font-medium text-green-400"
              >
                <MessageSquare className="h-4 w-4" />
                Kontakt
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
              >

              </motion.h2>

              <motion.p variants={itemVariants} className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-400">
                Hast du Fragen? 
              </motion.p>
            </div>
       <motion.p variants={itemVariants} className="text-lg text-gray-300 leading-relaxed max-w-md">
                schreibe uns...
              </motion.p>
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.a
                href="mailto:info@nextrade.ch"
                whileHover={{ x: 8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-green-500/30 backdrop-blur-sm cursor-pointer transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">E-Mail</p>
                  <p className="text-white group-hover:text-green-400 transition-colors duration-300 font-medium">
                    info@nextrade.ch
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Send className="h-4 w-4 text-green-400" />
                </div>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
              {formSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-3"
                  >
                    Nachricht gesendet!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-lg"
                  >
                    Wir werden uns so schnell wie möglich bei Ihnen melden.
                  </motion.p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Dein Name"
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="deine@email.ch"
                      />
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                      Nachricht
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm resize-none"
                      placeholder="Wie können wir dir helfen?"
                    />
                  </motion.div>

                  <div className="space-y-3">
                    <label htmlFor="captcha" className="block text-sm font-semibold text-gray-300">
                      Captcha - Gib die unten angezeigten Zeichen ein
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {captchaCanvas && (
                        <motion.div whileHover={{ scale: 1.05 }} className="relative group">
                          <img
                            src={captchaCanvas.toDataURL() || "/placeholder.svg"}
                            alt="CAPTCHA"
                            className="h-12 border border-gray-600/50 rounded-lg shadow-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={generateCaptcha}
                            className="absolute -top-2 -right-2 h-8 w-8 bg-gray-800/80 border border-gray-600/50 text-gray-400 hover:text-green-400 hover:bg-gray-700/80 rounded-full backdrop-blur-sm transition-all duration-300"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span className="sr-only">Captcha neu generieren</span>
                          </Button>
                        </motion.div>
                      )}
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        type="text"
                        id="captcha"
                        name="captcha"
                        value={userCaptchaInput}
                        onChange={handleCaptchaChange}
                        required
                        className={`flex-1 px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                          captchaError
                            ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                            : "border-gray-600/50 focus:ring-green-500/50 focus:border-green-500/50"
                        }`}
                        placeholder="Code eingeben"
                      />
                    </div>
                    {captchaError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm flex items-center gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        </span>
                        Der CAPTCHA-Code ist falsch. Bitte versuchen Sie es erneut.
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-500/20"
                    >
                      <span>Nachricht senden</span>
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
