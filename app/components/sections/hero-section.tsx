"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden text-white">
      {/* Hero Content */}
      <motion.div
        style={{ y: 0 }} // We'll remove the contentTranslate since it's in a separate component
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
                  onClick={() => {
                    const element = document.getElementById("maerkte")
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
                  Märkte ansehen
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
