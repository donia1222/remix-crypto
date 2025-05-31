"use client"

import { motion } from "framer-motion"
import { Button } from "~/components/ui/button"

export default function PricingSection() {
  // Function to handle button click and open email
  const handlePlanClick = (planTitle: string) => {
    const subject = encodeURIComponent(`Anfrage zum ${planTitle}-Plan`)
    const body = encodeURIComponent(`Hallo NextTrade-Team,

Ich interessiere mich für Ihren ${planTitle}-Plan und hätte gerne weitere Informationen.

Mit freundlichen Grüßen`)

    window.location.href = `mailto:info@nextrade.ch?subject=${subject}&body=${body}`
  }

  return (
    <section id="preise" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white mb-2">Transparente Preise</h2>
            <p className="max-w-[700px] text-gray-300">
              Wählen Sie den Plan, der am besten zu Ihren Handelsbedürfnissen passt.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3">
          {[
            {
              title: "Basis",
              description: "Für Anfänger 🥺",
              price: "0 CHF",
              period: "/Monat",
              features: ["Erweiterter Zugriff auf Transaktionen", "Grafik Gewinn/Verlust der letzten 7 Tage"],
              buttonText: "Kostenlos starten",
              popular: false,
            },
            {
              title: "Pro",
              description: "Für aktive Trader 📊",
              price: "29 CHF",
              period: "/Monat",
              features: [
                "Alles vom Basisplan",
                "Fortgeschrittene technische Analyse",
                "Reduzierte Gebühren",
                "Prioritätssupport",
                "Trading-API",
                "Preisalarme",
              ],
              buttonText: "Jetzt abonnieren",
              popular: true,
            },
            {
              title: "Unternehmen",
              description: "Für Institutionen 🏦",
              price: "99 CHF",
              period: "/Monat",
              features: [
                "Alles vom Pro-Plan",
                "Dedizierte API",
                "Minimale Gebühren",
                "Persönlicher Account Manager",
                "Dedizierte Infrastruktur",
                "Vollständige Anpassung",
                "24/7-Support",
              ],
              buttonText: "Vertrieb kontaktieren",
              popular: false,
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`flex h-full flex-col rounded-lg border ${
                plan.popular ? "border-cyan-600" : "border-gray-800"
              } p-6 bg-gray-800/50 relative transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-cyan-600 px-3 py-1 text-xs font-medium text-black">
                  Beliebt
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                <p className="text-gray-300">{plan.description}</p>
              </div>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="ml-1 text-gray-300">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-cyan-400 shrink-0"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  } transition-all duration-300`}
                  onClick={() => handlePlanClick(plan.title)}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
