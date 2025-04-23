"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "~/components/ui/button"

// Data for the news section
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

export default function NewsSection() {
  return (
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
              Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Trends aus der Welt der Kryptowährungen.
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
  )
}
