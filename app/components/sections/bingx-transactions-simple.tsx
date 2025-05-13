"use client"

import { useState, useEffect, useRef } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { motion } from "framer-motion"
import { Clock, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"

interface FeeEntry {
  symbol: string
  incomeType: string
  income: string
  asset: string
  info: string
  time: number
  tranId: string
  tradeId: string
}

interface BingXApiResponse {
  code?: number
  msg?: string
  data?: FeeEntry[]
}

interface CachedData {
  realizedPnL: FeeEntry[]
  timestamp: number
}

export default function BingXOverview() {
  const PNL_API = "https://web.lweb.ch/api.php"
  const FEES_API = "https://web.lweb.ch/api_fees.php"
  const RETRY_INTERVAL = 5 * 60 * 1000 // 5 minutos en milisegundos

  const [realizedPnL, setRealizedPnL] = useState<FeeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showAllPnL, setShowAllPnL] = useState(false)
  const [apiUnavailable, setApiUnavailable] = useState(false)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const ITEMS_TO_SHOW = 4

  // Función para guardar datos en localStorage
  const saveDataToCache = (pnlData: FeeEntry[]) => {
    const cacheData: CachedData = {
      realizedPnL: pnlData,
      timestamp: Date.now(),
    }
    try {
      localStorage.setItem("bingx-data-cache", JSON.stringify(cacheData))
    } catch (err) {
      console.error("Error al guardar en caché:", err)
    }
  }

  // Función para cargar datos desde localStorage
  const loadDataFromCache = (): CachedData | null => {
    try {
      const cachedDataStr = localStorage.getItem("bingx-data-cache")
      if (!cachedDataStr) return null
      return JSON.parse(cachedDataStr) as CachedData
    } catch (err) {
      console.error("Error al cargar desde caché:", err)
      return null
    }
  }

  const fetchAllData = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    setError(null)

    try {
      const [pnlRes, feeRes] = await Promise.all([
        fetch(PNL_API).then((r) => r.json()),
        fetch(FEES_API).then((r) => r.json()),
      ])

      if (pnlRes?.code !== 0) throw new Error(`Fehler in api.php: ${pnlRes.msg || "Unbekannter Fehler"}`)
      if (feeRes?.code !== 0) throw new Error(`Fehler in api_fees.php: ${feeRes.msg || "Unbekannter Fehler"}`)

      const pnlData = pnlRes.data || []
      const feesData = feeRes.data || []

      setRealizedPnL(pnlData)
      setLastUpdated(new Date())
      setApiUnavailable(false)

      // Guardar datos en caché
      saveDataToCache(pnlData)

      // Limpiar cualquier timeout de reintento existente
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    } catch (err) {
      console.error("Error al obtener datos:", err)

      // Cargar datos desde caché si la API falla
      const cachedData = loadDataFromCache()
      if (cachedData && !apiUnavailable) {
        setRealizedPnL(cachedData.realizedPnL)
        setLastUpdated(new Date(cachedData.timestamp))
        setApiUnavailable(true)

        // Programar un reintento después del intervalo
        retryTimeoutRef.current = setTimeout(() => {
          fetchAllData(false) // Intentar de nuevo sin mostrar el estado de carga
        }, RETRY_INTERVAL)
      } else if (!cachedData) {
        // Solo mostrar error si no hay datos en caché
        setError(err instanceof Error ? err.message : "Fehler beim Abrufen")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp))
  }

  const formatNumber = (numStr: string, decimals = 4) => {
    const num = Number.parseFloat(numStr)
    return isNaN(num)
      ? "0.0000"
      : num.toLocaleString("de-CH", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
  }

  const getTotal = (entries: FeeEntry[]) => {
    return entries.reduce((sum, item) => sum + Number.parseFloat(item.income), 0)
  }

  const generateChartData = (pnlData: FeeEntry[]) => {
    const format = (timestamp: number) =>
      new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" }).format(new Date(timestamp))

    const grouped: Record<string, { pnl: number }> = {}

    pnlData.forEach((item) => {
      const date = format(item.time)
      grouped[date] = grouped[date] || { pnl: 0 }
      grouped[date].pnl += Number.parseFloat(item.income)
    })

    return Object.entries(grouped).map(([date, values]) => ({
      date,
      pnl: Number.parseFloat(values.pnl.toFixed(4)),
    }))
  }

  // Cargar datos al inicio y configurar el intervalo de reintento
  useEffect(() => {
    // Mostrar datos del caché mientras esperamos la respuesta de la API
    const cachedData = loadDataFromCache()
    if (cachedData) {
      setRealizedPnL(cachedData.realizedPnL)
      setLastUpdated(new Date(cachedData.timestamp))
      // No desactivamos el estado de carga para que se vea que estamos actualizando
    }

    // Siempre hacer una llamada a la API al cargar la página
    fetchAllData(true)

    // Limpiar el timeout al desmontar
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const visiblePnL = showAllPnL ? realizedPnL : realizedPnL.slice(0, ITEMS_TO_SHOW)

  return (
    <section className="w-full py-6 md:py-10 bg-gray-950 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4 md:mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">BingX Übersicht</h2>
          <p className="text-sm md:text-base text-gray-400">Realisiertes PnL, Finanzierungs- und Handelsgebühren.</p>
        </motion.div>

        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => fetchAllData()}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded text-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Aktualisieren
          </button>

          {apiUnavailable && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>API nicht verfügbar, zeige zwischengespeicherte Daten</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-400">Fehler: {error}</p>
          </div>
        ) : (
          <>
            {/* Realized PnL */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-blue-400">Realisiertes PnL</h3>
              <p className="text-sm text-green-400 mb-2">
                Gesamt: {formatNumber(getTotal(realizedPnL).toString())} USDT
              </p>

              {/* Mobile view for PnL */}
              <div className="md:hidden space-y-3">
                {visiblePnL.map((item) => (
                  <div key={item.tranId} className="bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{item.symbol}</span>
                      <span
                        className={`${Number.parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"} font-semibold`}
                      >
                        {formatNumber(item.income)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{item.info}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.time)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop view for PnL */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">Paar</th>
                      <th className="px-4 py-2 text-left">Typ</th>
                      <th className="px-4 py-2 text-left">Betrag (USDT)</th>
                      <th className="px-4 py-2 text-left">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePnL.map((item) => (
                      <tr key={item.tranId} className="border-t border-gray-800 hover:bg-gray-800/40">
                        <td className="px-4 py-2">{item.symbol}</td>
                        <td className="px-4 py-2">{item.info}</td>
                        <td
                          className={`px-4 py-2 ${Number.parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {formatNumber(item.income)}
                        </td>
                        <td className="px-4 py-2 text-gray-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(item.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {realizedPnL.length > ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllPnL(!showAllPnL)}
                  className="mt-3 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors mx-auto"
                >
                  {showAllPnL ? (
                    <>
                      Weniger anzeigen <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Mehr anzeigen <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Chart */}
            {realizedPnL.length > 0 && (
              <div className="mt-8 md:mt-12">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-cyan-400">Grafik: Realisiertes PnL</h3>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg border border-gray-800">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={generateChartData(realizedPnL)}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis
                        dataKey="date"
                        stroke="#ccc"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#ccc" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "0.375rem",
                        }}
                        labelStyle={{ color: "#e5e7eb", fontWeight: "bold", marginBottom: "0.25rem" }}
                        itemStyle={{ padding: "0.125rem 0" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Bar dataKey="pnl" fill="#22c55e" name="Realisiertes PnL" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-4">
            Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString("de-CH")}
            {apiUnavailable && " (aus Cache)"}
          </p>
        )}
      </div>
    </section>
  )
}
