"use client"

import { Link } from "@remix-run/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from 'lucide-react'
import { Button } from "~/components/ui/button"

interface HeaderProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  scrollToSection: (id: string) => void
}

export function Header({ mobileMenuOpen, setMobileMenuOpen, scrollToSection }: HeaderProps) {
  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center bg-black sticky top-0 z-50">
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

        {/* Desktop menu */}
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

        {/* Mobile menu button */}
        <div className="ml-auto md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black border-b border-gray-800 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-3">
              <button
                onClick={() => scrollToSection("maerkte")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Märkte
              </button>
              <button
                onClick={() => scrollToSection("funktionen")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Funktionen
              </button>
              <button
                onClick={() => scrollToSection("preise")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Preise
              </button>
              <button
                onClick={() => scrollToSection("nachrichten")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Nachrichten
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                Kontakt
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
