"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Check, Settings, Shield } from "lucide-react"
import { Button } from "~/components/button"

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Cookie settings state
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // Always true and disabled
    functional: true,
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent")

    // Only show the consent banner if user hasn't consented yet
    if (!hasConsented) {
      setShowConsent(true)
    }
  }, [])

  const handleAcceptAll = () => {
    // Set all cookies to true
    setCookieSettings({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })

    // Save consent to localStorage
    localStorage.setItem("cookieConsent", "all")

    // Hide the consent banner
    setShowConsent(false)
  }

  const handleAcceptSelected = () => {
    // Save current settings to localStorage
    localStorage.setItem("cookieConsent", JSON.stringify(cookieSettings))

    // Hide the consent banner
    setShowConsent(false)
  }

  const handleToggleSetting = (setting: keyof typeof cookieSettings) => {
    if (setting === "necessary") return // Can't toggle necessary cookies

    setCookieSettings({
      ...cookieSettings,
      [setting]: !cookieSettings[setting],
    })
  }

  if (!showConsent) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
        {!showSettings ? (
          <div className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-cyan-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Cookie-Einstellungen</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConsent(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm md:text-base">
                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Durch die
                Nutzung unserer Website stimmen Sie der Verwendung von Cookies gemäß unserer
                <a href="/cookies" className="text-cyan-400 hover:underline ml-1">
                  Cookie-Richtlinie
                </a>{" "}
                zu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Einstellungen anpassen
              </Button>
              <Button
                variant="default"
                onClick={handleAcceptAll}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                <Check className="h-4 w-4 mr-2" />
                Alle akzeptieren
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Settings className="h-6 w-6 text-cyan-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Cookie-Einstellungen anpassen</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                <div>
                  <h4 className="font-medium text-white">Notwendige Cookies</h4>
                  <p className="text-sm text-gray-400">
                    Diese Cookies sind für das Funktionieren der Website unerlässlich.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookieSettings.necessary}
                    disabled
                    className="h-5 w-5 rounded border-gray-700 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                <div>
                  <h4 className="font-medium text-white">Funktionale Cookies</h4>
                  <p className="text-sm text-gray-400">Ermöglichen erweiterte Funktionen und Personalisierung.</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookieSettings.functional}
                    onChange={() => handleToggleSetting("functional")}
                    className="h-5 w-5 rounded border-gray-700 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                <div>
                  <h4 className="font-medium text-white">Analytische Cookies</h4>
                  <p className="text-sm text-gray-400">
                    Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookieSettings.analytics}
                    onChange={() => handleToggleSetting("analytics")}
                    className="h-5 w-5 rounded border-gray-700 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                <div>
                  <h4 className="font-medium text-white">Marketing Cookies</h4>
                  <p className="text-sm text-gray-400">
                    Werden verwendet, um Besucher auf Websites zu verfolgen und relevante Anzeigen zu schalten.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookieSettings.marketing}
                    onChange={() => handleToggleSetting("marketing")}
                    className="h-5 w-5 rounded border-gray-700 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
              >
                Zurück
              </Button>
              <Button
                variant="default"
                onClick={handleAcceptSelected}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                Auswahl speichern
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
