"use client"

import { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts"
import { motion } from "framer-motion"
import { Clock, RefreshCw } from "lucide-react"

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

export default function BingXOverview() {
  const PNL_API = "https://web.lweb.ch/api.php"
  const FEES_API = "https://web.lweb.ch/api_fees.php"

  const [realizedPnL, setRealizedPnL] = useState<FeeEntry[]>([])
  const [fees, setFees] = useState<FeeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAllData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [pnlRes, feeRes]: BingXApiResponse[] = await Promise.all([
        fetch(PNL_API).then((r) => r.json()),
        fetch(FEES_API).then((r) => r.json())
      ])

      if (pnlRes?.code !== 0) throw new Error(`Fehler in api.php: ${pnlRes.msg || "Unbekannter Fehler"}`)
      if (feeRes?.code !== 0) throw new Error(`Fehler in api_fees.php: ${feeRes.msg || "Unbekannter Fehler"}`)

      setRealizedPnL(pnlRes.data || [])
      setFees(feeRes.data || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Abrufen")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(timestamp))
  }

  const formatNumber = (numStr: string, decimals = 4) => {
    const num = parseFloat(numStr)
    return isNaN(num) ? "0.0000" : num.toLocaleString("de-CH", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  const getTotal = (entries: FeeEntry[]) => {
    return entries.reduce((sum, item) => sum + parseFloat(item.income), 0)
  }

  const generateChartData = (pnlData: FeeEntry[], feeData: FeeEntry[]) => {
    const format = (timestamp: number) =>
      new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" }).format(new Date(timestamp))

    const grouped: Record<string, { pnl: number; fees: number }> = {}

    pnlData.forEach((item) => {
      const date = format(item.time)
      grouped[date] = grouped[date] || { pnl: 0, fees: 0 }
      grouped[date].pnl += parseFloat(item.income)
    })

    feeData.forEach((item) => {
      const date = format(item.time)
      grouped[date] = grouped[date] || { pnl: 0, fees: 0 }
      grouped[date].fees += parseFloat(item.income)
    })

    return Object.entries(grouped).map(([date, values]) => ({
      date,
      pnl: parseFloat(values.pnl.toFixed(4)),
      fees: parseFloat(values.fees.toFixed(4))
    }))
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <section className="w-full py-10 bg-gray-950 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold mb-2">BingX Übersicht</h2>
          <p className="text-gray-400">Realisiertes PnL, Finanzierungs- und Handelsgebühren.</p>
        </motion.div>

        <div className="mb-4">
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Aktualisieren
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-400">Lade Daten...</p>
        ) : error ? (
          <p className="text-red-400">Fehler: {error}</p>
        ) : (
          <>
            {/* Realized PnL */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Realisiertes PnL</h3>
              <p className="text-sm text-green-400 mb-2">
                Gesamt: {formatNumber(getTotal(realizedPnL).toString())} USDT
              </p>
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
                  {realizedPnL.map((item) => (
                    <tr key={item.tranId} className="border-t border-gray-800 hover:bg-gray-800/40">
                      <td className="px-4 py-2">{item.symbol}</td>
                      <td className="px-4 py-2">{item.info}</td>
                      <td className={`px-4 py-2 ${parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"}`}>
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

            {/* Fees */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-yellow-400">Gebühren (Funding & Trading)</h3>
              <p className="text-sm text-red-400 mb-2">
                Gesamt: {formatNumber(getTotal(fees).toString())} USDT
              </p>
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
                  {fees.map((item) => (
                    <tr key={item.tranId} className="border-t border-gray-800 hover:bg-gray-800/40">
                      <td className="px-4 py-2">{item.symbol}</td>
                      <td className="px-4 py-2">
                        {item.incomeType === "FUNDING_FEE" ? "Finanzierungsgebühr" : "Handelsgebühr"}
                      </td>
                      <td className={`px-4 py-2 ${parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"}`}>
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

            {/* Gráfico de barras */}
            {realizedPnL.length > 0 && fees.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Grafik: PnL vs. Gebühren</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={generateChartData(realizedPnL, fees)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pnl" fill="#22c55e" name="Realized PnL" />
                    <Bar dataKey="fees" fill="#ef4444" name="Gebühren" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-4">
            Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString("de-CH")}
          </p>
        )}
      </div>
    </section>
  )
}
