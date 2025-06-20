"use client"

import { motion } from "framer-motion"
import { Button } from "~/components/ui/button"

// Swiss Flag SVG Component
const SwissFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#FF0000" rx="20" ry="20" />
    <rect x="13" y="6" width="6" height="20" fill="white" />
    <rect x="6" y="13" width="20" height="6" fill="white" />
  </svg>
)

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-green-500/10 border border-purple-500/20 backdrop-blur-sm"
            >
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">
                next level trading
              </span>
              <span className="ml-2">🚀</span>
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 ">
              Die Zukunft der Kryptowährungen beginnt hier!
            </h1>
                          <SwissFlag className="w-6 h-6 inline-block" />
            <p className="text-gray-300 md:text-xl max-w-2xl mx-auto flex items-center justify-center gap-2">

              Nextrade Swiss unterstützt dich dabei, die Chancen im Kryptomarkt zu nutzen und gleichzeitig Risiken zu
              minimieren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
             <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 border-gray-700 text-white hover:bg-gray-800 transition-all duration-300 bg-black"
                  onClick={() => {
                    const element = document.getElementById("bingx")
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
                  Trading Übersicht
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 border-gray-700 text-white hover:bg-gray-800 transition-all duration-300 bg-black"
                  onClick={() => {
                    const element = document.getElementById("nachrichten")
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
                  Wichtige Informationen
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
