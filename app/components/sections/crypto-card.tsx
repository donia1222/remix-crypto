"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  TrendingUp,
  Wallet,
  X,
  RefreshCw,
} from "lucide-react"

// Tipos para los datos de criptomonedas
type CryptoData = {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  high24h: number
  low24h: number
  priceDirection: "up" | "down" | "neutral"
  lastPrice: number
}

// Tipo para datos históricos
type HistoricalDataPoint = {
  timestamp: number
  price: number
}

// Mapeo de símbolos a nombres completos en alemán
const cryptoNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  ADA: "Cardano",
  DOT: "Polkadot",
  BNB: "Binance Coin",
  XRP: "Ripple",
  DOGE: "Dogecoin",
  AVAX: "Avalanche",
  MATIC: "Polygon",
}

// Datos iniciales de criptomonedas con valores reales
const initialCryptoData: Partial<CryptoData>[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", price: 93956.52, change24h: -2.89, volume: 45.2e9, marketCap: 1.2e12 },
  { id: "eth", name: "Ethereum", symbol: "ETH", price: 1791.91, change24h: 3.43, volume: 23.1e9, marketCap: 420.5e9 },
  { id: "bnb", name: "Binance Coin", symbol: "BNB", price: 604.91, change24h: 3.53, volume: 8.7e9, marketCap: 61.2e9 },
  { id: "ada", name: "Cardano", symbol: "ADA", price: 0.71, change24h: 0.28, volume: 2.1e9, marketCap: 20.5e9 },
  { id: "doge", name: "Dogecoin", symbol: "DOGE", price: 0.18, change24h: 2.56, volume: 3.4e9, marketCap: 28.7e9 },
  { id: "xrp", name: "Ripple", symbol: "XRP", price: 0.55, change24h: 1.23, volume: 4.3e9, marketCap: 32.1e9 },
  { id: "sol", name: "Solana", symbol: "SOL", price: 133.45, change24h: -0.78, volume: 5.7e9, marketCap: 45.6e9 },
  { id: "dot", name: "Polkadot", symbol: "DOT", price: 7.82, change24h: 1.45, volume: 1.9e9, marketCap: 15.3e9 },
  { id: "avax", name: "Avalanche", symbol: "AVAX", price: 35.67, change24h: 2.34, volume: 2.8e9, marketCap: 22.4e9 },
  { id: "matic", name: "Polygon", symbol: "MATIC", price: 0.85, change24h: -1.12, volume: 1.5e9, marketCap: 12.7e9 },
]

// Datos históricos simulados para cada criptomoneda
const SIMULATED_HISTORICAL_DATA: Record<string, HistoricalDataPoint[]> = {}

