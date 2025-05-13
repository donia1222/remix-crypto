"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, MessageSquare } from "lucide-react"
import { Button } from "~/components/button"

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

      // Fondo
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar líneas aleatorias
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.stroke()
      }

      // Dibujar puntos aleatorios
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
        ctx.beginPath()
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2)
        ctx.fill()
      }

      // Dibujar el texto
      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(captchaText, canvas.width / 2, canvas.height / 2)

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

  return (
    <section id="kontakt" className="w-full py-12 md:py-24 bg-black">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Kontakt</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Wir sind hier, um zu helfen</h2>
            <p className="text-gray-300">
              Unser Support-Team steht Ihnen zur Verfügung, um alle Ihre Fragen zu beantworten und Ihnen bei der Lösung
              von Problemen zu helfen.
            </p>

            <div className="space-y-4 mt-6">
              <motion.a
                href="mailto:info@nextrade.ch"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">E-Mail</p>
                  <p className="text-white hover:text-cyan-400 transition-colors">info@nextrade.ch</p>
                </div>
              </motion.a>

              <motion.a
                href="https://wa.me/41786999950"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <p className="text-white hover:text-cyan-400 transition-colors">+41 78 699 99 50</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            {formSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nachricht gesendet!</h3>
                <p className="text-gray-300">Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="Ihr Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    E-Mail
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="ihre@email.ch"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Nachricht
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="Wie können wir Ihnen helfen?"
                  ></motion.textarea>
                </div>

                <div className="space-y-2">
                  <label htmlFor="captcha" className="block text-sm font-medium text-gray-300 mb-1">
                    Captcha - Geben Sie die unten angezeigten Zeichen ein
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {captchaCanvas && (
                      <div className="relative">
                        <img
                          src={captchaCanvas.toDataURL() || "/placeholder.svg"}
                          alt="CAPTCHA"
                          className="h-12 border border-gray-700 rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={generateCaptcha}
                          className="absolute top-0 right-0 h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                          </svg>
                          <span className="sr-only">Captcha neu generieren</span>
                        </Button>
                      </div>
                    )}
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      type="text"
                      id="captcha"
                      name="captcha"
                      value={userCaptchaInput}
                      onChange={handleCaptchaChange}
                      required
                      className={`flex-1 px-3 py-2 bg-gray-800 border ${
                        captchaError ? "border-red-500" : "border-gray-700"
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-600`}
                      placeholder="Code eingeben"
                    />
                  </div>
                  {captchaError && (
                    <p className="text-red-500 text-sm mt-1">
                      Der CAPTCHA-Code ist falsch. Bitte versuchen Sie es erneut.
                    </p>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  >
                    Nachricht senden <Send className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
