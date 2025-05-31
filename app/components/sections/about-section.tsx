"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          {/* Texto */}
          <div className="space-y-6">
            <div>
         
              <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400 mb-4"> Über mich</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                Meine Trading-Reise
              </h2>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Ich bin ein Kryptowährungs-Trader mit über 5 Jahren Erfahrung in digitalen Märkten. Meine Leidenschaft
                für Blockchain-Technologie und technische Analyse hat mich dazu gebracht, innovative Strategien zu
                entwickeln, die Marktintuition mit fortschrittlichen technologischen Tools kombinieren.
              </p>

              <p>
                Im Laufe meiner Karriere habe ich mehrere Marktzyklen durchlaufen, von den aufregendsten Bullenmärkten
                bis zu den herausforderndsten Bärenmärkten. Diese Erfahrung hat mir die Bedeutung von Risikomanagement
                und Disziplin im Trading gelehrt.
              </p>

              <p>
                Mein Ansatz basiert auf tiefgreifender technischer Analyse, emotionalem Management und dem Einsatz
                automatisierter Technologien zur Optimierung von Operationen. Ich glaube fest daran, dass Erfolg im
                Trading aus der perfekten Kombination von Wissen, Erfahrung und Technologie entsteht.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-blue-400">
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">5+ Jahre Erfahrung</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">Algorithmisches Trading</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">Erweiterte technische Analyse</span>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl transform rotate-3 scale-105 blur-xl opacity-30"></div>
              <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                <img
                  src="/eeec3693-d0d9-4a22-9bb4-e9ae22047f2c.jpg"
                  alt="Professioneller Trader"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent h-1/3"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm">
                    "Erfolgreiches Trading ist 20% Technik und 80% Psychologie"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
