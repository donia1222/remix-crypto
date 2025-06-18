"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from "recharts"
import { motion } from "framer-motion"
import { Clock, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Lock, LogIn, LogOut, X, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'

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

interface PositionEntry {
  positionId: string
  symbol: string
  currency: string
  positionAmt: string
  availableAmt: string
  positionSide: string
  isolated: boolean
  avgPrice: string
  initialMargin: string
  margin: string
  leverage: number
  unrealizedProfit: string
  realisedProfit: string
  liquidationPrice: number
  pnlRatio: string
  maxMarginReduction: string
  riskRate: string
  markPrice: string
  positionValue: string
  onlyOnePosition: boolean
  createTime: number
  updateTime: number
}

interface BalanceData {
  userId: string
  asset: string
  balance: string
  equity: string
  unrealizedProfit: string
  realisedProfit: string
  availableMargin: string
  usedMargin: string
  freezedMargin: string
  shortUid: string
}

interface BingXApiResponse {
  code?: number
  msg?: string
  data?: FeeEntry[] | PositionEntry[]
}

interface CachedData {
  realizedPnL: FeeEntry[]
  fees: FeeEntry[]
  positions: PositionEntry[]
  balance: BalanceData | null
  timestamp: number
}

interface BingXOverviewProps {
  password?: string
}

// Add ref interface for exposing methods
export interface BingXOverviewRef {
  openLoginModal: () => void
  handleLogout: () => void
  isAuthenticated: boolean
}

const BingXOverview = forwardRef<BingXOverviewRef, BingXOverviewProps>(({ password }, ref) => {
  const PNL_API = "https://web.lweb.ch/api.php"
  const FEES_API = "https://web.lweb.ch/api_fees.php"
  const POSITIONS_API = "https://web.lweb.ch/api-3.php"
  const BALANCE_API = "https://web.lweb.ch/crypto/balance.php"
  const RETRY_INTERVAL = 5 * 60 * 1000 // 5 minutos en milisegundos

  const [realizedPnL, setRealizedPnL] = useState<FeeEntry[]>([])
  const [fees, setFees] = useState<FeeEntry[]>([])
  const [positions, setPositions] = useState<PositionEntry[]>([])
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showAllPnL, setShowAllPnL] = useState(false)
  const [apiUnavailable, setApiUnavailable] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [inputPassword, setInputPassword] = useState<string>("")

  const ITEMS_TO_SHOW = 5

  // Usa la contraseña que viene del loader de Remix
  const PASSWORD = password

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    openLoginModal: () => setShowLoginForm(true),
    handleLogout,
    isAuthenticated
  }))

  // Función para guardar datos en localStorage
  const saveDataToCache = (
    pnlData: FeeEntry[],
    feesData: FeeEntry[],
    positionsData: PositionEntry[],
    balanceData: BalanceData | null,
  ) => {
    const cacheData: CachedData = {
      realizedPnL: pnlData,
      fees: feesData,
      positions: positionsData,
      balance: balanceData,
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
      const [pnlRes, feeRes, positionsRes, balanceRes] = await Promise.all([
        fetch(PNL_API).then((r) => r.json()),
        fetch(FEES_API).then((r) => r.json()),
        fetch(POSITIONS_API).then((r) => r.json()),
        fetch(BALANCE_API).then((r) => r.json()),
      ])

      if (pnlRes?.code !== 0) throw new Error(`Fehler in api.php: ${pnlRes.msg || "Unbekannter Fehler"}`)
      if (feeRes?.code !== 0) throw new Error(`Fehler in api_fees.php: ${feeRes.msg || "Unbekannter Fehler"}`)
      if (positionsRes?.code !== 0) throw new Error(`Fehler in api-3.php: ${positionsRes.msg || "Unbekannter Fehler"}`)
      if (balanceRes?.code !== 0) throw new Error(`Fehler in balance.php: ${balanceRes.msg || "Unbekannter Fehler"}`)

      const pnlData = pnlRes.data || []
      const feesData = feeRes.data || []
      const positionsData = positionsRes.data || []
      const balanceData = balanceRes.data?.balance || null

      setRealizedPnL(pnlData as FeeEntry[])
      setFees(feesData as FeeEntry[])
      setPositions(positionsData as PositionEntry[])
      setBalanceData(balanceData as BalanceData)
      setLastUpdated(new Date())
      setApiUnavailable(false)

      // Guardar datos en caché
      saveDataToCache(
        pnlData as FeeEntry[],
        feesData as FeeEntry[],
        positionsData as PositionEntry[],
        balanceData as BalanceData,
      )

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
        setFees(cachedData.fees)
        setPositions(cachedData.positions || [])
        setBalanceData(cachedData.balance)
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp))
  }

  const formatNumber = (numStr: string, decimals = 2) => {
    const num = Number.parseFloat(numStr)
    if (isNaN(num)) return "0.00"

    // Force exactly 2 decimal places
    return num.toFixed(decimals)
  }

  const getTotal = (entries: FeeEntry[]) => {
    return entries.reduce((sum, item) => sum + Number.parseFloat(item.income), 0)
  }

  const getTotalUnrealizedProfit = (entries: PositionEntry[]) => {
    return entries.reduce((sum, item) => sum + Number.parseFloat(item.unrealizedProfit), 0)
  }

  const getTotalRealizedProfit = (entries: PositionEntry[]) => {
    return entries.reduce((sum, item) => sum + Number.parseFloat(item.realisedProfit), 0)
  }

  const generateChartData = (pnlData: FeeEntry[]) => {
    const format = (timestamp: number) =>
      new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
        new Date(timestamp),
      )

    const grouped: Record<string, { pnl: number }> = {}

    pnlData.forEach((item) => {
      const date = format(item.time)
      grouped[date] = grouped[date] || { pnl: 0 }
      grouped[date].pnl += Number.parseFloat(item.income)
    })

    return Object.entries(grouped).map(([date, values]) => ({
      date,
      pnl: Number.parseFloat(values.pnl.toFixed(2)),
    }))
  }

  function filterLastWeekData(data: FeeEntry[]): FeeEntry[] {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const oneWeekAgoTimestamp = oneWeekAgo.getTime()

    return data.filter((item) => item.time >= oneWeekAgoTimestamp)
  }

  const handleLogin = () => {
    // Debug: mostrar los valores para comparación
    console.log("PASSWORD from prop:", PASSWORD)
    console.log("inputPassword:", inputPassword)
    console.log("PASSWORD length:", PASSWORD?.length)
    console.log("inputPassword length:", inputPassword.length)
    console.log("Are they equal?", inputPassword === PASSWORD)

    if (!PASSWORD) {
      setLoginError(true)
      console.error("Password not provided from environment variables")
      return
    }

    // Limpiar espacios en blanco y comparar
    const cleanPassword = PASSWORD.trim()
    const cleanInputPassword = inputPassword.trim()

    console.log("Clean PASSWORD:", cleanPassword)
    console.log("Clean inputPassword:", cleanInputPassword)
    console.log("Clean comparison:", cleanInputPassword === cleanPassword)

    if (cleanInputPassword === cleanPassword) {
      setIsAuthenticated(true)
      setShowLoginForm(false)
      setLoginError(false)
      setInputPassword("")
      localStorage.setItem("bingx-auth", "true")
    } else {
      setLoginError(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    // Eliminar autenticación de localStorage
    localStorage.removeItem("bingx-auth")
  }

  // Cargar datos al inicio y configurar el intervalo de reintento
  useEffect(() => {
    // Verificar si existe una autenticación guardada
    const savedAuth = localStorage.getItem("bingx-auth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }

    // Mostrar datos del caché mientras esperamos la respuesta de la API
    const cachedData = loadDataFromCache()
    if (cachedData) {
      setRealizedPnL(cachedData.realizedPnL)
      setFees(cachedData.fees)
      setPositions(cachedData.positions || [])
      setBalanceData(cachedData.balance)
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

  // Agregar este useEffect después del useEffect existente
  useEffect(() => {
    console.log("Component mounted with password:", password)
    console.log("PASSWORD constant:", PASSWORD)
  }, [password])

  const filteredPnL = isAuthenticated ? realizedPnL : filterLastWeekData(realizedPnL)
  const visiblePnL = showAllPnL ? filteredPnL.slice(0, 10) : filteredPnL.slice(0, ITEMS_TO_SHOW)

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
          <div className="flex items-center justify-center gap-3  mt-20">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-green-500 p-4">
              Trading Übersicht
            </h2>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-green-400"
            >
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
            
          </div>
          <p className="text-sm md:text-base text-gray-400 text-center">
            Hier findest du eine Übersicht unserer vergangenen Trades.
          </p>
        </motion.div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchAllData()}
                className="flex items-center gap-2 bg-gradient-to-r  from-green-600 to-green-600  hover:from-green-900 hover:to-green-900 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Aktualisieren
              </button>


            </div>

            {apiUnavailable && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>API nicht verfügbar, zeige zwischengespeicherte Daten</span>
              </div>
            )}
          </div>

          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString("de-CH")}
              {apiUnavailable && " (aus Cache)"}
            </p>
          )}
        </div>

        {/* Login Form */}
        {showLoginForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gradient-to-b from-gray-900 to-gray-950 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">
                    Mitgliederbereich
                  </h3>
                  <button
                    onClick={() => {
                      setShowLoginForm(false)
                      setLoginError(false)
                    }}
                    className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6 text-gray-400 text-sm">
                  Bitte geben Sie Ihr Passwort ein, um auf den exklusiven Mitgliederbereich zuzugreifen.
                </div>

                {loginError && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mb-6 p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Falsches Passwort. Bitte versuchen Sie es erneut.</span>
                  </motion.div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Passwort</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin()
                      }}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="••••••••"
                    />
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-600 hover:from-purple-500 hover:to-pink-500 px-4 py-3 rounded-lg text-white transition-all font-medium shadow-lg hover:shadow-purple-700/20"
                >
                  <LogIn className="w-4 h-4" />
                  Zugang freischalten
                </button>

                <div className="mt-4 text-center text-xs text-gray-500">
                  Nur für autorisierte Benutzer. Alle Aktivitäten werden protokolliert.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

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
            {/* Positions - Only shown when authenticated */}
            {isAuthenticated && positions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-purple-400">Aktuelle Positionen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Unrealisiertes PnL</div>
                    <div
                      className={`text-xl font-bold ${getTotalUnrealizedProfit(positions) >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {formatNumber(getTotalUnrealizedProfit(positions).toString())} USDT
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Realisiertes PnL (Positionen)</div>
                    <div
                      className={`text-xl font-bold ${getTotalRealizedProfit(positions) >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {formatNumber(getTotalRealizedProfit(positions).toString())} USDT
                    </div>
                  </div>
                </div>

                {/* Mobile view for Positions */}
                <div className="md:hidden space-y-4">
                  {positions.map((position) => (
                    <div
                      key={position.positionId}
                      className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-medium text-lg">{position.symbol}</span>
                          <div className="flex items-center mt-1">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${position.positionSide === "LONG" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                            >
                              {position.positionSide === "LONG" ? (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  LONG
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  SHORT
                                </div>
                              )}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">x{position.leverage}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Menge</div>
                          <div className="font-medium">{formatNumber(position.positionAmt, 2)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <div className="text-xs text-gray-400">Einstiegspreis</div>
                          <div className="font-medium">{formatNumber(position.avgPrice, 2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Aktueller Preis</div>
                          <div className="font-medium">{formatNumber(position.markPrice, 2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Liquidationspreis</div>
                          <div className="font-medium">{formatNumber(position.liquidationPrice.toString(), 2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">PnL Ratio</div>
                          <div
                            className={`font-medium ${Number.parseFloat(position.pnlRatio) >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {(Number.parseFloat(position.pnlRatio) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-400">Unrealisiertes PnL</div>
                          <div
                            className={`font-medium ${Number.parseFloat(position.unrealizedProfit) >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {formatNumber(position.unrealizedProfit)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Realisiertes PnL</div>
                          <div
                            className={`font-medium ${Number.parseFloat(position.realisedProfit) >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {formatNumber(position.realisedProfit)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Eröffnet: {formatDate(position.createTime)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view for Positions */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left">Paar</th>
                        <th className="px-4 py-2 text-left">Richtung</th>
                        <th className="px-4 py-2 text-left">Menge</th>
                        <th className="px-4 py-2 text-left">Einstiegspreis</th>
                        <th className="px-4 py-2 text-left">Aktueller Preis</th>
                        <th className="px-4 py-2 text-left">Unrealisiertes PnL</th>
                        <th className="px-4 py-2 text-left">Realisiertes PnL</th>
                        <th className="px-4 py-2 text-left">Liquidationspreis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((position) => (
                        <tr key={position.positionId} className="border-t border-gray-800 hover:bg-gray-800/40">
                          <td className="px-4 py-2 font-medium">{position.symbol}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${position.positionSide === "LONG" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                            >
                              {position.positionSide === "LONG" ? (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  LONG x{position.leverage}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  SHORT x{position.leverage}
                                </div>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-2">{formatNumber(position.positionAmt, 2)}</td>
                          <td className="px-4 py-2">{formatNumber(position.avgPrice, 2)}</td>
                          <td className="px-4 py-2">{formatNumber(position.markPrice, 2)}</td>
                          <td
                            className={`px-4 py-2 ${Number.parseFloat(position.unrealizedProfit) >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {formatNumber(position.unrealizedProfit)}
                          </td>
                          <td
                            className={`px-4 py-2 ${Number.parseFloat(position.realisedProfit) >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {formatNumber(position.realisedProfit)}
                          </td>
                          <td className="px-4 py-2">{formatNumber(position.liquidationPrice.toString(), 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Balance Data - Only shown when authenticated */}
            {isAuthenticated && balanceData && (
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-emerald-400">Kontoübersicht</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-1">Gesamtguthaben</div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(balanceData.balance)} {balanceData.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Verfügbar für Handel und Margin</div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-1">Eigenkapital</div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(balanceData.equity)} {balanceData.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Guthaben + Unrealisierte PnL</div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-1">Realisierter Gewinn</div>
                    <div
                      className={`text-xl font-bold ${Number.parseFloat(balanceData.realisedProfit) >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {formatNumber(balanceData.realisedProfit)} {balanceData.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Abgeschlossene Trades</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-1">Verfügbare Margin</div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(balanceData.availableMargin)} {balanceData.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Für neue Positionen verfügbar</div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-1">Verwendete Margin</div>
                    <div className="text-xl font-bold text-amber-400">
                      {formatNumber(balanceData.usedMargin)} {balanceData.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Für offene Positionen verwendet</div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-400 mb-1">Eingefrorene Margin</div>
                    <div className="text-xl font-bold text-blue-400">
                      {formatNumber(balanceData.freezedMargin)} {balanceData.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Für ausstehende Orders reserviert</div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Unrealisierter Gewinn/Verlust</div>

                      <div
                        className={`text-xl font-bold ${Number.parseFloat(balanceData.unrealizedProfit) >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {formatNumber(balanceData.unrealizedProfit)} {balanceData.asset}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Benutzer-ID: {balanceData.shortUid}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Realized PnL */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-green-500">
                {isAuthenticated ? "Realisiertes PnL" : "Realisierte Gewinne und Verluste"}
              </h3>

              {/* Mobile view for PnL */}
              <div className="md:hidden space-y-3">
                {visiblePnL.map((item) => (
                  <div key={item.tranId} className="bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{item.symbol}</span>

                      <span
                        className={`font-semibold ${Number.parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {formatNumber(item.income, 2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{item.info}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Clock className="w-4 h-4" />
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
                          className={`px-4 py-2 font-semibold ${Number.parseFloat(item.income) >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {formatNumber(item.income, 2)}
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

              {filteredPnL.length > ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllPnL(!showAllPnL)}
                  className="mt-3 flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors mx-auto"
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
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-green-400">
                  {isAuthenticated
                    ? "Realisierte Gewinne und Verluste in den letzten 7 Tagen"
                    : "Realisierte Gewinne und Verluste in den letzten 7 Tagen"}
                </h3>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg border border-gray-800">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={
                        isAuthenticated
                          ? generateChartData(realizedPnL)
                          : generateChartData(filterLastWeekData(realizedPnL))
                      }
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
                          backgroundColor: "#22c55e",
                          border: "1px solid #22c55e",
                          borderRadius: "0.375rem",
                        }}
                        labelStyle={{
                          color: "gray",
                          fontWeight: "bold",
                          marginBottom: "0.25rem",
                        }}
                        itemStyle={{ padding: "0.125rem 0" }}
                        formatter={(value: any) => [`${formatNumber(value.toString(), 2)} USDT`, "Gewinn/Verlust"]}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px", color: "#e5e7eb" }} />
                      <Bar dataKey="pnl" name="Gewinn/Verlust">
                        {(isAuthenticated
                          ? generateChartData(realizedPnL)
                          : generateChartData(filterLastWeekData(realizedPnL))
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Membership Call-to-Action */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg text-center">
              <p className="text-sm text-gray-300 mb-4 text-center">
                Möchtest du mehr Informationen sehen? Wir bieten dir im Nextrade-Abo exklusive Einblicke in unsere Käufe
                und Verkäufe. Zusätzlich teilen wir dort unsere Einschätzungen zur aktuellen Marktlage.
              </p>
              <button
                onClick={() => {
                  window.open("https://steady.page/de/nextrade-abo/about", "_blank", "noopener,noreferrer")
                }}
                className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-900 hover:to-green-900 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2 mx-auto"
              >
                Zum Nextrade-Abo
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
})

BingXOverview.displayName = "BingXOverview"

export default BingXOverview
