"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, RefreshCw, DollarSign, Bitcoin, ChevronDown, ChevronUp } from "lucide-react"

// Define types for the API response
interface FundingFee {
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
  code: number
  msg: string
  data: FundingFee[]
}

export default function BingXFundingFees() {
  // URL of the PHP API
  const PHP_API_URL = "https://web.lweb.ch/api.php"

  const [fundingFees, setFundingFees] = useState<FundingFee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [buttonClicked, setButtonClicked] = useState<string | null>(null)

  // State for pagination
  const [visibleItems, setVisibleItems] = useState(6)
  const itemsPerPage = 6

  // Function to format dates
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

  // Function to format numbers with thousands separator
  const formatNumber = (numStr: string, decimals = 6) => {
    const num = Number.parseFloat(numStr)
    if (isNaN(num)) return "0.00"

    return num.toLocaleString("de-CH", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  // Calculate total funding fees
  const calculateTotalFundingFees = () => {
    return fundingFees
      .filter((fee) => fee.incomeType === "FUNDING_FEE")
      .reduce((total, fee) => total + Number.parseFloat(fee.income), 0)
  }

  // Function to handle showing more or less items
  const handleShowMoreLess = () => {
    console.log("Show More/Less button clicked")
    setButtonClicked("showMore")

    setTimeout(() => {
      setButtonClicked(null)
    }, 300)

    if (visibleItems < fundingFees.length) {
      // Show more
      setVisibleItems(Math.min(visibleItems + itemsPerPage, fundingFees.length))
    } else {
      // Show less
      setVisibleItems(itemsPerPage)
    }
  }

  // Function to fetch funding fees
  const fetchFundingFees = () => {
    console.log("Refresh button clicked")
    setButtonClicked("refresh")

    setTimeout(() => {
      setButtonClicked(null)
    }, 300)

    setIsLoading(true)
    setError(null)

    fetch(PHP_API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`)
        }
        return response.text()
      })
      .then((responseText) => {
        // Try to parse the response as JSON
        let data: BingXApiResponse
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          throw new Error(`Fehler beim Parsen der JSON-Antwort: ${e instanceof Error ? e.message : String(e)}`)
        }

        // Check if there's an error in the response
        if (data.code !== 0) {
          throw new Error(`API-Fehler: ${data.msg || "Unbekannter Fehler"}`)
        }

        // Extract the funding fees from the data structure
        const fees = data.data || []

        // Set the funding fees
        setFundingFees(fees)
        setLastUpdated(new Date())

        // Reset visible items to initial value when new data is loaded
        setVisibleItems(itemsPerPage)
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Finanzierungsgebühren:", err)
        setError(err instanceof Error ? err.message : "Unbekannter Fehler")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Load funding fees when the component mounts
  useEffect(() => {
    fetchFundingFees()
  }, [])

  // Function to get the appropriate color class based on income type
  const getIncomeTypeColorClass = (incomeType: string) => {
    switch (incomeType) {
      case "FUNDING_FEE":
        return "bg-green-500/20 text-green-400"
      case "TRADING_FEE":
        return "bg-red-500/20 text-red-400"
      case "REALIZED_PNL":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  // Function to translate income type
  const translateIncomeType = (incomeType: string) => {
    switch (incomeType) {
      case "FUNDING_FEE":
        return "FINANZIERUNGSGEBÜHR"
      case "TRADING_FEE":
        return "HANDELSGEBÜHR"
      case "REALIZED_PNL":
        return "REALISIERTER G/V"
      default:
        return incomeType
    }
  }

  // Function to translate info
  const translateInfo = (info: string) => {
    switch (info) {
      case "Funding Fee":
        return "Finanzierungsgebühr"
      case "Position opening fee":
        return "Positionseröffnungsgebühr"
      case "Position closing fee":
        return "Positionsschließungsgebühr"
      case "Buy to Close":
        return "Kauf zum Schließen"
      default:
        return info
    }
  }

  return (
    <section id="bingx-funding-fees" className="w-full py-8 md:py-16 bg-gray-950">
      <div className="container px-3 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400 mb-3">BingX</div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl text-white mb-3">
            BingX Finanzierungsgebühren
          </h2>
          <p className="max-w-[700px] mx-auto text-sm md:text-base text-gray-400">
            Hier zeige ich meine Finanzierungsgebühren von BingX für meine Handelsstrategie.
          </p>
        </motion.div>

        {fundingFees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-green-500/20 p-2 md:p-3 rounded-full">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-medium text-white">Gesamte Finanzierungsgebühren</h3>
                  <p className="text-xl md:text-2xl font-bold text-green-400">
                    {formatNumber(calculateTotalFundingFees().toString(), 8)} USDT
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-blue-500/20 p-2 md:p-3 rounded-full">
                  <Bitcoin className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-medium text-white">Hauptpaar</h3>
                  <p className="text-xl md:text-2xl font-bold text-blue-400">BTC-USDT</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Refresh button - Completely redesigned for mobile */}
        <div className="mb-4 md:mb-6">
          <div
            className={`
              relative w-full md:w-auto inline-flex items-center justify-center 
              px-4 py-4 md:py-3 text-base font-medium rounded-lg 
              bg-gray-800 text-white shadow-sm 
              hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
              active:bg-gray-600 cursor-pointer z-10
              ${buttonClicked === "refresh" ? "bg-gray-600 scale-95" : ""}
            `}
            onClick={fetchFundingFees}
            role="button"
            tabIndex={0}
          >
            <RefreshCw className="h-5 w-5 md:h-4 md:w-4 mr-3 md:mr-2" />
            <span>Aktualisieren</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20">
              <div className="animate-spin h-8 w-8 md:h-10 md:w-10 border-4 border-cyan-400 rounded-full border-t-transparent mb-3 md:mb-4"></div>
              <p className="text-sm md:text-base text-gray-400">Finanzierungsgebühren werden geladen...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg
                  className="h-6 w-6 md:h-8 md:w-8 text-red-500"
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
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <p className="text-sm md:text-base text-red-400 mb-2">{error}</p>
              <div
                className="
                  inline-flex items-center justify-center 
                  px-4 py-3 text-base font-medium rounded-lg 
                  bg-gray-800 text-white shadow-sm 
                  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
                  active:bg-gray-600 cursor-pointer
                "
                onClick={fetchFundingFees}
                role="button"
                tabIndex={0}
              >
                Erneut versuchen
              </div>
            </div>
          ) : fundingFees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              </div>
              <p className="text-sm md:text-base text-gray-400 mb-2">Keine Finanzierungsgebühren gefunden</p>
              <p className="text-xs md:text-sm text-gray-500 max-w-md text-center px-4">
                Es wurden keine Finanzierungsgebühren in Ihrem BingX-Konto gefunden. Sobald Sie Transaktionen
                durchführen, werden sie hier angezeigt.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop view - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Paar</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Typ</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Einkommen</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Vermögenswert</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Info</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundingFees.slice(0, visibleItems).map((fee) => (
                      <tr key={fee.tranId} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4 align-middle font-medium text-white">{fee.symbol}</td>
                        <td className="p-4 align-middle">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIncomeTypeColorClass(
                              fee.incomeType,
                            )}`}
                          >
                            {translateIncomeType(fee.incomeType)}
                          </span>
                        </td>
                        <td
                          className={`p-4 align-middle ${
                            Number.parseFloat(fee.income) >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {formatNumber(fee.income, 8)}
                        </td>
                        <td className="p-4 align-middle text-gray-300">{fee.asset}</td>
                        <td className="p-4 align-middle text-gray-300">{translateInfo(fee.info)}</td>
                        <td className="p-4 align-middle text-gray-400">
                          <div className="flex items-center">
                            <Clock className="mr-1.5 h-3 w-3" />
                            {formatDate(fee.time)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - Card layout */}
              <div className="md:hidden">
                {fundingFees.slice(0, visibleItems).map((fee) => (
                  <div key={fee.tranId} className="p-3 border-b border-gray-800 hover:bg-gray-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">{fee.symbol}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getIncomeTypeColorClass(
                          fee.incomeType,
                        )}`}
                      >
                        {translateIncomeType(fee.incomeType)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Einkommen</p>
                        <p className={Number.parseFloat(fee.income) >= 0 ? "text-green-400" : "text-red-400"}>
                          {formatNumber(fee.income, 8)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Vermögenswert</p>
                        <p className="text-gray-300">{fee.asset}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Info</p>
                        <p className="text-gray-300">{translateInfo(fee.info)}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">Datum</p>
                        <p className="text-gray-400 flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(fee.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less button - Completely redesigned for mobile */}
              {fundingFees.length > itemsPerPage && (
                <div className="p-4">
                  <div
                    className={`
                      relative w-full inline-flex items-center justify-center 
                      px-4 py-4 md:py-3 text-base font-medium rounded-lg 
                      bg-gray-800 text-white shadow-sm 
                      hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
                      active:bg-gray-600 cursor-pointer z-10
                      ${buttonClicked === "showMore" ? "bg-gray-600 scale-95" : ""}
                    `}
                    onClick={handleShowMoreLess}
                    role="button"
                    tabIndex={0}
                  >
                    {visibleItems < fundingFees.length ? (
                      <>
                        <ChevronDown className="h-5 w-5 md:h-4 md:w-4 mr-3 md:mr-2" />
                        <span>Mehr anzeigen</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-5 w-5 md:h-4 md:w-4 mr-3 md:mr-2" />
                        <span>Weniger anzeigen</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {lastUpdated && (
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-gray-500">
              Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString("de-CH")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
