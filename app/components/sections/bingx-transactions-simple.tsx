"use client"

import { useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { motion } from "framer-motion"
import { Clock, RefreshCw, ChevronDown, ChevronUp, Filter, Database } from "lucide-react"

interface TradeEntry {
  symbol: string
  incomeType: string
  income: string
  asset: string
  info: string
  time: number
  tranId: string
  tradeId: string
  status?: string // "CLOSED" | "OPEN"
}

interface BingXApiResponse {
  code?: number
  msg?: string
  data?: TradeEntry[]
}

export default function BingXOverview() {
  const PNL_API = "https://web.lweb.ch/api.php"
  const FEES_API = "https://web.lweb.ch/api_fees.php"

  const [realizedPnL, setRealizedPnL] = useState<TradeEntry[]>([])
  const [fees, setFees] = useState<TradeEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showAllPnL, setShowAllPnL] = useState(false)
  const [showAllFees, setShowAllFees] = useState(false)
  const [filterClosed, setFilterClosed] = useState(true)
  const [activeTab, setActiveTab] = useState<"pnl" | "fees">("pnl")
  const [dataLoaded, setDataLoaded] = useState(false)

  const ITEMS_TO_SHOW = 6

  // Función simplificada que solo hace una llamada a la API sin reintentos
  const fetchAllData = async () => {
    // Si ya está cargando, no hacer nada para evitar múltiples llamadas
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      // Obtener datos reales de las APIs
      const [pnlRes, feeRes] = await Promise.all([
        fetch(PNL_API, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }).then((r) => r.json()),
        fetch(FEES_API, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }).then((r) => r.json()),
      ])

      if (pnlRes?.code !== 0) {
        throw new Error(`Fehler in api.php: ${pnlRes.msg || "Unbekannter Fehler"}`)
      }

      if (feeRes?.code !== 0) {
        throw new Error(`Fehler in api_fees.php: ${feeRes.msg || "Unbekannter Fehler"}`)
      }

      // Procesar datos de PnL
      const pnlWithStatus = (pnlRes.data || []).map((item: TradeEntry) => ({
        ...item,
        status: item.info?.toLowerCase().includes("close") ? "CLOSED" : "OPEN",
      }))

      setRealizedPnL(pnlWithStatus)
      setFees(feeRes.data || [])
      setLastUpdated(new Date())
      setDataLoaded(true)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Fehler beim Abrufen der Daten")
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

  const getTotal = (entries: TradeEntry[]) => {
    return entries.reduce((sum, item) => sum + Number.parseFloat(item.income), 0)
  }

  const generateChartData = (pnlData: TradeEntry[], feeData: TradeEntry[]) => {
    const format = (timestamp: number) =>
      new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" }).format(new Date(timestamp))

    const grouped: Record<string, { pnl: number; fees: number }> = {}

    pnlData.forEach((item) => {
      const date = format(item.time)
      grouped[date] = grouped[date] || { pnl: 0, fees: 0 }
      grouped[date].pnl += Number.parseFloat(item.income)
    })

    feeData.forEach((item) => {
      const date = format(item.time)
      grouped[date] = grouped[date] || { pnl: 0, fees: 0 }
      grouped[date].fees += Number.parseFloat(item.income)
    })

    return Object.entries(grouped).map(([date, values]) => ({
      date,
      pnl: Number.parseFloat(values.pnl.toFixed(4)),
      fees: Number.parseFloat(values.fees.toFixed(4)),
    }))
  }

  const filteredPnL = filterClosed ? realizedPnL.filter((item) => item.status === "CLOSED") : realizedPnL

  const visiblePnL = showAllPnL ? filteredPnL : filteredPnL.slice(0, ITEMS_TO_SHOW)
  const visibleFees = showAllFees ? fees : fees.slice(0, ITEMS_TO_SHOW)

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
          <p className="text-sm md:text-base text-gray-400">Realisiertes PnL und Gebühren</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded text-sm transition-colors ${
              isLoading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Wird aktualisiert..." : "Aktualisieren"}
          </button>

          <button
            onClick={() => setFilterClosed(!filterClosed)}
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded text-sm transition-colors ${
              filterClosed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
            disabled={!dataLoaded}
          >
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {filterClosed ? "Nur geschlossene" : "Alle anzeigen"}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm">
            Fehler: {error}. Versuche es später erneut.
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("pnl")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "pnl"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
              disabled={!dataLoaded}
            >
              Handelshistorie
            </button>
            <button
              onClick={() => setActiveTab("fees")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "fees"
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
              disabled={!dataLoaded}
            >
              Gebühren
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Daten werden geladen...</p>
          </div>
        ) : !dataLoaded ? (
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-lg text-center">
            <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Keine Daten geladen</p>
            <p className="text-sm text-gray-500">Klicke auf "Aktualisieren" um Daten zu laden</p>
          </div>
        ) : (
          <>
            {/* Realized PnL Tab */}
            {activeTab === "pnl" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-blue-400">Realisiertes PnL</h3>
                  <p className="text-sm text-green-400">
                    Gesamt: {formatNumber(getTotal(filteredPnL).toString())} USDT
                  </p>
                </div>

                {filteredPnL.length === 0 ? (
                  <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-center text-gray-400">
                    Keine Daten verfügbar
                  </div>
                ) : (
                  <>
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
                          {item.status === "CLOSED" && (
                            <div className="mt-1 inline-block px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                              Vollständig geschlossen
                            </div>
                          )}
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
                            <th className="px-4 py-2 text-left">Realisierter PnL (USDT)</th>
                            <th className="px-4 py-2 text-left">Datum</th>
                            <th className="px-4 py-2 text-left">Status</th>
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
                              <td className="px-4 py-2">
                                {item.status === "CLOSED" && (
                                  <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                                    Vollständig geschlossen
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredPnL.length > ITEMS_TO_SHOW && (
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
                  </>
                )}
              </div>
            )}

            {/* Fees Tab */}
            {activeTab === "fees" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-yellow-400">Gebühren</h3>
                  <p className="text-sm text-gray-400">Gesamt: {formatNumber(getTotal(fees).toString())} USDT</p>
                </div>

                {fees.length === 0 ? (
                  <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-center text-gray-400">
                    Keine Daten verfügbar
                  </div>
                ) : (
                  <>
                    {/* Mobile view for Fees */}
                    <div className="md:hidden space-y-3">
                      {visibleFees.map((item) => (
                        <div key={item.tranId} className="bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{item.symbol}</span>
                            <span
                              className={`${Number.parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"} font-semibold`}
                            >
                              {formatNumber(item.income)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.incomeType === "FUNDING_FEE" ? "Finanzierungsgebühr" : "Handelsgebühr"}
                          </div>
                          <div className="text-xs text-gray-500">{item.info}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.time)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop view for Fees */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left">Paar</th>
                            <th className="px-4 py-2 text-left">Typ</th>
                            <th className="px-4 py-2 text-left">Beschreibung</th>
                            <th className="px-4 py-2 text-left">Betrag (USDT)</th>
                            <th className="px-4 py-2 text-left">Datum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleFees.map((item) => (
                            <tr key={item.tranId} className="border-t border-gray-800 hover:bg-gray-800/40">
                              <td className="px-4 py-2">{item.symbol}</td>
                              <td className="px-4 py-2">
                                {item.incomeType === "FUNDING_FEE" ? "Finanzierungsgebühr" : "Handelsgebühr"}
                              </td>
                              <td className="px-4 py-2 text-gray-400">{item.info}</td>
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

                    {fees.length > ITEMS_TO_SHOW && (
                      <button
                        onClick={() => setShowAllFees(!showAllFees)}
                        className="mt-3 flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors mx-auto"
                      >
                        {showAllFees ? (
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
                  </>
                )}
              </div>
            )}

            {/* Chart */}
            {filteredPnL.length > 0 && fees.length > 0 && (
              <div className="mt-8 md:mt-12">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-cyan-400">Grafik: PnL vs. Gebühren</h3>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg border border-gray-800">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={generateChartData(filteredPnL, fees)}
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
                      <Bar dataKey="fees" fill="#eab308" name="Gebühren" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-4">Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString("de-CH")}</p>
        )}
      </div>
    </section>
  )
}
