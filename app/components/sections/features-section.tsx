"use client"

import { motion } from "framer-motion"
import { BarChart3, Lock, Zap, Globe, TrendingUp, Shield, Users, RefreshCw } from "lucide-react"

export default function FeaturesSection() {
  return (
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
              Unsere Plattform bietet fortschrittliche Tools und eine intuitive Benutzeroberfläche für Trader aller
              Erfahrungsstufen.
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
              description: "Hochmoderner Schutz für Ihre digitalen Vermögenswerte mit Zwei-Faktor-Authentifizierung.",
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
              description: "Richten Sie automatisierte Handelsstrategien mit unseren fortschrittlichen Tools ein.",
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
  )
}
