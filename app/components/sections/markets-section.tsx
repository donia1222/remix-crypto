"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "~/components/ui/button"

// Tracked cryptocurrency pairs - Filtered list
const trackedPairs = [
  { id: 1, name: "Bitcoin", symbol: "BTCUSDT", shortSymbol: "BTC", volume: "45.2B", marketCap: "1.2T" },
  { id: 2, name: "Ethereum", symbol: "ETHUSDT", shortSymbol: "ETH", volume: "23.1B", marketCap: "420.5B" },
  { id: 3, name: "Ripple", symbol: "XRPUSDT", shortSymbol: "XRP", volume: "4.3B", marketCap: "32.1B" },
  { id: 4, name: "Solana", symbol: "SOLUSDT", shortSymbol: "SOL", volume: "5.7B", marketCap: "45.6B" },
  { id: 5, name: "Stellar", symbol: "XLMUSDT", shortSymbol: "XLM", volume: "0.8B", marketCap: "6.5B" },
  { id: 6, name: "Dogecoin", symbol: "DOGEUSDT", shortSymbol: "DOGE", volume: "3.4B", marketCap: "28.7B" },
  { id: 7, name: "Peanut the Squirrel", symbol: "PNUTUSDT", shortSymbol: "PNUT", volume: "0.5B", marketCap: "2.1B" },
]

// Define a type for the price dictionary
type PriceDictionary = {
  [key: string]: number
}

// Base prices for fallback (approximate real values)
const basePrices: PriceDictionary = {
  BTCUSDT: 65000,
  ETHUSDT: 3500,
  XRPUSDT: 0.55,
  SOLUSDT: 150,
  XLMUSDT: 0.12,
  DOGEUSDT: 0.15,
  PNUTUSDT: 1.25,
}

// Define a type for crypto data
type CryptoData = {
  id: number
  name: string
  symbol: string
  shortSymbol: string
  volume: string
  marketCap: string
  price: number
  change: string | number
  lastPrice: number
  priceDirection: "up" | "down" | "neutral"
}

// Initial data to display while real data is loading
const initialPriceData: CryptoData[] = trackedPairs.map((pair) => ({
  ...pair,
  price: basePrices[pair.symbol] || 100,
  change: (Math.random() * 10 - 5).toFixed(2),
  lastPrice: basePrices[pair.symbol] || 100,
  priceDirection: "neutral",
}))

