"use client"
import { useState } from "react"
import { Link } from "@remix-run/react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Menu, X, Search, Bell, User, ChevronUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { MetaFunction } from "@remix-run/node"

// Import section components
import HeroSection from "../components/sections/hero-section"
import MarketsSection from "../components/sections/markets-section"
import FeaturesSection from "../components/sections/features-section"
import PricingSection from "../components/sections/pricing-section"
import NewsSection from "../components/sections/news-section"
import FaqSection from "../components/sections/faq-section"
import ContactSection from "../components/sections/contact-section"

export const meta: MetaFunction = () => {
  return [
    { title: "Krypto - Schweizer Kryptowährungsplattform" },
    { name: "description", content: "Moderne Plattform für Kryptowährungshandel aus der Schweiz" },
  ]
}

export default function Index() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 overflow-x-hidden">
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

        {/* Desktop Menu */}
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

        {/* Header Actions */}
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

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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
        <nav className="flex flex-col p-4 space-y-3">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.1 }}
            onClick={() => scrollToSection("maerkte")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
          >
            Märkte
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.15 }}
            onClick={() => scrollToSection("funktionen")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
          >
            Funktionen
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.2 }}
            onClick={() => scrollToSection("preise")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
          >
            Preise
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.25 }}
            onClick={() => scrollToSection("nachrichten")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
          >
            Nachrichten
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.3 }}
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
          >
            FAQ
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.35 }}
            onClick={() => scrollToSection("kontakt")}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
          >
            Kontakt
          </motion.button>
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

        {/* Content with solid background */}
        <div className="bg-gray-950 relative z-20">
          {/* Markets Section */}
          <MarketsSection />

          {/* Features Section */}
          <FeaturesSection />

          {/* Pricing Section */}
          <PricingSection />

          {/* News Section */}
          <NewsSection />

          {/* FAQ Section */}
          <FaqSection />

          {/* Contact Section */}
          <ContactSection />

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

      {/* Back-to-top button with improved animation */}
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
