"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Link } from "@remix-run/react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  ChevronDown,
  BarChart3,
  Lock,
  Zap,
  Mail,
  Phone,
  MapPin,
  Send,
  Menu,
  X,
  ChevronUp,
  Globe,
  TrendingUp,
  Shield,
  Users,
  Search,
  Bell,
  User,
  Home,
  Briefcase,
  HelpCircle,
  Settings,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import type { MetaFunction } from "@remix-run/node"

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

// Menüpunkte für das neue moderne Menü
const menuItems = [
  { icon: Home, label: "Startseite", href: "#" },
  { icon: BarChart3, label: "Märkte", href: "#maerkte" },
  { icon: Briefcase, label: "Portfolio", href: "#" },
  { icon: TrendingUp, label: "Trading", href: "#" },
  { icon: Shield, label: "Sicherheit", href: "#" },
  { icon: HelpCircle, label: "Hilfe", href: "#faq" },
  { icon: Settings, label: "Einstellungen", href: "#" },
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

  // Zustand für das neue moderne Menü
  const [modernMenuOpen, setModernMenuOpen] = useState(false)

  // Zustand für die FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Zustand für das Kontaktformular
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Scroll-Effekte
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const headerBlur = useTransform(scrollY, [0, 300], [0, 8])
  const contentTranslate = useTransform(scrollY, [0, 300], [0, -50])
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.6])

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
    // Close menus first
    setMobileMenuOpen(false)
    setModernMenuOpen(false)

    // Small delay to ensure menu closing animation completes
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        // Calculate position accounting for fixed header
        const headerHeight = 64 // 16 * 4 = 64px (h-16)
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight

        // Smooth scroll with improved behavior
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Header mit Scroll-Effekt */}
      <motion.header
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className="px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 bg-black/80 backdrop-blur transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <Link className="flex items-center justify-center" to="/">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-white"
            >
              Krypto
            </motion.span>
          </Link>
        </div>

        {/* Desktop-Menü */}
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <button
            onClick={() => scrollToSection("maerkte")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Märkte
          </button>
          <button
            onClick={() => scrollToSection("funktionen")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Funktionen
          </button>
          <button
            onClick={() => scrollToSection("preise")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Preise
          </button>
          <button
            onClick={() => scrollToSection("nachrichten")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Nachrichten
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection("kontakt")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Kontakt
          </button>
        </nav>

        {/* Header-Aktionen */}
        <div className="ml-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hidden md:flex">
            <User className="h-5 w-5" />
          </Button>

          {/* Mobiles Menü-Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobiles Menü */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="bg-black border-b border-gray-800 md:hidden overflow-hidden fixed top-16 left-0 right-0 z-40"
          >
            <nav className="flex flex-col p-4 space-y-3">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => scrollToSection("maerkte")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Märkte
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                onClick={() => scrollToSection("funktionen")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Funktionen
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => scrollToSection("preise")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Preise
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => scrollToSection("nachrichten")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Nachrichten
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                FAQ
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => scrollToSection("kontakt")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Kontakt
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video de fondo fijo - limitado a la altura de la ventana */}
      <div className="fixed inset-0 z-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10"></div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center">
          <source src="/videos/crypto-background.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="flex-1 pt-16 relative z-10">
        {/* Hero-Bereich mit Vollbild-Header und Scroll-Effekt */}
        <section className="relative w-full h-screen overflow-hidden text-white">
          {/* Hero-Inhalt */}
          <motion.div
            style={{ y: contentTranslate }}
            className="container px-4 md:px-6 mx-auto relative z-10 h-full flex items-center"
          >
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                  Die Zukunft der Kryptowährungen ist hier
                </h1>
                <p className="text-gray-300 md:text-xl max-w-2xl mx-auto">
                  Kaufen, verkaufen und tauschen Sie Kryptowährungen mit Leichtigkeit. Sichere und moderne Plattform für
                  alle Ihre digitalen Vermögenswerte.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300">
                      Jetzt starten <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800 transition-all duration-300"
                      onClick={() => scrollToSection("maerkte")}
                    >
                      Märkte ansehen
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Contenido con fondo sólido */}
        <div className="bg-gray-950 relative z-20">
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
                <motion.div whileHover={{ y: -5 }} className="text-center p-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</h3>
                  <p className="text-gray-400 text-sm">Aktive Benutzer</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="text-center p-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">2.5B CHF</h3>
                  <p className="text-gray-400 text-sm">Monatliches Volumen</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="text-center p-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">100+</h3>
                  <p className="text-gray-400 text-sm">Kryptowährungen</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="text-center p-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">50+</h3>
                  <p className="text-gray-400 text-sm">Unterstützte Länder</p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Echtzeit-Marktpreisbereich */}
          <section id="maerkte" className="w-full py-12 md:py-16 bg-gray-950">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Märkte</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Echtzeit-Preise</h2>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <span>Letzte Aktualisierung: {formatLastUpdated(lastUpdated)}</span>
                    <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>{isConnected ? "Verbunden" : "Getrennt"}</span>
                    {!isConnected && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={reconnectWebSocket}>
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">Echtzeit-Daten von der Binance WebSocket API</p>
                </motion.div>
              </div>

              <div className="overflow-x-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">#</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Name</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Preis</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">24h %</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Volumen (24h)</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Marktkapitalisierung</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-400"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoData.map((crypto, index) => (
                        <motion.tr
                          key={crypto.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
                            crypto.priceDirection === "up"
                              ? "bg-green-900/10"
                              : crypto.priceDirection === "down"
                                ? "bg-red-900/10"
                                : ""
                          }`}
                        >
                          <td className="py-4 px-4 text-sm text-gray-300">{crypto.id}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {crypto.shortSymbol.substring(0, 1)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-white">{crypto.name}</div>
                                <div className="text-xs text-gray-400">{crypto.shortSymbol}</div>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`py-4 px-4 text-right font-medium ${
                              crypto.priceDirection === "up"
                                ? "text-green-400"
                                : crypto.priceDirection === "down"
                                  ? "text-red-400"
                                  : "text-white"
                            }`}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {formatPrice(crypto.price)} CHF
                              {crypto.priceDirection === "up" && (
                                <motion.span
                                  animate={{ y: [-2, 0] }}
                                  transition={{ duration: 0.2 }}
                                  className="text-green-500"
                                >
                                  ▲
                                </motion.span>
                              )}
                              {crypto.priceDirection === "down" && (
                                <motion.span
                                  animate={{ y: [0, 2] }}
                                  transition={{ duration: 0.2 }}
                                  className="text-red-500"
                                >
                                  ▼
                                </motion.span>
                              )}
                            </div>
                          </td>
                          <td
                            className={`py-4 px-4 text-right font-medium ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {crypto.change >= 0 ? "+" : ""}
                            {crypto.change}%
                          </td>
                          <td className="py-4 px-4 text-right text-gray-300">{crypto.volume} CHF</td>
                          <td className="py-4 px-4 text-right text-gray-300">{crypto.marketCap} CHF</td>
                          <td className="py-4 px-4 text-right">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800"
                              >
                                Handeln <ArrowUpRight className="ml-1 h-3 w-3" />
                              </Button>
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </div>

              <div className="mt-8 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    onClick={() => scrollToSection("funktionen")}
                  >
                    Mehr Funktionen entdecken <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Funktionsbereich */}
          <section id="funktionen" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
            <div className="container px-4 md:px-6 mx-auto">
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
                    Unsere Plattform bietet fortschrittliche Tools und eine intuitive Benutzeroberfläche für Trader
                    aller Erfahrungsstufen.
                  </p>
                </motion.div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: <BarChart3 className="h-6 w-6 text-cyan-400" />,
                    title: "Fortschrittliche Analyse",
                    description: "Technische Analysetools und Echtzeit-Charts für fundierte Entscheidungen.",
                  },
                  {
                    icon: <Lock className="h-6 w-6 text-cyan-400" />,
                    title: "Maximale Sicherheit",
                    description:
                      "Hochmoderner Schutz für Ihre digitalen Vermögenswerte mit Zwei-Faktor-Authentifizierung.",
                  },
                  {
                    icon: <Zap className="h-6 w-6 text-cyan-400" />,
                    title: "Schnelle Transaktionen",
                    description:
                      "Führen Sie Transaktionen in Sekundenschnelle mit unserer Hochgeschwindigkeitsinfrastruktur durch.",
                  },
                  {
                    icon: <Globe className="h-6 w-6 text-cyan-400" />,
                    title: "Globaler Zugang",
                    description: "Handeln Sie von überall auf der Welt mit unserer mehrsprachigen Plattform.",
                  },
                  {
                    icon: <TrendingUp className="h-6 w-6 text-cyan-400" />,
                    title: "Automatisierter Handel",
                    description:
                      "Richten Sie automatisierte Handelsstrategien mit unseren fortschrittlichen Tools ein.",
                  },
                  {
                    icon: <Shield className="h-6 w-6 text-cyan-400" />,
                    title: "Integrierte Versicherungen",
                    description: "Ihre Vermögenswerte sind durch unser Versicherungsprogramm gegen Vorfälle geschützt.",
                  },
                  {
                    icon: <Users className="h-6 w-6 text-cyan-400" />,
                    title: "Aktive Gemeinschaft",
                    description:
                      "Treten Sie einer globalen Gemeinschaft von Tradern bei, um Strategien und Wissen auszutauschen.",
                  },
                  {
                    icon: <RefreshCw className="h-6 w-6 text-cyan-400" />,
                    title: "Ständige Updates",
                    description: "Wir verbessern unsere Plattform kontinuierlich mit neuen Funktionen und Tools.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-col items-center space-y-2 rounded-lg border border-gray-800 p-6 bg-gray-800/50 transition-all duration-300"
                  >
                    <div className="rounded-full bg-gray-800 p-3">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white text-center">{feature.title}</h3>
                    <p className="text-gray-300 text-center text-sm flex-grow">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonialbereich */}
          <section className="w-full py-12 md:py-24 bg-black">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">
                    Testimonials
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Was unsere Benutzer sagen
                  </h2>
                  <p className="max-w-[700px] text-gray-300">
                    Tausende von Tradern vertrauen Krypto für ihre täglichen Geschäfte. Entdecken Sie warum.
                  </p>
                </motion.div>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="absolute -top-5 left-5"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                        "
                      </div>
                    </motion.div>
                    <div className="pt-4">
                      <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{testimonial.name}</h4>
                          <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Preisbereich */}
          <section id="preise" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Transparente Preise</h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Wählen Sie den Plan, der am besten zu Ihren Handelsbedürfnissen passt.
                  </p>
                </motion.div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3">
                {[
                  {
                    title: "Basis",
                    description: "Für Anfänger-Trader",
                    price: "0 CHF",
                    period: "/Monat",
                    features: ["Zugang zu Hauptmärkten", "Grundlegende Charts", "Standardgebühr", "E-Mail-Support"],
                    buttonText: "Kostenlos starten",
                    popular: false,
                  },
                  {
                    title: "Pro",
                    description: "Für aktive Trader",
                    price: "29 CHF",
                    period: "/Monat",
                    features: [
                      "Alles vom Basisplan",
                      "Fortgeschrittene technische Analyse",
                      "Reduzierte Gebühren",
                      "Prioritätssupport",
                      "Trading-API",
                      "Preisalarme",
                    ],
                    buttonText: "Jetzt abonnieren",
                    popular: true,
                  },
                  {
                    title: "Unternehmen",
                    description: "Für Institutionen",
                    price: "99 CHF",
                    period: "/Monat",
                    features: [
                      "Alles vom Pro-Plan",
                      "Dedizierte API",
                      "Minimale Gebühren",
                      "Persönlicher Account Manager",
                      "Dedizierte Infrastruktur",
                      "Vollständige Anpassung",
                      "24/7-Support",
                    ],
                    buttonText: "Vertrieb kontaktieren",
                    popular: false,
                  },
                ].map((plan, index) => (
                  <div
                    key={index}
                    className={`flex h-full flex-col rounded-lg border ${
                      plan.popular ? "border-cyan-600" : "border-gray-800"
                    } p-6 bg-gray-800/50 relative transition-all duration-300`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-cyan-600 px-3 py-1 text-xs font-medium text-black">
                        Beliebt
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                      <p className="text-gray-300">{plan.description}</p>
                    </div>
                    <div className="mt-4 flex items-baseline text-white">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-gray-300">{plan.period}</span>
                    </div>
                    <ul className="mt-6 space-y-3 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-cyan-400 shrink-0"
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
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        } transition-all duration-300`}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Nachrichtenbereich */}
          <section id="nachrichten" className="w-full py-12 md:py-24 bg-gray-950">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Nachrichten</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Neueste Updates</h2>
                  <p className="max-w-[700px] text-gray-300">
                    Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Trends aus der Welt der
                    Kryptowährungen.
                  </p>
                </motion.div>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {newsItems.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-400">{news.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">{news.excerpt}</p>
                      <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 p-0 hover:bg-transparent">
                          Mehr lesen <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Alle Nachrichten anzeigen
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAQ-Bereich */}
          <section id="faq" className="w-full py-12 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">FAQ</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Häufig gestellte Fragen
                  </h2>
                  <p className="max-w-[700px] text-gray-300">
                    Finden Sie Antworten auf die häufigsten Fragen zu unserer Plattform.
                  </p>
                </motion.div>
              </div>

              <div className="max-w-3xl mx-auto">
                {faqItems.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="mb-4 border border-gray-800 rounded-lg overflow-hidden"
                  >
                    <motion.button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex justify-between items-center w-full p-4 text-left bg-gray-800 hover:bg-gray-700 transition-colors"
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 1)" }}
                    >
                      <h3 className="text-white font-medium">{faq.question}</h3>
                      <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        {openFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-gray-900 text-gray-300 text-sm">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-gray-300 mb-4">Finden Sie nicht die Antwort, die Sie suchen?</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    onClick={() => scrollToSection("kontakt")}
                  >
                    Kontaktieren Sie uns
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Kontaktbereich */}
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
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Wir sind hier, um zu helfen
                  </h2>
                  <p className="text-gray-300">
                    Unser Support-Team steht Ihnen zur Verfügung, um alle Ihre Fragen zu beantworten und Ihnen bei der
                    Lösung von Problemen zu helfen.
                  </p>

                  <div className="space-y-4 mt-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">E-Mail</p>
                        <p className="text-white">support@krypto.ch</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Telefon</p>
                        <p className="text-white">+41 44 123 45 67</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Adresse</p>
                        <p className="text-white">Bahnhofstrasse 123, 8001 Zürich, Schweiz</p>
                      </div>
                    </motion.div>
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

          {/* Final CTA Section with solid background */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black relative z-20">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                    Schließen Sie sich der Krypto-Revolution an
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Mehr als 1 Million Benutzer vertrauen Krypto für ihre täglichen Geschäfte.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300">
                      Konto erstellen <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800 transition-all duration-300"
                    >
                      Demo ansehen
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer with solid background */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-black relative z-30">
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

      {/* Nach-oben-Schaltfläche mit verbesserter Animation */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-white shadow-lg z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
