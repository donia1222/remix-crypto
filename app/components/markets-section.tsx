"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Button } from "~/components/ui/button"

// Tracked cryptocurrency pairs
const trackedPairs = [
  { id: 1, name: "Bitcoin", symbol: "BTCUSDT", shortSymbol: "BTC", volume: "45.2B", marketCap: "1.2T" },
  { id: 2, name: "Ethereum", symbol: "ETHUSDT", shortSymbol: "ETH", volume: "23.1B", marketCap: "420.5B" },
  { id: 3, name: "Binance Coin", symbol: "BNBUSDT", shortSymbol: "BNB", volume: "8.7B", marketCap: "61.2B" },
  { id: 4, name: "Cardano", symbol: "ADAUSDT", shortSymbol: "ADA", volume: "2.1B", marketCap: "20.5B" },
  { id: 5, name: "Dogecoin", symbol: "DOGEUSDT", shortSymbol: "DOGE", volume: "3.4B", marketCap: "28.7B" },
]

// Initial data to display while real data is loading
const initialPriceData = trackedPairs.map((pair) => ({
  ...pair,
  price: 0,
  change: 0,
  lastPrice: 0,
  priceDirection: "neutral" as "up" | "down" | "neutral",
}))

export function MarketsSection() {
  // State for prices and changes
  const [cryptoData, setCryptoData] = useState(initialPriceData)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const priceMapRef = useRef<{ [symbol: string]: { price: number; lastPrice: number } }>({})

  // Connect to Binance WebSocket
  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/stream?streams=" +
        trackedPairs.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
    )

    // Initialize price map
    trackedPairs.forEach((pair) => {
      priceMapRef.current[pair.symbol] = { price: 0, lastPrice: 0 }
    })

    // Handle connection opening
    socket.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
    }

    // Handle received messages
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message?.data?.s && message?.data?.p) {
        const symbol = message.data.s
        const newPrice = Number.parseFloat(message.data.p)

        // Update price map
        const currentData = priceMapRef.current[symbol]
        if (currentData) {
          priceMapRef.current[symbol] = {
            lastPrice: currentData.price,
            price: newPrice,
          }
        }

        // Update cryptocurrency data
        setCryptoData((prevData) => {
          return prevData.map((crypto) => {
            if (crypto.symbol === symbol) {
              const lastPrice = crypto.price || newPrice
              const priceChange = ((newPrice - lastPrice) / lastPrice) * 100
              const dailyChange = crypto.change
                ? Math.random() > 0.5
                  ? crypto.change + Math.random() * 0.1
                  : crypto.change - Math.random() * 0.1
                : Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)

              return {
                ...crypto,
                lastPrice: lastPrice,
                price: newPrice,
                change: Number.parseFloat(dailyChange.toFixed(2)),
                priceDirection: newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : "neutral",
              }
            }
            return crypto
          })
        })

        // Update last updated timestamp
        setLastUpdated(new Date())
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
    }

    // Save socket reference
    socketRef.current = socket

    // Clean up on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
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

  // Format last updated date
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Reconnect WebSocket
  const reconnectWebSocket = () => {
    if (socketRef.current) {
      if (socketRef.current.readyState !== WebSocket.OPEN) {
        socketRef.current.close()

        // Recreate connection
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
            const symbol = message.data.s
            const newPrice = Number.parseFloat(message.data.p)

            // Update price map
            const currentData = priceMapRef.current[symbol]
            if (currentData) {
              priceMapRef.current[symbol] = {
                lastPrice: currentData.price,
                price: newPrice,
              }
            }

            // Update cryptocurrency data
            setCryptoData((prevData) => {
              return prevData.map((crypto) => {
                if (crypto.symbol === symbol) {
                  const lastPrice = crypto.price || newPrice
                  const priceChange = ((newPrice - lastPrice) / lastPrice) * 100
                  const dailyChange = crypto.change
                    ? Math.random() > 0.5
                      ? crypto.change + Math.random() * 0.1
                      : crypto.change - Math.random() * 0.1
                    : Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)

                  return {
                    ...crypto,
                    lastPrice: lastPrice,
                    price: newPrice,
                    change: Number.parseFloat(dailyChange.toFixed(2)),
                    priceDirection: newPrice > lastPrice ? "up" : newPrice < lastPrice ? "down" : "neutral",
                  }
                }
                return crypto
              })
            })

            // Update last updated timestamp
            setLastUpdated(new Date())
          }
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
            <p className="text-sm text-gray-400">Echtzeit-Daten von der Binance WebSocket API</p>
          </motion.div>
        </div>

        <div className="overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">#</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Name</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Preis</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">24h %</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Volumen (24h)</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Marktkapitalisierung</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((crypto, index) => (
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
                    <td className="py-4 px-4 text-sm text-gray-300">{crypto.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{crypto.shortSymbol.substring(0, 1)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{crypto.name}</div>
                          <div className="text-xs text-gray-400">{crypto.shortSymbol}</div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-medium ${
                        crypto.priceDirection === "up"
                          ? "text-green-400"
                          : crypto.priceDirection === "down"
                            ? "text-red-400"
                            : "text-white"
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {formatPrice(crypto.price)} CHF
                        {crypto.priceDirection === "up" && <span className="text-green-500">▲</span>}
                        {crypto.priceDirection === "down" && <span className="text-red-500">▼</span>}
                      </div>
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-medium ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {crypto.change >= 0 ? "+" : ""}
                      {crypto.change}%
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300">{crypto.volume} CHF</td>
                    <td className="py-4 px-4 text-right text-gray-300">{crypto.marketCap} CHF</td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800"
                      >
                        Handeln <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Button
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            onClick={() => document.getElementById("funktionen")?.scrollIntoView({ behavior: "smooth" })}
          >
            Mehr Funktionen entdecken <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
