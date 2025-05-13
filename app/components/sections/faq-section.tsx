"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "~/components/button"

// Data for the FAQ section
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

export default function FaqSection() {
  // State for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Häufig gestellte Fragen</h2>
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
              onClick={() => {
                const element = document.getElementById("kontakt")
                if (element) {
                  const headerHeight = 64
                  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                  const offsetPosition = elementPosition - headerHeight
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  })
                }
              }}
            >
              Kontaktieren Sie uns
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
