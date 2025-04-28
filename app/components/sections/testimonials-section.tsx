"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

// Tipo para los testimonios
type Testimonial = {
  id: number
  name: string
  position: string
  company: string
  rating: number
  text: string
  location: string
  date: string
}

// Función para generar testimonios aleatorios
const generateTestimonials = (count: number): Testimonial[] => {
  const names = [
    "Michael Schmidt",
    "Anna Müller",
    "Thomas Weber",
    "Laura Fischer",
    "Markus Wagner",
    "Sophie Becker",
    "Felix Hoffmann",
    "Julia Schneider",
    "Lukas Meyer",
    "Lena Schulz",
    "Tobias Koch",
    "Nina Richter",
    "David Bauer",
    "Lisa Wolf",
    "Philipp Schäfer",
    "Emma Neumann",
    "Jonas Schwarz",
    "Sophia Zimmermann",
    "Tim Krause",
    "Hannah König",
    "Sebastian Lang",
    "Mia Huber",
    "Maximilian Fuchs",
    "Johanna Schmitt",
    "Niklas Braun",
    "Lara Keller",
    "Alexander Vogel",
    "Leonie Frank",
    "Julian Berger",
    "Emilia Roth",
    "Fabian Winter",
    "Amelie Schubert",
    "Paul Sommer",
    "Antonia Schuster",
    "Moritz Krüger",
    "Victoria Hofmann",
    "Elias Meier",
    "Charlotte Lehmann",
    "Ben Walter",
    "Klara Hartmann",
    "Oskar Schmid",
    "Ida Maier",
    "Henry Beck",
    "Matilda Stein",
    "Vincent Brandt",
    "Frieda Lorenz",
    "Leonard Haas",
    "Ella Pfeiffer",
    "Anton Möller",
    "Greta Wolff",
    "Hugo Köhler",
    "Mathilda Jäger",
    "Emil Bergmann",
    "Pauline Schulze",
    "Theo Herrmann",
    "Lina Schreiber",
  ]

  const positions = [
    "Privatanleger",
    "Finanzberater",
    "Krypto-Enthusiast",
    "Investor",
    "Trader",
    "Finanzanalyst",
    "Portfolio-Manager",
    "Unternehmer",
    "Geschäftsführer",
    "Berater",
  ]

  const companies = [
    "Deutsche Bank",
    "Commerzbank",
    "Allianz",
    "Munich Re",
    "Siemens",
    "SAP",
    "Deutsche Telekom",
    "Volkswagen",
    "BMW",
    "Daimler",
    "Bayer",
    "BASF",
    "Adidas",
    "Puma",
    "Lufthansa",
    "TUI",
    "Fresenius",
    "Henkel",
    "RWE",
    "E.ON",
    "Selbstständig",
    "Privatinvestor",
    "Finanzberatung GmbH",
    "Vermögensverwaltung AG",
  ]

  const locations = [
    "Berlin",
    "München",
    "Hamburg",
    "Köln",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Leipzig",
    "Nürnberg",
    "Hannover",
    "Dresden",
    "Bonn",
    "Münster",
    "Karlsruhe",
    "Mannheim",
    "Freiburg",
    "Aachen",
    "Augsburg",
    "Wiesbaden",
    "Zürich",
    "Wien",
    "Bern",
    "Basel",
    "Genf",
    "Salzburg",
  ]

  const testimonialTexts = [
    "Diese Krypto-Plattform hat meine Erwartungen übertroffen. Die Echtzeit-Daten und die benutzerfreundliche Oberfläche machen das Trading zum Vergnügen.",
    "Ich bin beeindruckt von der Geschwindigkeit und Zuverlässigkeit dieser Plattform. Die Marktdaten sind immer aktuell und die Ausführung ist blitzschnell.",
    "Als langjähriger Krypto-Investor habe ich schon viele Plattformen ausprobiert, aber diese hier ist mit Abstand die beste. Die Benutzeroberfläche ist intuitiv und die Gebühren sind fair.",
    "Die Echtzeit-Charts und Analysetools haben mir geholfen, meine Handelsstrategien zu verbessern. Ich konnte meine Rendite in nur wenigen Monaten verdoppeln.",
    "Was mich besonders beeindruckt, ist der ausgezeichnete Kundensupport. Jedes Mal, wenn ich eine Frage hatte, bekam ich sofort eine hilfreiche Antwort.",
    "Die mobile App ist fantastisch! Ich kann mein Portfolio unterwegs überwachen und habe alle wichtigen Funktionen immer zur Hand.",
    "Die Sicherheitsmaßnahmen dieser Plattform geben mir ein beruhigendes Gefühl. Ich weiß, dass meine Investitionen gut geschützt sind.",
    "Die Vielfalt der handelbaren Kryptowährungen ist beeindruckend. Ich finde hier alles, von Bitcoin bis zu den neuesten vielversprechenden Altcoins.",
    "Die Einzahlungs- und Auszahlungsprozesse sind unkompliziert und schnell. Das Geld ist immer pünktlich auf meinem Konto.",
    "Die Bildungsressourcen auf dieser Plattform haben mir geholfen, mein Wissen über Kryptowährungen zu vertiefen und bessere Investitionsentscheidungen zu treffen.",
    "Die Plattform bietet eine perfekte Balance zwischen fortschrittlichen Features für erfahrene Trader und Einfachheit für Anfänger.",
    "Ich schätze die Transparenz dieser Plattform sehr. Alle Gebühren sind klar dargestellt, und es gibt keine versteckten Kosten.",
    "Die Integration mit anderen Finanztools und Steuer-Software hat mir die Verwaltung meines Portfolios erheblich erleichtert.",
    "Die Community-Features wie Foren und Chatgruppen haben mir geholfen, von anderen Investoren zu lernen und wertvolle Einblicke zu gewinnen.",
    "Die regelmäßigen Updates und neuen Features zeigen, dass das Team ständig daran arbeitet, die Plattform zu verbessern.",
    "Die Möglichkeit, Kryptowährungen zu staken und passive Einkünfte zu generieren, hat meine Anlagestrategie revolutioniert.",
    "Die Benachrichtigungsfunktionen halten mich über wichtige Marktbewegungen auf dem Laufenden, sodass ich keine Gelegenheit verpasse.",
    "Die Plattform läuft stabil, auch bei hoher Marktvolatilität, wenn andere Börsen oft zusammenbrechen.",
    "Die Möglichkeit, verschiedene Charttypen und technische Indikatoren zu nutzen, hilft mir, fundierte Handelsentscheidungen zu treffen.",
    "Der Verifizierungsprozess war schnell und unkompliziert, im Gegensatz zu vielen anderen Plattformen, bei denen es Wochen dauern kann.",
    "Die API-Funktionalität ermöglicht es mir, meine eigenen Handelsstrategien zu automatisieren und rund um die Uhr zu handeln.",
    "Die Plattform bietet eine hervorragende Liquidität, selbst für weniger bekannte Kryptowährungen, was den Handel reibungslos macht.",
    "Die Möglichkeit, Limit-Orders und Stop-Loss-Orders zu setzen, gibt mir mehr Kontrolle über meine Trades und reduziert das Risiko.",
    "Die Benutzeroberfläche ist nicht nur funktional, sondern auch ästhetisch ansprechend gestaltet, was das Trading-Erlebnis angenehmer macht.",
    "Die Plattform bietet regelmäßig Promotionen und Boni an, die mir geholfen haben, meine Rendite zu steigern.",
    "Die Möglichkeit, ein Demo-Konto zu nutzen, bevor ich echtes Geld investiere, war für mich als Anfänger sehr wertvoll.",
    "Die Plattform unterstützt mehrere Sprachen und Währungen, was sie für internationale Nutzer wie mich sehr zugänglich macht.",
    "Die Zusammenarbeit mit renommierten Banken und Finanzinstituten gibt mir Vertrauen in die Seriosität dieser Plattform.",
    "Die regelmäßigen Marktanalysen und Berichte des Research-Teams haben mir geholfen, fundierte Investitionsentscheidungen zu treffen.",
    "Die Plattform bietet eine breite Palette von Zahlungsmethoden an, was Ein- und Auszahlungen sehr bequem macht.",
    "Die Möglichkeit, mein Portfolio zu diversifizieren und in verschiedene Krypto-Assets zu investieren, hat mir geholfen, mein Risiko zu streuen.",
    "Die Plattform hat eine intuitive Benutzeroberfläche, die es auch Anfängern leicht macht, mit dem Krypto-Trading zu beginnen.",
    "Die Skalierbarkeit der Plattform ist beeindruckend. Selbst bei hohem Handelsvolumen bleibt alles schnell und reaktionsschnell.",
    "Die Möglichkeit, Kryptowährungen direkt zu kaufen, ohne komplizierte Börsenaufträge, war für mich als Einsteiger sehr hilfreich.",
    "Die Plattform bietet detaillierte Berichte über meine Handelsaktivitäten, was die Steuererklärung erheblich erleichtert.",
    "Die Integration mit Hardware-Wallets erhöht die Sicherheit meiner Kryptowährungen erheblich.",
    "Die Plattform hat mir geholfen, meine langfristigen Anlageziele zu erreichen und für meine Zukunft vorzusorgen.",
    "Die Möglichkeit, Kryptowährungen zu leihen und zu verleihen, bietet zusätzliche Einkommensmöglichkeiten, die ich sehr schätze.",
    "Die Plattform hat eine aktive und hilfsbereite Community, die immer bereit ist, Fragen zu beantworten und Erfahrungen zu teilen.",
    "Die regelmäßigen Webinare und Bildungsveranstaltungen haben mir geholfen, mein Wissen über Kryptowährungen zu erweitern.",
    "Die Plattform bietet eine hervorragende Mischung aus Benutzerfreundlichkeit und fortschrittlichen Funktionen für erfahrene Trader.",
    "Die Möglichkeit, Kryptowährungen zu spenden und für wohltätige Zwecke zu nutzen, hat mir einen neuen Blick auf die Verwendung digitaler Assets gegeben.",
    "Die Plattform hat eine transparente Gebührenstruktur, die es mir ermöglicht, meine Handelskosten genau zu kalkulieren.",
    "Die Möglichkeit, mein Portfolio in Echtzeit zu überwachen, gibt mir ein Gefühl der Kontrolle über meine Investitionen.",
    "Die Plattform bietet eine breite Palette von Ordertypen, die es mir ermöglichen, meine Handelsstrategien genau umzusetzen.",
    "Die Integration mit Steuer-Software hat mir geholfen, den Überblick über meine Krypto-Steuern zu behalten.",
    "Die Plattform hat eine robuste Infrastruktur, die auch bei hoher Marktvolatilität zuverlässig funktioniert.",
    "Die Möglichkeit, Kryptowährungen zu staken und passive Einkünfte zu generieren, hat meine Anlagestrategie bereichert.",
    "Die Plattform bietet regelmäßige Updates und neue Features, die das Benutzererlebnis kontinuierlich verbessern.",
    "Die Sicherheitsmaßnahmen wie Zwei-Faktor-Authentifizierung und kalte Speicherung geben mir ein beruhigendes Gefühl.",
    "Die Plattform hat eine benutzerfreundliche mobile App, die es mir ermöglicht, mein Portfolio unterwegs zu verwalten.",
    "Die Möglichkeit, Kryptowährungen zu kaufen, zu verkaufen und zu tauschen, alles auf einer Plattform, spart mir viel Zeit.",
    "Die Plattform bietet detaillierte Marktanalysen und Echtzeit-Daten, die mir helfen, fundierte Handelsentscheidungen zu treffen.",
    "Die Möglichkeit, mit Fiat-Währungen ein- und auszuzahlen, macht den Einstieg in die Krypto-Welt viel einfacher.",
    "Die Plattform hat mir geholfen, mein Vermögen zu diversifizieren und mich gegen Inflation zu schützen.",
    "Die Benutzeroberfläche ist intuitiv gestaltet und macht das Trading auch für Anfänger zugänglich.",
    "Die Plattform bietet eine Vielzahl von Tools und Ressourcen, die mir helfen, meine Handelsstrategien zu optimieren.",
  ]

  const dates = [
    "Januar 2023",
    "Februar 2023",
    "März 2023",
    "April 2023",
    "Mai 2023",
    "Juni 2023",
    "Juli 2023",
    "August 2023",
    "September 2023",
    "Oktober 2023",
    "November 2023",
    "Dezember 2023",
    "Januar 2024",
    "Februar 2024",
    "März 2024",
    "April 2024",
  ]

  return Array.from({ length: count }, (_, i) => {
    const nameIndex = i % names.length
    const name = names[nameIndex]
    const gender = nameIndex % 2 === 0 ? "male" : "female"

    return {
      id: i + 1,
      name,
      position: positions[Math.floor(Math.random() * positions.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      rating: 4 + Math.floor(Math.random() * 2), // 4 o 5 estrellas
      text: testimonialTexts[i % testimonialTexts.length],
      location: locations[Math.floor(Math.random() * locations.length)],
      date: dates[Math.floor(Math.random() * dates.length)],
    }
  })
}

// Generar 56 testimonios
const testimonials = generateTestimonials(56)

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([])
  const testimonialsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  // Función para actualizar los testimonios visibles
  const updateVisibleTestimonials = (index: number) => {
    const startIndex = index * testimonialsPerPage
    const endIndex = Math.min(startIndex + testimonialsPerPage, testimonials.length)
    setVisibleTestimonials(testimonials.slice(startIndex, endIndex))
  }

  // Inicializar testimonios visibles
  useEffect(() => {
    updateVisibleTestimonials(activeIndex)
  }, [activeIndex])

  // Navegar a la página anterior
  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages)
  }

  // Navegar a la página siguiente
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalPages)
  }

  return (
    <section id="testimonials" className="w-full py-16 md:py-24 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Kundenstimmen</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Was unsere Kunden sagen
            </h2>
            <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed">
              Erfahren Sie, wie unsere Plattform Tausenden von Anlegern hilft, ihre Krypto-Investitionen zu optimieren.
            </p>
          </motion.div>
        </div>

        {/* Testimonios para pantallas medianas y grandes */}
        <div className="hidden md:block relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {visibleTestimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (testimonial.id % testimonialsPerPage) * 0.1 }}
                  className="flex flex-col h-full p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="relative flex-grow mb-4">
                    <Quote className="absolute top-0 left-0 w-8 h-8 text-purple-500/20 -translate-x-2 -translate-y-2" />
                    <p className="text-gray-300 relative z-10 italic">{testimonial.text}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                    <span>{testimonial.location}</span>
                    <span>{testimonial.date}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Controles de navegación */}
          <div className="flex justify-center items-center mt-10 gap-4">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              aria-label="Vorherige Testimonials"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeIndex ? "bg-purple-500 w-6" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  aria-label={`Gehe zu Seite ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              aria-label="Nächste Testimonials"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonios para móviles (uno a la vez) */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {visibleTestimonials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                      {visibleTestimonials[0].name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{visibleTestimonials[0].name}</h3>
                      <p className="text-sm text-gray-400">
                        {visibleTestimonials[0].position}, {visibleTestimonials[0].company}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < visibleTestimonials[0].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="relative mb-4">
                    <Quote className="absolute top-0 left-0 w-8 h-8 text-purple-500/20 -translate-x-2 -translate-y-2" />
                    <p className="text-gray-300 relative z-10 italic">{visibleTestimonials[0].text}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                    <span>{visibleTestimonials[0].location}</span>
                    <span>{visibleTestimonials[0].date}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controles de navegación móvil */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              aria-label="Vorheriges Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Para móviles, mostrar solo 5 indicadores con "..." si hay más
                const showDots = totalPages > 5 && i === 4
                const actualIndex = showDots ? null : i
                const isActive = !showDots && activeIndex === i

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (!showDots) {
                        setActiveIndex(i)
                      }
                    }}
                    className={`${
                      showDots
                        ? "text-gray-500 text-xs px-1"
                        : isActive
                          ? "bg-purple-500 w-5 h-2 rounded-full"
                          : "bg-gray-700 hover:bg-gray-600 w-2 h-2 rounded-full"
                    } transition-all`}
                    aria-label={showDots ? "Mehr Seiten" : `Gehe zu Seite ${i + 1}`}
                  >
                    {showDots ? "..." : ""}
                  </button>
                )
              })}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              aria-label="Nächstes Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Estadísticas de clientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 text-center"
        >
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
            <p className="text-gray-400 text-sm">Zufriedene Kunden</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9/5</div>
            <p className="text-gray-400 text-sm">Durchschnittliche Bewertung</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <p className="text-gray-400 text-sm">Kundensupport</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">150K+</div>
            <p className="text-gray-400 text-sm">Aktive Nutzer</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            Schließen Sie sich Tausenden zufriedener Kunden an
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Erleben Sie selbst, warum so viele Anleger uns vertrauen und starten Sie noch heute mit Ihrer Krypto-Reise.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium"
          >
            Jetzt registrieren
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
