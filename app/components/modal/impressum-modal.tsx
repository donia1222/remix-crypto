"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from 'lucide-react'

interface ImpressumModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImpressumModal({ isOpen, onClose }: ImpressumModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white">Impressum</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto text-gray-300 space-y-6 text-sm md:text-base">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Unternehmensangaben</h3>
                  <p className="text-gray-300">nextrade Krypto Trading & IT Lösungen</p>
                  <p className="text-gray-300">Schweiz</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Kontakt</h3>
                  <div className="space-y-1">
                    <p className="text-gray-300">
                      <span className="font-medium">E-Mail:</span> info@nextrade.ch
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">WhatsApp:</span> +41 78 699 99 50
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Website</h3>
                  <p className="text-gray-300">
                    <span className="font-medium">Website Design:</span> lweb
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Bildnachweise</h3>
                  <p className="text-gray-300">
                    Einige Bilder stammen von{" "}
                    <a
                      href="https://www.freepik.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Freepik
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Haftungsausschluss</h3>
       
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6 border-t border-gray-800 bg-gray-900 sticky bottom-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Schließen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
