"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDownUp, Clock, TrendingUp, TrendingDown, Loader2, RefreshCw, Filter } from "lucide-react"
import crypto from "crypto"

// Definir tipos para las transacciones
interface Transaction {
  id: string
  symbol: string
  side: string
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyer: boolean
  isMaker: boolean
  fee: string
  feeAsset: string
  realizedProfit: string
}

export default function BingXTransactionsSection() {
  // IMPORTANTE: Reemplaza estos valores con tus credenciales reales de BingX
  const BINGX_API_KEY = "TU_API_KEY_AQUI"
  const BINGX_API_SECRET = "TU_API_SECRET_AQUI"

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("7d")
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Función para obtener la firma HMAC
  function getSignature(queryString: string, apiSecret: string): string {
    return crypto.createHmac("sha256", apiSecret).update(queryString).digest("hex")
  }

  // Función para formatear fechas
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Función para formatear números con separador de miles
  const formatNumber = (numStr: string | number, decimals = 6) => {
    const num = typeof numStr === "string" ? Number.parseFloat(numStr) : numStr
    if (isNaN(num)) return "0.00"

    return num.toLocaleString("de-CH", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  // Función para obtener las transacciones de BingX
  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Verificar que las credenciales existan
      if (!BINGX_API_KEY || !BINGX_API_SECRET || BINGX_API_KEY === "TU_API_KEY_AQUI") {
        throw new Error("API-Anmeldeinformationen nicht konfiguriert")
      }

      // Calcular el timestamp de inicio según el timeframe seleccionado
      const now = Date.now()
      let startTime = now

      switch (timeframe) {
        case "24h":
          startTime = now - 24 * 60 * 60 * 1000 // 24 horas
          break
        case "7d":
          startTime = now - 7 * 24 * 60 * 60 * 1000 // 7 días
          break
        case "30d":
          startTime = now - 30 * 24 * 60 * 60 * 1000 // 30 días
          break
        case "90d":
          startTime = now - 90 * 24 * 60 * 60 * 1000 // 90 días
          break
      }

      // Preparar parámetros para la solicitud
      const timestamp = Date.now()
      const recvWindow = 60000 // 60 segundos
      const limit = 20 // Número de transacciones a obtener

      // Construir la cadena de consulta
      const queryParams = new URLSearchParams({
        timestamp: timestamp.toString(),
        recvWindow: recvWindow.toString(),
        limit: limit.toString(),
        // Puedes añadir startTime si la API lo soporta
        // startTime: startTime.toString(),
      })

      const queryString = queryParams.toString()
      const signature = getSignature(queryString, BINGX_API_SECRET)

      // URL base de la API de BingX
      const baseUrl = "https://open-api.bingx.com"

      // Endpoint para obtener las transacciones cerradas
      // Nota: Este endpoint puede variar según la documentación actual de BingX
      const endpoint = "/openApi/spot/v1/trade/myTrades"

      const url = `${baseUrl}${endpoint}?${queryString}&signature=${signature}`

      // Realizar la solicitud a la API de BingX
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-BX-APIKEY": BINGX_API_KEY,
          "Content-Type": "application/json",
        },
      })

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json()
        console.error("BingX API error:", errorData)
        throw new Error(`Fehler beim Abrufen der Transaktionen: ${JSON.stringify(errorData)}`)
      }

      // Procesar la respuesta
      const data = await response.json()

      // Si no hay datos o la respuesta no es un array, devolver un array vacío
      if (!data || !Array.isArray(data)) {
        setTransactions([])
        return
      }

      // Formatear las transacciones para la respuesta
      const formattedTransactions = data.map((tx: any) => ({
        id: tx.id,
        symbol: tx.symbol,
        side: tx.side,
        price: tx.price,
        qty: tx.qty,
        quoteQty: tx.quoteQty,
        time: tx.time,
        isBuyer: tx.isBuyer,
        isMaker: tx.isMaker,
        fee: tx.fee,
        feeAsset: tx.feeAsset,
        realizedProfit: tx.realizedProfit || "0",
      }))

      // Filtrar por timeframe si la API no lo soporta
      const filteredTransactions = formattedTransactions.filter((tx) => new Date(tx.time).getTime() >= startTime)

      setTransactions(filteredTransactions)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err instanceof Error ? err.message : "Unbekannter Fehler")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar transacciones al montar el componente y cuando cambia el timeframe
  useEffect(() => {
    fetchTransactions()
  }, [timeframe])

  // Manejar cambio de timeframe
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    setSelectedTimeframe(value)
    setIsTimeframeOpen(false)
  }

  // Mapeo de valores de timeframe a textos en alemán
  const timeframeLabels: Record<string, string> = {
    "24h": "Letzte 24 Stunden",
    "7d": "Letzte 7 Tage",
    "30d": "Letzte 30 Tage",
    "90d": "Letzte 90 Tage",
  }

  return (
    <section id="meine-transaktionen" className="w-full py-12 md:py-24 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400 mb-4">BingX</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
            Meine BingX-Transaktionen
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-400">
            Hier zeige ich meine abgeschlossenen Transaktionen, die ich für meine Handelsstrategie nutze.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            {/* Custom Select Component */}
            <div className="relative">
              <button
                onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                className="w-[180px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white flex items-center justify-between"
              >
                <span>{timeframeLabels[selectedTimeframe] || "Zeitraum auswählen"}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isTimeframeOpen ? "transform rotate-180" : ""}`}
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
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isTimeframeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  <div className="py-1">
                    {Object.entries(timeframeLabels).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => handleTimeframeChange(value)}
                        className="w-full px-3 py-2 text-left text-white hover:bg-gray-700"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => fetchTransactions()}
              className="p-2 rounded-md border border-gray-700 text-white hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Aktualisieren</span>
            </button>
          </div>

          <button className="px-4 py-2 rounded-md border border-gray-700 text-white hover:bg-gray-800 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtern
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mb-4" />
              <p className="text-gray-400">Meine Transaktionen werden geladen...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-red-500"
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={() => fetchTransactions()}
                className="px-4 py-2 rounded-md border border-gray-700 text-white hover:bg-gray-800"
              >
                Erneut versuchen
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ArrowDownUp className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 mb-2">Keine Transaktionen in diesem Zeitraum gefunden</p>
              <button
                onClick={() => setTimeframe("30d")}
                className="px-4 py-2 rounded-md border border-gray-700 text-white hover:bg-gray-800"
              >
                Längeren Zeitraum anzeigen
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Paar</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Typ</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Menge</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Preis</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Gesamt</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Gebühr</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Gewinn</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 align-middle font-medium text-white">{tx.symbol}</td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.side === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.side === "BUY" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {tx.side === "BUY" ? "KAUF" : "VERKAUF"}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-gray-300">{formatNumber(tx.qty)}</td>
                      <td className="p-4 align-middle text-gray-300">{formatNumber(tx.price, 2)}</td>
                      <td className="p-4 align-middle text-gray-300">{formatNumber(tx.quoteQty, 2)}</td>
                      <td className="p-4 align-middle text-gray-400">
                        {formatNumber(tx.fee)} {tx.feeAsset}
                      </td>
                      <td className="p-4 align-middle">
                        <span
                          className={
                            Number.parseFloat(tx.realizedProfit) > 0
                              ? "text-green-400"
                              : Number.parseFloat(tx.realizedProfit) < 0
                                ? "text-red-400"
                                : "text-gray-400"
                          }
                        >
                          {Number.parseFloat(tx.realizedProfit) > 0 ? "+" : ""}
                          {formatNumber(tx.realizedProfit, 2)}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-gray-400">
                        <div className="flex items-center">
                          <Clock className="mr-1.5 h-3 w-3" />
                          {formatDate(tx.time)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {lastUpdated && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Meine Daten zuletzt aktualisiert: {lastUpdated.toLocaleTimeString("de-CH")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