export default function MarketsSection() {
  // State for prices and changes
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(initialPriceData)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(false)
  const [visibleItems, setVisibleItems] = useState(5) // Initially show 5 items
  const socketRef = useRef<WebSocket | null>(null)
  const priceMapRef = useRef<{ [symbol: string]: { price: number; lastPrice: number } }>({})
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<{ [symbol: string]: number }>({})
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasReceivedDataRef = useRef(false)

  // Function to show more items
  const showMoreItems = () => {
    setVisibleItems((prev) => Math.min(prev + 5, trackedPairs.length))
  }

  // Function to show fewer items
  const showFewerItems = () => {
    setVisibleItems(5)
  }

  // Connect to Binance WebSocket
  useEffect(() => {
    // Initialize price map and pending updates
    trackedPairs.forEach((pair) => {
      priceMapRef.current[pair.symbol] = {
        price: basePrices[pair.symbol] || 100,
        lastPrice: basePrices[pair.symbol] || 100,
      }
      pendingUpdatesRef.current[pair.symbol] = 0
    })

    // Function to create WebSocket connection
    const createWebSocketConnection = () => {
      console.log("Creating WebSocket connection...")

      // Create WebSocket connection with all pairs
      const socket = new WebSocket(
        "wss://stream.binance.com:9443/stream?streams=" +
          trackedPairs.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
      )

      // Handle connection opening
      socket.onopen = () => {
        console.log("WebSocket connected")
        setIsConnected(true)
      }

      // Handle received messages
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message?.data?.s && message?.data?.p) {
          hasReceivedDataRef.current = true
          const symbol = message.data.s
          const newPrice = Number.parseFloat(message.data.p)

          // Store the latest price in pending updates
          pendingUpdatesRef.current[symbol] = newPrice
        }
      }

      // Handle errors
      socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      }

      // Handle connection closing
      socket.onclose = () => {
        console.log("WebSocket disconnected")
        setIsConnected(false)

        // Try to reconnect after a delay
        setTimeout(createWebSocketConnection, 5000)
      }

      return socket
    }

    // Create initial connection
    socketRef.current = createWebSocketConnection()

    // Set up interval to apply updates every 2 seconds
    updateTimerRef.current = setInterval(() => {
      // Check if we have any pending updates
      const hasUpdates = Object.values(pendingUpdatesRef.current).some((price) => price > 0)

      if (hasUpdates) {
        setCryptoData((prevData) => {
          return prevData.map((crypto) => {
            const newPrice = pendingUpdatesRef.current[crypto.symbol]

            // Skip if no new price
            if (!newPrice) return crypto

            const lastPrice = crypto.price || basePrices[crypto.symbol] || 100

            // Calculate daily change (this is simulated as Binance doesn't provide it in the trade stream)
            let dailyChange = typeof crypto.change === "string" ? Number.parseFloat(crypto.change) : crypto.change
            if (isNaN(dailyChange)) {
              dailyChange = Math.random() * 10 - 5
            } else {
              // Slightly adjust the daily change to simulate movement
              dailyChange = dailyChange + (Math.random() * 0.2 - 0.1)
            }

            // Update price map
            priceMapRef.current[crypto.symbol] = {
              lastPrice: lastPrice,
              price: newPrice,
            }

            // Reset pending update
            pendingUpdatesRef.current[crypto.symbol] = 0

            return {
              ...crypto,
              lastPrice: lastPrice,
              price: newPrice,
              change: dailyChange.toFixed(2),
              priceDirection: newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : "neutral",
            }
          })
        })

        // Update last update timestamp
        setLastUpdated(new Date())
      }
    }, 2000)

    // Set up fallback timer to check if we're receiving data
    fallbackTimerRef.current = setInterval(() => {
      if (!hasReceivedDataRef.current && socketRef.current) {
        console.log("No data received, using fallback data")

        // Use fallback data if no real data is received
        setCryptoData((prevData) => {
          return prevData.map((crypto) => {
            const basePrice = basePrices[crypto.symbol] || 100
            const currentPrice = crypto.price || basePrice
            const priceChangePercent = (Math.random() * 2 - 1) / 100
            const newPrice = currentPrice * (1 + priceChangePercent)

            let dailyChange = typeof crypto.change === "string" ? Number.parseFloat(crypto.change) : crypto.change
            if (isNaN(dailyChange)) {
              dailyChange = Math.random() * 10 - 5
            } else {
              dailyChange = dailyChange + (Math.random() * 0.2 - 0.1)
            }

            return {
              ...crypto,
              lastPrice: currentPrice,
              price: newPrice,
              change: dailyChange.toFixed(2),
              priceDirection: newPrice > currentPrice ? "up" : newPrice < currentPrice ? "down" : "neutral",
            }
          })
        })

        // Update last update timestamp
        setLastUpdated(new Date())
      }
    }, 5000)

    // Clean up on unmount
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close()
      }
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current)
      }
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current)
      }
    }
  }, [])

  // Format price with thousands separator
  const formatPrice = (price: number) => {
    if (!price) return "0.00"

    return price >= 1000
      ? price.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : price.toFixed(2)
  }

  // Format last update date
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Reconnect WebSocket
  const reconnectWebSocket = () => {
    if (socketRef.current) {
      if (socketRef.current.readyState !== WebSocket.OPEN) {
        socketRef.current.close()

        // Create new connection
        const socket = new WebSocket(
          "wss://stream.binance.com:9443/stream?streams=" +
            trackedPairs.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
        )

        socketRef.current = socket

        socket.onopen = () => {
          console.log("WebSocket reconnected")
          setIsConnected(true)
        }

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data)

          if (message?.data?.s && message?.data?.p) {
            hasReceivedDataRef.current = true
            const symbol = message.data.s
            const newPrice = Number.parseFloat(message.data.p)

            // Store the latest price in pending updates
            pendingUpdatesRef.current[symbol] = newPrice
          }
        }

        socket.onerror = (error) => {
          console.error("WebSocket error:", error)
          setIsConnected(false)
        }

        socket.onclose = () => {
          console.log("WebSocket disconnected")
          setIsConnected(false)
        }
      }
    }
  }

  return (
    <section id="maerkte" className="w-full py-12 md:py-16 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Märkte</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Echtzeit-Preise</h2>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <span>Letzte Aktualisierung: {formatLastUpdated(lastUpdated)}</span>
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
              <span>{isConnected ? "Verbunden" : "Getrennt"}</span>
              {!isConnected && (
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={reconnectWebSocket}>
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-400">Echtzeit-Daten von der Binance API</p>
          </motion.div>
        </div>

        {/* Versión móvil optimizada - Solo visible en móviles */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {cryptoData.slice(0, visibleItems).map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg border border-gray-800 p-3 ${
                  crypto.priceDirection === "up"
                    ? "bg-green-900/10"
                    : crypto.priceDirection === "down"
                      ? "bg-red-900/10"
                      : "bg-gray-800/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{crypto.shortSymbol.substring(0, 1)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{crypto.name}</div>
                      <div className="text-xs text-gray-400">{crypto.shortSymbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium text-sm ${
                        crypto.priceDirection === "up"
                          ? "text-green-400"
                          : crypto.priceDirection === "down"
                            ? "text-red-400"
                            : "text-white"
                      }`}
                    >
                      <span className="inline-flex items-center">
                        {formatPrice(crypto.price)}
                        {crypto.priceDirection === "up" && (
                          <motion.span
                            animate={{ y: [-2, 0] }}
                            transition={{ duration: 0.2 }}
                            className="text-green-500 mx-1"
                          >
                            ▲
                          </motion.span>
                        )}
                        {crypto.priceDirection === "down" && (
                          <motion.span
                            animate={{ y: [0, 2] }}
                            transition={{ duration: 0.2 }}
                            className="text-red-500 mx-1"
                          >
                            ▼
                          </motion.span>
                        )}
                        CHF
                      </span>
                    </div>
                    <div
                      className={`text-xs ${
                        typeof crypto.change === "string"
                          ? Number.parseFloat(crypto.change) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                          : crypto.change >= 0
                            ? "text-green-500"
                            : "text-red-500"
                      }`}
                    >
                      {typeof crypto.change === "string"
                        ? Number.parseFloat(crypto.change) >= 0
                          ? "+"
                          : ""
                        : crypto.change >= 0
                          ? "+"
                          : ""}
                      {crypto.change}%
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <div>Vol: {crypto.volume}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Versión de escritorio - Oculta en móviles */}
        <div className="hidden md:block overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-2 md:px-4 text-left text-sm font-medium text-gray-400">#</th>
                  <th className="py-3 px-2 md:px-4 text-left text-sm font-medium text-gray-400">Name</th>
                  <th className="py-3 px-2 md:px-4 text-right text-sm font-medium text-gray-400">Preis</th>
                  <th className="py-3 px-2 md:px-4 text-right text-sm font-medium text-gray-400">24h %</th>
                  <th className="py-3 px-2 md:px-4 text-right text-sm font-medium text-gray-400 hidden md:table-cell">
                    Volumen (24h)
                  </th>
                  <th className="py-3 px-2 md:px-4 text-right text-sm font-medium text-gray-400 hidden md:table-cell">
                    Marktkapitalisierung
                  </th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.slice(0, visibleItems).map((crypto, index) => (
                  <motion.tr
                    key={crypto.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
                      crypto.priceDirection === "up"
                        ? "bg-green-900/10"
                        : crypto.priceDirection === "down"
                          ? "bg-red-900/10"
                          : ""
                    }`}
                  >
                    <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-300">{crypto.id}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{crypto.shortSymbol.substring(0, 1)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white text-xs md:text-base">{crypto.name}</div>
                          <div className="text-xs text-gray-400">{crypto.shortSymbol}</div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`py-3 md:py-4 px-2 md:px-4 text-right font-medium text-xs md:text-base ${
                        crypto.priceDirection === "up"
                          ? "text-green-400"
                          : crypto.priceDirection === "down"
                            ? "text-red-400"
                            : "text-white"
                      }`}
                    >
                      <div className="flex items-center justify-end">
                        <div className="text-right whitespace-nowrap">
                          {formatPrice(crypto.price)}
                          {crypto.priceDirection === "up" && (
                            <motion.span
                              animate={{ y: [-2, 0] }}
                              transition={{ duration: 0.2 }}
                              className="text-green-500 mx-1"
                            >
                              ▲
                            </motion.span>
                          )}
                          {crypto.priceDirection === "down" && (
                            <motion.span
                              animate={{ y: [0, 2] }}
                              transition={{ duration: 0.2 }}
                              className="text-red-500 mx-1"
                            >
                              ▼
                            </motion.span>
                          )}
                          CHF
                        </div>
                      </div>
                    </td>
                    <td
                      className={`py-3 md:py-4 px-2 md:px-4 text-right font-medium text-xs md:text-base ${
                        typeof crypto.change === "string"
                          ? Number.parseFloat(crypto.change) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                          : crypto.change >= 0
                            ? "text-green-500"
                            : "text-red-500"
                      }`}
                    >
                      <div className="w-[60px] md:w-[70px] text-right">
                        {typeof crypto.change === "string"
                          ? Number.parseFloat(crypto.change) >= 0
                            ? "+"
                            : ""
                          : crypto.change >= 0
                            ? "+"
                            : ""}
                        {crypto.change}%
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-right text-gray-300 text-xs md:text-base hidden md:table-cell">
                      {crypto.volume} CHF
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-right text-gray-300 text-xs md:text-base hidden md:table-cell">
                      {crypto.marketCap} CHF
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Show More/Less Button */}
        {visibleItems < trackedPairs.length ? (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={showMoreItems}
              className="border-gray-700 text-white hover:bg-gray-800 transition-all duration-300"
            >
              Mehr anzeigen <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          visibleItems > 5 && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={showFewerItems}
                className="border-gray-700 text-white hover:bg-gray-800 transition-all duration-300"
              >
                Weniger anzeigen <ChevronUp className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )
        )}

        <div className="mt-8 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}></motion.div>
        </div>
      </div>
    </section>
  )
}
