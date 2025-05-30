"use client"

import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useState, useEffect } from "react"
import { Link } from "@remix-run/react"
import { motion, useScroll, useTransform } from "framer-motion"
import { X, ChevronUp, BarChart2, Newspaper, Mail, Database, TrendingUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { MetaFunction } from "@remix-run/node"
import LoadingAnimation from "../components/animated/loading-animation"
import CookieConsent from "../components/cookie-consent"
import ParticleAnimation from "../components/animated/particle-animation"
import TermsModal from "../components/modal/terms-modal"
import ImpressumModal from "../components/modal/impressum-modal"

// Import section components
import HeroSection from "../components/sections/hero-section"
import MarketsSection from "../components/sections/markets-section"
import NewsSection from "../components/sections/news-section"
import FaqSection from "../components/sections/pricing-section"
import ContactSection from "../components/sections/contact-section"
import AnimatedTextReveal from "../components/animated/animated-text-reveal"
import BlockchainVisualizer from "../components/sections/blockchain-visualizer"
import BingXTransactionsSimple from "../components/sections/bingx-transactions-simple"

export const meta: MetaFunction = () => {
  return [
    { title: "nextrade | Krypto Trading & IT Lösungen" },
    { name: "description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },
    { name: "theme-color", content: "#000000" },
    {
      name: "keywords",
      content: "nextrade, Krypto, Trading, IT Lösungen, Schweiz, Kryptowährung, Blockchain, Bitcoin, Ethereum",
    },
    { property: "og:title", content: "nextrade | Krypto Trading & IT Lösungen" },
    { property: "og:description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "nextrade" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "nextrade | Krypto Trading & IT Lösungen" },
    { name: "twitter:description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },
    { name: "author", content: "nextrade" },
    { name: "language", content: "de" },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Get password from environment variable
  const password = process.env.BINGX_PASSWORD

  // Log for debugging (remove in production)
  console.log("Environment password loaded:", password ? "Password found" : "Password not found")

  return json({
    password: password || null,
  })
}

export default function Index() {
  const { password } = useLoaderData<typeof loader>()

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Estado para rastrear el hover en los elementos del menú
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // State to track scroll position for back-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false)

  // State for modals
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [impressumModalOpen, setImpressumModalOpen] = useState(false)

  // Scroll effects
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const headerBlur = useTransform(scrollY, [0, 300], [0, 8])

  // Function for smooth scrolling to sections
  const scrollToSection = (id: string) => {
    // Close menus first
    setMobileMenuOpen(false)

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

  // Definir los elementos del menú con sus iconos
  const menuItems = [
    { id: "bingx", text: "Trading Übersicht", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "maerkte", text: "Märkte-Preise", icon: <BarChart2 className="h-4 w-4" /> },
    { id: "nachrichten", text: "Neueste Updates", icon: <Newspaper className="h-4 w-4" /> },
    { id: "blockchain", text: "Preise", icon: <Database className="h-4 w-4" /> },
    { id: "kontakt", text: "Kontakt", icon: <Mail className="h-4 w-4" /> },
  ]

  // Effect to handle scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setShowScrollTop(window.scrollY > 300)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Loading Animation */}
      <LoadingAnimation />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Terms, Privacy and Impressum Modals */}
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} type="terms" />
      <TermsModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} type="privacy" />
      <ImpressumModal isOpen={impressumModalOpen} onClose={() => setImpressumModalOpen(false)} />

      {/* Header with scroll effect */}
      <motion.header
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className="px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 bg-black/80 backdrop-blur transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <Link className="flex items-center justify-center" to="/">
            <motion.img
              src="/A5.png"
              alt="Krypto Logo"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-8"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center group"
            >
              <motion.div
                className="mr-2 text-cyan-400 group-hover:text-cyan-300"
                animate={{
                  rotate: hoveredItem === item.id ? [0, -10, 10, -10, 0] : 0,
                  scale: hoveredItem === item.id ? 1.2 : 1,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                }}
              >
                {item.icon}
              </motion.div>
              {item.text}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button - Positioned at far right */}
        <div className="md:hidden ml-auto">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            )}
          </Button>
        </div>
      </motion.header>

      {/* Mobile Menu - Centered */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          height: mobileMenuOpen ? "auto" : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="bg-black/70 backdrop-blur-md border-b border-gray-800/50 md:hidden overflow-hidden fixed top-16 left-0 right-0 z-40"
      >
        <nav className="flex flex-col p-4 space-y-3 items-center text-center max-w-xs mx-auto">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2 flex items-center"
              whileHover={{ x: 5 }}
            >
              <motion.div
                className="mr-2 text-cyan-400"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item.icon}
              </motion.div>
              {item.text}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Background video - fixed to viewport height */}
      <div className="fixed inset-0 z-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10"></div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center">
          <source src="/videos/crypto-background.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="flex-1 pt-16 relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Animated Text Reveal Section */}
        <AnimatedTextReveal />

                                {/* BingX Section */}
                                <section id="bingx">
                                        <div className="inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10">
                                                {/* BingX Transactions Section - Now with password prop */}
                                                {password !== null ? (
                                                        <BingXTransactionsSimple password={password} />
                                                ) : (
                                                        <BingXTransactionsSimple />
                                                )}
                                        </div>
                                </section>

                                {/* Content with solid background */}
                                <div className="bg-gray-950 ">
          {/* Markets Section */}
          <section id="maerkte">
            <MarketsSection />
          </section>

          {/* News Section */}
          <section id="nachrichten">
            <NewsSection />
          </section>

          {/* Blockchain Visualizer */}
          <section id="blockchain">
            <BlockchainVisualizer />
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mt-32">
            <FaqSection />
          </section>
          {/* Final CTA Section with solid background */}
          <section
            className="w-full py-12 md:py-24 lg:py-32 relative z-20 bg-cover bg-center min-h-[400px] flex items-end overflow-hidden"
            style={{ backgroundImage: 'url("/background-3d.png")' }}
          >
            <ParticleAnimation />
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <div className="flex flex-col items-center justify-end space-y-2 text-center"></div>
            </div>
          </section>
          {/* Contact Section */}
          <section id="kontakt">
            <ContactSection />
          </section>
        </div>
      </main>

      {/* Footer with solid background */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-black relative z-30">
        <p className="text-xs text-gray-400">© 2025 nextrade. Alle Rechte vorbehalten.</p>

        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <button
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            onClick={() => setTermsModalOpen(true)}
          >
            Nutzungsbedingungen
          </button>
          <button
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            onClick={() => setPrivacyModalOpen(true)}
          >
            Datenschutzrichtlinie
          </button>
          <button
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            onClick={() => setImpressumModalOpen(true)}
          >
            Impressum
          </button>
        </nav>
      </footer>

      {/* Back-to-top button - only visible after scrolling */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-gray-300 shadow-md z-50 hover:bg-gray-700 hover:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  )
}
