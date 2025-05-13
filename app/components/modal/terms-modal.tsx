"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  type: "terms" | "privacy"
}

export default function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
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
            className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {type === "terms" ? "Nutzungsbedingungen" : "Datenschutzrichtlinie"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto text-gray-300 space-y-6 text-sm md:text-base">
              {type === "terms" ? <TermsContent /> : <PrivacyContent />}
            </div>
            <div className="p-4 md:p-6 border-t border-gray-800 bg-gray-900 sticky bottom-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Ich stimme zu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TermsContent() {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">1. Einführung</h3>
        <p>
          Willkommen bei unserer Krypto-Trading-Plattform. Diese Nutzungsbedingungen regeln Ihre Nutzung unserer
          Website, Dienste und Anwendungen (zusammen als "Plattform" bezeichnet). Durch die Nutzung unserer Plattform
          erklären Sie sich mit diesen Bedingungen einverstanden.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">2. Kontoeröffnung und -sicherheit</h3>
        <p>
          Um unsere Plattform nutzen zu können, müssen Sie ein Konto eröffnen. Sie sind für die Sicherheit Ihrer
          Anmeldedaten verantwortlich und müssen uns über jede unbefugte Nutzung Ihres Kontos informieren. Wir behalten
          uns das Recht vor, Konten zu schließen oder zu sperren, die gegen unsere Bedingungen verstoßen.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">3. Handelsrisiken</h3>
        <p>
          Der Handel mit Kryptowährungen ist mit erheblichen Risiken verbunden. Sie sollten nur mit Mitteln handeln,
          deren Verlust Sie sich leisten können. Vergangene Wertentwicklungen sind kein Indikator für zukünftige
          Ergebnisse. Sie bestätigen, dass Sie die mit dem Kryptowährungshandel verbundenen Risiken verstehen und
          akzeptieren.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">4. Handelsgebühren</h3>
        <p>
          Für die Nutzung unserer Plattform fallen Gebühren an. Die aktuellen Gebühren sind auf unserer Website
          aufgeführt. Wir behalten uns das Recht vor, unsere Gebührenstruktur jederzeit zu ändern, wobei wir Sie über
          solche Änderungen informieren werden.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">5. Marktmanipulation</h3>
        <p>
          Jede Form von Marktmanipulation, einschließlich, aber nicht beschränkt auf Pump-and-Dump-Schemata, Wash
          Trading oder Spoofing, ist strengstens untersagt. Wir behalten uns das Recht vor, Konten zu sperren und
          Gewinne einzubehalten, die durch manipulative Praktiken erzielt wurden.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">6. KYC und AML-Compliance</h3>
        <p>
          Wir sind verpflichtet, Know-Your-Customer (KYC) und Anti-Money-Laundering (AML) Vorschriften einzuhalten. Sie
          müssen möglicherweise Identitätsnachweise und andere Informationen vorlegen, um bestimmte Funktionen unserer
          Plattform nutzen zu können. Die Verweigerung der Bereitstellung dieser Informationen kann zur Einschränkung
          Ihres Kontos führen.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">7. Steuern</h3>
        <p>
          Sie sind allein verantwortlich für die Ermittlung, ob und in welcher Höhe Steuern auf Ihre Handelsaktivitäten
          anfallen. Wir bieten keine Steuerberatung an und empfehlen Ihnen, einen qualifizierten Steuerberater zu
          konsultieren.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">8. Haftungsbeschränkung</h3>
        <p>
          Unsere Plattform wird "wie besehen" und "wie verfügbar" bereitgestellt. Wir übernehmen keine Garantie für die
          Genauigkeit, Vollständigkeit oder Zuverlässigkeit unserer Plattform. In keinem Fall haften wir für indirekte,
          zufällige, besondere oder Folgeschäden, die aus Ihrer Nutzung unserer Plattform entstehen.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">9. Änderungen der Bedingungen</h3>
        <p>
          Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Wir werden Sie über wesentliche
          Änderungen informieren. Ihre fortgesetzte Nutzung unserer Plattform nach solchen Änderungen stellt Ihre
          Annahme der aktualisierten Bedingungen dar.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">10. Geltendes Recht</h3>
        <p>
          Diese Nutzungsbedingungen unterliegen den Gesetzen der Schweiz und werden in Übereinstimmung mit diesen
          ausgelegt, ohne Berücksichtigung von Kollisionsnormen.
        </p>
      </div>
    </>
  )
}

