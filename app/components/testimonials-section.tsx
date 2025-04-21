"use client"

import { motion } from "framer-motion"

// Data for the testimonials section
const testimonials = [
  {
    id: 1,
    name: "Thomas Müller",
    role: "Professioneller Trader",
    quote:
      "Krypto hat meine Art zu handeln verändert. Die Plattform ist schnell, intuitiv und bietet mir alle Werkzeuge, die ich für fundierte Entscheidungen benötige.",
    avatar: "/images/avatar-1.jpg",
  },
  {
    id: 2,
    name: "Laura Schneider",
    role: "Privatanlegerin",
    quote:
      "Als Anfängerin in der Welt der Kryptowährungen hat mir Krypto den Lern- und Investitionsprozess erheblich erleichtert. Die Benutzeroberfläche ist sehr benutzerfreundlich.",
    avatar: "/images/avatar-2.jpg",
  },
  {
    id: 3,
    name: "Michael Brunner",
    role: "Finanzvorstand",
    quote:
      "Unser Unternehmen nutzt Krypto, um einen Teil unseres Portfolios zu verwalten. Die Sicherheit und Zuverlässigkeit der Plattform geben uns die nötige Ruhe.",
    avatar: "/images/avatar-3.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-black">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
              Was unsere Benutzer sagen
            </h2>
            <p className="max-w-[700px] text-gray-300">
              Tausende von Tradern vertrauen Krypto für ihre täglichen Geschäfte. Entdecken Sie warum.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative"
            >
              <div className="absolute -top-5 left-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                  "
                </div>
              </div>
              <div className="pt-4">
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