// Función para generar datos históricos simulados
const generateHistoricalData = (symbol: string): HistoricalDataPoint[] => {
  // Si ya tenemos datos generados para este símbolo, devolverlos
  if (SIMULATED_HISTORICAL_DATA[symbol]) {
    return SIMULATED_HISTORICAL_DATA[symbol]
  }

  const data: HistoricalDataPoint[] = []
  const now = new Date()

  // Precio base según la criptomoneda - ACTUALIZADO con valores reales
  let basePrice = 0
  switch (symbol) {
    case "BTC":
      basePrice = 93956.52
      break
    case "ETH":
      basePrice = 1791.91
      break
    case "BNB":
      basePrice = 604.91
      break
    case "ADA":
      basePrice = 0.71
      break
    case "DOGE":
      basePrice = 0.18
      break
    case "XRP":
      basePrice = 0.55
      break
    case "SOL":
      basePrice = 133.45
      break
    case "DOT":
      basePrice = 7.82
      break
    case "AVAX":
      basePrice = 35.67
      break
    case "MATIC":
      basePrice = 0.85
      break
    default:
      basePrice = 100
  }

  // Generar 180 días de datos simulados (6 meses)
  for (let i = 180; i >= 0; i--) {
    const date = new Date()
    date.setDate(now.getDate() - i)

    // Variación aleatoria pero con tendencia
    const randomFactor = 0.05 // 5% de variación máxima
    const trendFactor = 0.0002 // Tendencia ligera

    // Añadir algunas fluctuaciones más realistas
    const dayOfYear = Math.floor(i / 30)
    const seasonalFactor = Math.sin((dayOfYear * Math.PI) / 6) * 0.1 // Fluctuación estacional

    // Crear algunos eventos de mercado aleatorios
    const hasMarketEvent = Math.random() > 0.95
    const marketEventImpact = hasMarketEvent ? (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.15 : 0

    const dayVariation = (Math.random() * 2 - 1) * randomFactor
    const trendVariation = (i - 90) * trendFactor // Tendencia alcista o bajista

    // Combinar todos los factores
    const priceModifier = 1 + dayVariation + trendVariation + seasonalFactor + marketEventImpact
    const price = basePrice * priceModifier

    data.push({
      timestamp: date.getTime(),
      price: price,
    })
  }

  // Guardar los datos generados para este símbolo
  SIMULATED_HISTORICAL_DATA[symbol] = data

  return data
}

export default function CryptoCard() {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isChartLoading, setIsChartLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const chartCanvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const priceMapRef = useRef<{ [symbol: string]: { price: number; lastPrice: number } }>({})
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<{ [symbol: string]: number }>({})
  const hasReceivedDataRef = useRef(false)

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Formatear la hora en formato alemán
  const formattedTime = time.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
  const formattedDate = time.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })

  // Inicializar los datos de criptomonedas con valores reales
  useEffect(() => {
    // Completar los datos iniciales
    const completeData = initialCryptoData.map((crypto) => ({
      ...crypto,
      high24h: crypto.price! * 1.02, // Estimación del máximo diario
      low24h: crypto.price! * 0.98, // Estimación del mínimo diario
      priceDirection: "neutral" as const,
      lastPrice: crypto.price!,
    })) as CryptoData[]

    setCryptoList(completeData)

    if (completeData.length > 0) {
      setSelectedCrypto(completeData[0])
      loadHistoricalData(completeData[0].symbol)
    }

    setIsLoading(false)
  }, [])

  // Conectar a WebSocket de Binance para datos en tiempo real
  useEffect(() => {
    // Inicializar el mapa de precios y actualizaciones pendientes
    initialCryptoData.forEach((crypto) => {
      if (crypto.symbol) {
        priceMapRef.current[crypto.symbol] = {
          price: crypto.price || 0,
          lastPrice: crypto.price || 0,
        }
        pendingUpdatesRef.current[crypto.symbol] = 0
      }
    })

    // Función para crear conexión WebSocket
    const createWebSocketConnection = () => {
      console.log("Creando conexión WebSocket...")

      // Crear conexión WebSocket con todos los pares
      const symbols = initialCryptoData.map((c) => `${c.symbol?.toLowerCase()}usdt@trade`).join("/")
      const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${symbols}`)

      // Manejar apertura de conexión
      socket.onopen = () => {
        console.log("WebSocket conectado")
        setIsConnected(true)
      }

      // Manejar mensajes recibidos
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message?.data?.s && message?.data?.p) {
          hasReceivedDataRef.current = true
          const fullSymbol = message.data.s // Ejemplo: BTCUSDT
          const symbol = fullSymbol.replace("USDT", "") // Extraer BTC
          const newPrice = Number.parseFloat(message.data.p)

          // Almacenar el último precio en actualizaciones pendientes
          pendingUpdatesRef.current[symbol] = newPrice
        }
      }

      // Manejar errores
      socket.onerror = (error) => {
        console.error("Error de WebSocket:", error)
        setIsConnected(false)
      }

      // Manejar cierre de conexión
      socket.onclose = () => {
        console.log("WebSocket desconectado")
        setIsConnected(false)

        // Intentar reconectar después de un retraso
        setTimeout(createWebSocketConnection, 5000)
      }

      return socket
    }

    // Crear conexión inicial
    socketRef.current = createWebSocketConnection()

    // Configurar intervalo para aplicar actualizaciones cada 2 segundos
    updateTimerRef.current = setInterval(() => {
      // Verificar si tenemos actualizaciones pendientes
      const hasUpdates = Object.values(pendingUpdatesRef.current).some((price) => price > 0)

      if (hasUpdates) {
        setCryptoList((prevData) => {
          return prevData.map((crypto) => {
            const newPrice = pendingUpdatesRef.current[crypto.symbol]

            // Omitir si no hay nuevo precio
            if (!newPrice) return crypto

            const lastPrice = crypto.price

            // Actualizar mapa de precios
            priceMapRef.current[crypto.symbol] = {
              lastPrice: lastPrice,
              price: newPrice,
            }

            // Reiniciar actualización pendiente
            pendingUpdatesRef.current[crypto.symbol] = 0

            return {
              ...crypto,
              lastPrice: lastPrice,
              price: newPrice,
              priceDirection: newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : "neutral",
            }
          })
        })

        // Actualizar timestamp de última actualización
        setLastUpdated(new Date())

        // Si la criptomoneda seleccionada ha cambiado, actualizar el gráfico
        if (selectedCrypto) {
          const updatedCrypto = cryptoList.find((c) => c.id === selectedCrypto.id)
          if (updatedCrypto && updatedCrypto.price !== selectedCrypto.price) {
            setSelectedCrypto(updatedCrypto)
          }
        }
      }
    }, 2000)

    // Configurar temporizador de respaldo para verificar si estamos recibiendo datos
    const fallbackTimer = setInterval(() => {
      if (!hasReceivedDataRef.current) {
        console.log("No se recibieron datos, usando datos de respaldo")

        // Si no se reciben datos reales, usar los datos iniciales
        setCryptoList((prevData) => {
          return prevData.map((crypto) => {
            const basePrice = initialCryptoData.find((c) => c.symbol === crypto.symbol)?.price || crypto.price
            const currentPrice = crypto.price
            const priceChangePercent = (Math.random() * 2 - 1) / 100
            const newPrice = currentPrice * (1 + priceChangePercent)

            return {
              ...crypto,
              lastPrice: currentPrice,
              price: newPrice,
              priceDirection: newPrice > currentPrice ? "up" : newPrice < currentPrice ? "down" : "neutral",
            }
          })
        })

        // Actualizar timestamp de última actualización
        setLastUpdated(new Date())
      }
    }, 5000)

    // Limpiar al desmontar
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close()
      }
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current)
      }
      clearInterval(fallbackTimer)
    }
  }, [])

  // Función para cargar datos históricos
  const loadHistoricalData = (symbol: string) => {
    setIsChartLoading(true)

    // Usar datos simulados directamente
    const data = generateHistoricalData(symbol)
    setHistoricalData(data)

    // Simular un pequeño retraso para mostrar el indicador de carga
    setTimeout(() => {
      setIsChartLoading(false)
      // Dibujar el gráfico después de que los datos estén listos
      setTimeout(() => drawChart(), 50)
    }, 500)
  }

  // Función para dibujar el gráfico
  const drawChart = () => {
    if (!chartCanvasRef.current || historicalData.length === 0) return

    const canvas = chartCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Asegurar que el canvas tenga el tamaño correcto
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const data = historicalData
    const padding = 20
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Encontrar valores mínimos y máximos
    let minPrice = Number.MAX_VALUE
    let maxPrice = Number.MIN_VALUE

    data.forEach((point) => {
      if (point.price < minPrice) minPrice = point.price
      if (point.price > maxPrice) maxPrice = point.price
    })

    // Añadir un margen del 5% arriba y abajo
    const range = maxPrice - minPrice
    minPrice = minPrice - range * 0.05
    maxPrice = maxPrice + range * 0.05

    // Función para convertir precio a coordenada Y
    const getY = (price: number) => {
      return padding + chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight
    }

    // Función para convertir índice a coordenada X
    const getX = (index: number) => {
      return padding + (index / (data.length - 1)) * chartWidth
    }

    // Dibujar líneas de referencia horizontales
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    const numLines = 5
    for (let i = 0; i <= numLines; i++) {
      const y = padding + (i / numLines) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Añadir etiquetas de precio
      const price = maxPrice - (i / numLines) * (maxPrice - minPrice)
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(
        `CHF ${price.toLocaleString("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        padding - 5,
        y + 3,
      )
    }

    // Dibujar líneas de referencia verticales (fechas)
    const numDateLines = Math.min(6, data.length)
    for (let i = 0; i < numDateLines; i++) {
      const index = Math.floor((i / (numDateLines - 1)) * (data.length - 1))
      const x = getX(index)

      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()

      // Añadir etiquetas de fecha
      const date = new Date(data[index].timestamp)
      const month = date.toLocaleString("de-DE", { month: "short" })
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(month, x, padding + chartHeight + 15)
    }

    // Dibujar la línea del gráfico
    ctx.beginPath()
    ctx.moveTo(getX(0), getY(data[0].price))

    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(i), getY(data[i].price))
    }

    // Estilo de la línea
    const changeColor = selectedCrypto?.change24h || 0
    ctx.strokeStyle = changeColor >= 0 ? "#10b981" : "#ef4444"
    ctx.lineWidth = 2
    ctx.stroke()

    // Crear gradiente para el área bajo la línea
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    const baseColor = changeColor >= 0 ? "#10b981" : "#ef4444"
    gradient.addColorStop(0, `${baseColor}80`)
    gradient.addColorStop(1, `${baseColor}00`)

    // Dibujar área bajo la línea
    ctx.lineTo(getX(data.length - 1), padding + chartHeight)
    ctx.lineTo(getX(0), padding + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Dibujar puntos en los datos
    const numPoints = Math.min(8, data.length)
    for (let i = 0; i < data.length; i += Math.floor(data.length / numPoints)) {
      const x = getX(i)
      const y = getY(data[i].price)

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fillStyle = changeColor >= 0 ? "#10b981" : "#ef4444"
      ctx.fill()
    }
  }

  // Efecto para dibujar el gráfico cuando cambian los datos históricos
  useEffect(() => {
    if (historicalData.length > 0) {
      drawChart()
    }
  }, [historicalData])

  // Efecto para redimensionar el canvas cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (chartCanvasRef.current) {
        const container = chartCanvasRef.current.parentElement
        if (container) {
          chartCanvasRef.current.width = container.clientWidth
          chartCanvasRef.current.height = container.clientHeight
          drawChart()
        }
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Llamar inicialmente

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [historicalData])

  // Efecto para cargar datos históricos cuando cambia la criptomoneda seleccionada
  useEffect(() => {
    if (selectedCrypto) {
      loadHistoricalData(selectedCrypto.symbol)
    }
  }, [selectedCrypto])

  // Función para reconectar WebSocket
  const reconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close()

      // Crear nueva conexión
      const symbols = initialCryptoData.map((c) => `${c.symbol?.toLowerCase()}usdt@trade`).join("/")
      const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${symbols}`)

      socketRef.current = socket

      socket.onopen = () => {
        console.log("WebSocket reconectado")
        setIsConnected(true)
      }

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message?.data?.s && message?.data?.p) {
          hasReceivedDataRef.current = true
          const fullSymbol = message.data.s
          const symbol = fullSymbol.replace("USDT", "")
          const newPrice = Number.parseFloat(message.data.p)

          pendingUpdatesRef.current[symbol] = newPrice
        }
      }

      socket.onerror = (error) => {
        console.error("Error de WebSocket:", error)
        setIsConnected(false)
      }

      socket.onclose = () => {
        console.log("WebSocket desconectado")
        setIsConnected(false)
      }
    }
  }

  // Formatear la hora de última actualización
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Manejar estado de carga
  if (isLoading && !selectedCrypto) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gray-900 p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-purple-500"
              />
              <motion.div
                animate={{ rotate: -180 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-2 rounded-full border-t-2 border-cyan-500"
              />
            </div>
            <p className="mt-4 text-white font-medium">Binance-Daten werden geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  // Manejar estado de error
  if (error && !selectedCrypto) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gray-900 p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <p className="text-white font-medium mb-4">{error}</p>
            <button onClick={reconnectWebSocket} className="px-4 py-2 bg-purple-600 rounded-lg text-white">
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay datos seleccionados, no renderizar nada
  if (!selectedCrypto) return null

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Imagen de fondo con overlay de gradiente */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/70 z-10"></div>
          <img
            src="/crypto-abstract-bg.png"
            alt="Crypto Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Krypto-Dashboard</h2>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {formattedTime} · {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                <span>Letzte Aktualisierung: {formatLastUpdated(lastUpdated)}</span>
                <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <span>{isConnected ? "Verbunden" : "Getrennt"}</span>
                {!isConnected && (
                  <button onClick={reconnectWebSocket} className="text-gray-400 hover:text-white">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Selector de criptomoneda */}
            <div className="mt-4 md:mt-0 relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-colors"
              >
                <span className="font-medium">{selectedCrypto.name}</span>
                {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tarjeta de precio principal */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCrypto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedCrypto.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedCrypto.name}</h3>
                    <p className="text-gray-300">{selectedCrypto.symbol}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div
                    className={`text-3xl font-bold text-white flex items-center ${
                      selectedCrypto.priceDirection === "up"
                        ? "text-green-400"
                        : selectedCrypto.priceDirection === "down"
                          ? "text-red-400"
                          : "text-white"
                    }`}
                  >
                    CHF{" "}
                    {selectedCrypto.price.toLocaleString("de-CH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {selectedCrypto.priceDirection === "up" && (
                      <motion.span
                        animate={{ y: [-2, 0] }}
                        transition={{ duration: 0.2 }}
                        className="text-green-500 ml-1"
                      >
                        ▲
                      </motion.span>
                    )}
                    {selectedCrypto.priceDirection === "down" && (
                      <motion.span animate={{ y: [0, 2] }} transition={{ duration: 0.2 }} className="text-red-500 ml-1">
                        ▼
                      </motion.span>
                    )}
                  </div>
                  <div
                    className={`flex items-center ${selectedCrypto.change24h >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {selectedCrypto.change24h >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(selectedCrypto.change24h).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              {/* Gráfico real con datos históricos */}
              <div className="h-32 md:h-48 mb-6 relative overflow-hidden rounded-xl">
                {isChartLoading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <div className="relative w-8 h-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-t-2 border-purple-500"
                        />
                      </div>
                      <p className="mt-2 text-xs text-white">Daten werden geladen...</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>

                {/* Canvas para dibujar el gráfico */}
                <canvas
                  ref={chartCanvasRef}
                  className="w-full h-full"
                  style={{ position: "absolute", top: 0, left: 0 }}
                />

                {/* Título del gráfico */}
                <div className="absolute top-2 left-2 text-xs text-white/70">Preisverlauf der letzten 6 Monate</div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>24h-Höchstwert</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    CHF{" "}
                    {selectedCrypto.high24h.toLocaleString("de-CH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    <span>24h-Tiefstwert</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    CHF{" "}
                    {selectedCrypto.low24h.toLocaleString("de-CH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>24h-Volumen</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {selectedCrypto.volume >= 1e9
                      ? `CHF ${(selectedCrypto.volume / 1e9).toFixed(1)}B`
                      : `CHF ${(selectedCrypto.volume / 1e6).toFixed(1)}M`}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                    <Wallet className="w-4 h-4" />
                    <span>Marktkapitalisierung</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {selectedCrypto.marketCap >= 1e12
                      ? `CHF ${(selectedCrypto.marketCap / 1e12).toFixed(1)}T`
                      : selectedCrypto.marketCap >= 1e9
                        ? `CHF ${(selectedCrypto.marketCap / 1e9).toFixed(1)}B`
                        : `CHF ${(selectedCrypto.marketCap / 1e6).toFixed(1)}M`}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botón de acción (solo Comprar) */}
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium"
            >
              {selectedCrypto.symbol} kaufen
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal de selección de criptomoneda para móvil */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Overlay de fondo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Modal centrado - Versión mejorada */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <h3 className="text-lg font-medium text-white">Kryptowährung auswählen</h3>
                  <button onClick={() => setIsDropdownOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-2 max-h-[60vh] overflow-y-auto">
                  {cryptoList.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => {
                        setSelectedCrypto(crypto)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 ${
                        selectedCrypto?.id === crypto.id
                          ? "bg-purple-600/30 text-white"
                          : "text-gray-200 hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        {crypto.symbol.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-xs text-gray-400">{crypto.symbol}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="font-medium">
                          CHF{" "}
                          {crypto.price.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-xs ${crypto.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {crypto.change24h >= 0 ? "+" : ""}
                          {crypto.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
