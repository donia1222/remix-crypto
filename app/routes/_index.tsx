"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Link } from "@remix-run/react"
import { motion } from "framer-motion"
import { ChevronUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { MetaFunction } from "@remix-run/node"

// Import section components
import { Header } from "../components/header"
import { MarketsSection } from "../components/markets-section"
import { FeaturesSection } from "../components/features-section"
import { TestimonialsSection } from "../components/testimonials-section"
import { PricingSection } from "../components/pricing-section"
import { NewsSection } from "../components/news-section"
import { FaqSection } from "../components/faq-section"
import { ContactSection } from "../components/contact-section"
import { CallToActionSection } from "../components/cta-section"

export const meta: MetaFunction = () => {
  return [
    { title: "Krypto - Schweizer Kryptowährungsplattform" },
    { name: "description", content: "Moderne Plattform für Kryptowährungshandel aus der Schweiz" },
  ]
}

// Zu verfolgende Kryptowährungspaare
const trackedPairs = [
  { id: 1, name: "Bitcoin", symbol: "BTCUSDT", shortSymbol: "BTC", volume: "45.2B", marketCap: "1.2T" },
  { id: 2, name: "Ethereum", symbol: "ETHUSDT", shortSymbol: "ETH", volume: "23.1B", marketCap: "420.5B" },
  { id: 3, name: "Binance Coin", symbol: "BNBUSDT", shortSymbol: "BNB", volume: "8.7B", marketCap: "61.2B" },
  { id: 4, name: "Cardano", symbol: "ADAUSDT", shortSymbol: "ADA", volume: "2.1B", marketCap: "20.5B" },
  { id: 5, name: "Dogecoin", symbol: "DOGEUSDT", shortSymbol: "DOGE", volume: "3.4B", marketCap: "28.7B" },
]

// Anfangsdaten zum Anzeigen, während die echten Daten geladen werden
const initialPriceData = trackedPairs.map((pair) => ({
  ...pair,
  price: 0,
  change: 0,
  lastPrice: 0,
  priceDirection: "neutral" as "up" | "down" | "neutral",
}))

// Daten für den Nachrichtenbereich
const newsItems = [
  {
    id: 1,
    title: "Bitcoin überschreitet zum ersten Mal in seiner Geschichte 70.000 CHF",
    excerpt:
      "Die führende Kryptowährung auf dem Markt hat ein neues Allzeithoch erreicht, angetrieben durch institutionelle Akzeptanz.",
    date: "15. April 2024",
    image: "/images/news-bitcoin.jpg",
    category: "Märkte",
  },
  {
    id: 2,
    title: "Ethereum schließt Upgrade ab, das den Energieverbrauch reduziert",
    excerpt:
      "Die zweitgrößte Kryptowährung der Welt hat erfolgreich ihren Übergang zu einem nachhaltigeren Modell abgeschlossen.",
    date: "12. April 2024",
    image: "/images/news-ethereum.jpg",
    category: "Technologie",
  },
  {
    id: 3,
    title: "Regulierungsbehörden kündigen neuen Rahmen für Kryptowährungen an",
    excerpt:
      "Mehrere Länder haben sich auf einen gemeinsamen Regulierungsrahmen geeinigt, der die Kryptowährungslandschaft verändern könnte.",
    date: "8. April 2024",
    image: "/images/news-regulation.jpg",
    category: "Regulierung",
  },
]

// Daten für den Testimonial-Bereich
const testimonials = [
  {
    id: 1,
    name: "Thomas Müller",
    role: "Professioneller Trader",
    quote:
      "Krypto hat meine Art zu handeln verändert. Die Plattform ist schnell, intuitiv und bietet mir alle Werkzeuge, die ich für fundierte Entscheidungen benötige.",
    avatar: "/images/avatar-1.jpg",
  },
  {
    id: 2,
    name: "Laura Schneider",
    role: "Privatanlegerin",
    quote:
      "Als Anfängerin in der Welt der Kryptowährungen hat mir Krypto den Lern- und Investitionsprozess erheblich erleichtert. Die Benutzeroberfläche ist sehr benutzerfreundlich.",
    avatar: "/images/avatar-2.jpg",
  },
  {
    id: 3,
    name: "Michael Brunner",
    role: "Finanzvorstand",
    quote:
      "Unser Unternehmen nutzt Krypto, um einen Teil unseres Portfolios zu verwalten. Die Sicherheit und Zuverlässigkeit der Plattform geben uns die nötige Ruhe.",
    avatar: "/images/avatar-3.jpg",
  },
]

// Daten für den FAQ-Bereich
const faqItems = [
  {
    question: "Wie beginne ich mit dem Handel auf Krypto?",
    answer:
      "Um zu beginnen, erstellen Sie einfach ein kostenloses Konto, verifizieren Sie Ihre Identität und tätigen Sie eine Einzahlung. Sobald diese Schritte abgeschlossen sind, können Sie sofort Kryptowährungen kaufen, verkaufen und tauschen.",
  },
  {
    question: "Welche Kryptowährungen kann ich auf Krypto kaufen?",
    answer:
      "Krypto bietet Zugang zu mehr als 100 verschiedenen Kryptowährungen, darunter Bitcoin, Ethereum, Binance Coin, Cardano, Solana, Dogecoin und viele mehr. Wir fügen ständig neue Kryptowährungen zu unserer Plattform hinzu.",
  },
  {
    question: "Wie wird die Sicherheit meiner Vermögenswerte gewährleistet?",
    answer:
      "Wir verwenden Verschlüsselungstechnologie auf Bankniveau, Cold Storage für die meisten Gelder, Zwei-Faktor-Authentifizierung und führen regelmäßige Sicherheitsaudits durch. Darüber hinaus haben wir eine Versicherung, die digitale Vermögenswerte im Falle eines Vorfalls abdeckt.",
  },
  {
    question: "Wie hoch sind die Gebühren für den Handel auf Krypto?",
    answer:
      "Unsere Gebühren variieren je nach gewähltem Plan. Der Basisplan hat eine Standardgebühr von 0,5% pro Transaktion. Die Pro- und Unternehmenspläne bieten reduzierte Gebühren von 0,25% bzw. 0,1% sowie weitere Vorteile.",
  },
  {
    question: "Kann ich meine Kryptowährungen auf eine externe Wallet übertragen?",
    answer:
      "Ja, Krypto ermöglicht es Ihnen, Ihre Kryptowährungen auf jede kompatible externe Wallet zu übertragen. Gehen Sie einfach zum Auszahlungsbereich, wählen Sie die Kryptowährung aus, die Sie übertragen möchten, und geben Sie die Adresse der Ziel-Wallet ein.",
  },
]

export default function Index() {
  // Zustand für Preise und Änderungen
  const [cryptoData, setCryptoData] = useState(initialPriceData)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const priceMapRef = useRef<{ [symbol: string]: { price: number; lastPrice: number } }>({})

  // Zustand für das mobile Menü
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Zustand für die FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Zustand für das Kontaktformular
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Verbindung zum Binance WebSocket herstellen
  useEffect(() => {
    // WebSocket-Verbindung erstellen
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/stream?streams=" +
        trackedPairs.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
    )

    // Preismap initialisieren
    trackedPairs.forEach((pair) => {
      priceMapRef.current[pair.symbol] = { price: 0, lastPrice: 0 }
    })

    // Verbindungsöffnung behandeln
    socket.onopen = () => {
      console.log("WebSocket verbunden")
      setIsConnected(true)
    }

    // Empfangene Nachrichten behandeln
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message?.data?.s && message?.data?.p) {
        const symbol = message.data.s
        const newPrice = Number.parseFloat(message.data.p)

        // Preismap aktualisieren
        const currentData = priceMapRef.current[symbol]
        if (currentData) {
          priceMapRef.current[symbol] = {
            lastPrice: currentData.price,
            price: newPrice,
          }
        }

        // Kryptowährungsdaten aktualisieren
        setCryptoData((prevData) => {
          return prevData.map((crypto) => {
            if (crypto.symbol === symbol) {
              const lastPrice = crypto.price || newPrice
              const priceChange = ((newPrice - lastPrice) / lastPrice) * 100
              const dailyChange = crypto.change
                ? Math.random() > 0.5
                  ? crypto.change + Math.random() * 0.1
                  : crypto.change - Math.random() * 0.1
                : Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)

              return {
                ...crypto,
                lastPrice: lastPrice,
                price: newPrice,
                change: Number.parseFloat(dailyChange.toFixed(2)),
                priceDirection: newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : "neutral",
              }
            }
            return crypto
          })
        })

        // Zeitpunkt der letzten Aktualisierung aktualisieren
        setLastUpdated(new Date())
      }
    }

    // Fehler behandeln
    socket.onerror = (error) => {
      console.error("WebSocket-Fehler:", error)
      setIsConnected(false)
    }

    // Verbindungsschließung behandeln
    socket.onclose = () => {
      console.log("WebSocket getrennt")
      setIsConnected(false)
    }

    // Socket-Referenz speichern
    socketRef.current = socket

    // Beim Unmounten aufräumen
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [])

  // Preis mit Tausendertrennzeichen formatieren
  const formatPrice = (price: number) => {
    if (!price) return "0.00"

    return price >= 1000
      ? price.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : price.toFixed(2)
  }

  // Datum der letzten Aktualisierung formatieren
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // WebSocket neu verbinden
  const reconnectWebSocket = () => {
    if (socketRef.current) {
      if (socketRef.current.readyState !== WebSocket.OPEN) {
        socketRef.current.close()

        // Verbindung neu erstellen
        const socket = new WebSocket(
          "wss://stream.binance.com:9443/stream?streams=" +
            trackedPairs.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
        )

        socketRef.current = socket

        socket.onopen = () => {
          console.log("WebSocket neu verbunden")
          setIsConnected(true)
        }

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data)

          if (message?.data?.s && message?.data?.p) {
            const symbol = message.data.s
            const newPrice = Number.parseFloat(message.data.p)

            // Preismap aktualisieren
            const currentData = priceMapRef.current[symbol]
            if (currentData) {
              priceMapRef.current[symbol] = {
                lastPrice: currentData.price,
                price: newPrice,
              }
            }

            // Kryptowährungsdaten aktualisieren
            setCryptoData((prevData) => {
              return prevData.map((crypto) => {
                if (crypto.symbol === symbol) {
                  const lastPrice = crypto.price || newPrice
                  const priceChange = ((newPrice - lastPrice) / lastPrice) * 100
                  const dailyChange = crypto.change
                    ? Math.random() > 0.5
                      ? crypto.change + Math.random() * 0.1
                      : crypto.change - Math.random() * 0.1
                    : Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)

                  return {
                    ...crypto,
                    lastPrice: lastPrice,
                    price: newPrice,
                    change: Number.parseFloat(dailyChange.toFixed(2)),
                    priceDirection: newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : "neutral",
                  }
                }
                return crypto
              })
            })

            // Zeitpunkt der letzten Aktualisierung aktualisieren
            setLastUpdated(new Date())
          }
        }
      }
    }
  }

  // Absenden des Kontaktformulars behandeln
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formular gesendet:", contactForm)
    setFormSubmitted(true)

    // Formular nach 3 Sekunden zurücksetzen
    setTimeout(() => {
      setFormSubmitted(false)
      setContactForm({
        name: "",
        email: "",
        message: "",
      })
    }, 3000)
  }

  // Änderungen im Formular behandeln
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Funktion für sanftes Scrollen zu Abschnitten
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false) // Mobiles Menü nach dem Klicken schließen
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrollToSection={scrollToSection} />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                  Die Zukunft der Kryptowährungen ist hier
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl">
                  Kaufen, verkaufen und tauschen Sie Kryptowährungen mit Leichtigkeit. Sichere und moderne Plattform für
                  alle Ihre digitalen Vermögenswerte.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105">
                    Jetzt starten
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800 transition-all duration-300"
                    onClick={() => scrollToSection("maerkte")}
                  >
                    Märkte ansehen
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                <img
                  alt="Kryptowährungs-Dashboard"
                  className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  src="/images/crypto-dashboard-dark.png"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistikbereich */}
        <section className="w-full py-8 bg-gray-900 border-y border-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
            >
              <div className="text-center p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</h3>
                <p className="text-gray-400 text-sm">Aktive Benutzer</p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">2.5B CHF</h3>
                <p className="text-gray-400 text-sm">Monatliches Volumen</p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">100+</h3>
                <p className="text-gray-400 text-sm">Kryptowährungen</p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">50+</h3>
                <p className="text-gray-400 text-sm">Unterstützte Länder</p>
              </div>
            </motion.div>
          </div>
        </section>

        <MarketsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <NewsSection />
        <FaqSection />
        <ContactSection />
        <CallToActionSection />
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-black">
        <p className="text-xs text-gray-400">© 2024 Krypto. Alle Rechte vorbehalten.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" to="/terms">
            Nutzungsbedingungen
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" to="/privacy">
            Datenschutzrichtlinie
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" to="/cookies">
            Cookie-Richtlinie
          </Link>
        </nav>
      </footer>

      {/* Nach-oben-Schaltfläche */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-white shadow-lg z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