function PrivacyContent() {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">1. Einleitung</h3>
        <p>
          Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzrichtlinie informiert Sie darüber, wie
          wir Ihre personenbezogenen Daten sammeln, verwenden und schützen, wenn Sie unsere Krypto-Trading-Plattform
          nutzen.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">2. Gesammelte Informationen</h3>
        <p>Wir sammeln verschiedene Arten von Informationen, darunter:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Persönliche Identifikationsdaten (Name, E-Mail, Telefonnummer)</li>
          <li>KYC-Informationen (Ausweisdokumente, Adressnachweis)</li>
          <li>Finanzinformationen (Transaktionshistorie, Wallet-Adressen)</li>
          <li>Nutzungsdaten (IP-Adresse, Browsertyp, besuchte Seiten)</li>
          <li>Kommunikationsdaten (Support-Anfragen, Feedback)</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">3. Verwendung Ihrer Daten</h3>
        <p>Wir verwenden Ihre Daten für folgende Zwecke:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Bereitstellung und Verbesserung unserer Dienste</li>
          <li>Verarbeitung von Transaktionen und Verwaltung Ihres Kontos</li>
          <li>Einhaltung von KYC- und AML-Vorschriften</li>
          <li>Kommunikation mit Ihnen über Updates und Angebote</li>
          <li>Betrugsbekämpfung und Sicherheit der Plattform</li>
          <li>Analyse und Verbesserung der Benutzerfreundlichkeit</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">4. Datenspeicherung</h3>
        <p>
          Wir speichern Ihre personenbezogenen Daten so lange, wie es für die Erfüllung der in dieser
          Datenschutzrichtlinie beschriebenen Zwecke erforderlich ist, es sei denn, eine längere Aufbewahrungsfrist ist
          gesetzlich vorgeschrieben oder erlaubt.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">5. Datenweitergabe</h3>
        <p>Wir können Ihre Daten mit folgenden Parteien teilen:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Dienstleister, die uns bei der Bereitstellung unserer Dienste unterstützen</li>
          <li>Finanzinstitute für die Verarbeitung von Transaktionen</li>
          <li>Behörden, wenn dies gesetzlich vorgeschrieben ist</li>
          <li>Geschäftspartner für bestimmte Dienste (mit Ihrer Zustimmung)</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">6. Datensicherheit</h3>
        <p>
          Wir implementieren angemessene technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten vor
          unbefugtem Zugriff, Verlust oder Beschädigung zu schützen. Trotz unserer Bemühungen kann keine Methode der
          Übertragung über das Internet oder der elektronischen Speicherung als 100% sicher angesehen werden.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">7. Ihre Rechte</h3>
        <p>Je nach geltendem Recht haben Sie möglicherweise folgende Rechte:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Zugang zu Ihren personenbezogenen Daten</li>
          <li>Berichtigung ungenauer Daten</li>
          <li>Löschung Ihrer Daten unter bestimmten Umständen</li>
          <li>Einschränkung der Verarbeitung Ihrer Daten</li>
          <li>Datenübertragbarkeit</li>
          <li>Widerspruch gegen die Verarbeitung Ihrer Daten</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">8. Cookies und Tracking</h3>
        <p>
          Wir verwenden Cookies und ähnliche Tracking-Technologien, um Informationen über Ihre Aktivitäten auf unserer
          Plattform zu sammeln. Sie können Ihre Browser-Einstellungen ändern, um Cookies zu blockieren oder zu löschen,
          aber dies kann die Funktionalität unserer Plattform beeinträchtigen.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">9. Änderungen dieser Richtlinie</h3>
        <p>
          Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche
          Änderungen informieren, indem wir die aktualisierte Version auf unserer Website veröffentlichen oder Ihnen
          eine Benachrichtigung senden.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">10. Kontakt</h3>
        <p>
          Wenn Sie Fragen oder Bedenken bezüglich dieser Datenschutzrichtlinie oder unserer Datenschutzpraktiken haben,
          kontaktieren Sie uns bitte unter datenschutz@nextrade.ch.
        </p>
      </div>
    </>
  )
}
