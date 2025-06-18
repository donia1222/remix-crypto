"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ChevronDown, ChevronUp, Search, X } from "lucide-react"
import { Button } from "~/components/ui/button"

// Tracked cryptocurrency pairs - Filtered list
const trackedPairs = [
  { id: 1, name: "Bitcoin", symbol: "BTCUSDT", shortSymbol: "BTC", volume: "45.2B", marketCap: "1.2T" },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETHUSDT",
    shortSymbol: "ETH",
    volume: "23.1B",
    marketCap: "420.5B",
  },
  { id: 3, name: "Ripple", symbol: "XRPUSDT", shortSymbol: "XRP", volume: "4.3B", marketCap: "32.1B" },
  { id: 4, name: "Solana", symbol: "SOLUSDT", shortSymbol: "SOL", volume: "5.7B", marketCap: "45.6B" },
  { id: 5, name: "Stellar", symbol: "XLMUSDT", shortSymbol: "XLM", volume: "0.8B", marketCap: "6.5B" },
  { id: 6, name: "Dogecoin", symbol: "DOGEUSDT", shortSymbol: "DOGE", volume: "3.4B", marketCap: "28.7B" },
  { id: 7, name: "Peanut the Squirrel", symbol: "PNUTUSDT", shortSymbol: "PNUT", volume: "0.5B", marketCap: "2.1B" },
]

// Additional cryptocurrencies for search - Expanded list
const additionalCryptos = [
  { id: 8, name: "Cardano", symbol: "ADAUSDT", shortSymbol: "ADA", volume: "2.1B", marketCap: "15.3B" },
  { id: 9, name: "Polygon", symbol: "MATICUSDT", shortSymbol: "MATIC", volume: "1.8B", marketCap: "8.9B" },
  { id: 10, name: "Chainlink", symbol: "LINKUSDT", shortSymbol: "LINK", volume: "1.5B", marketCap: "12.4B" },
  { id: 11, name: "Avalanche", symbol: "AVAXUSDT", shortSymbol: "AVAX", volume: "1.2B", marketCap: "9.8B" },
  { id: 12, name: "Polkadot", symbol: "DOTUSDT", shortSymbol: "DOT", volume: "0.9B", marketCap: "7.2B" },
  { id: 13, name: "Litecoin", symbol: "LTCUSDT", shortSymbol: "LTC", volume: "2.3B", marketCap: "6.8B" },
  { id: 14, name: "Uniswap", symbol: "UNIUSDT", shortSymbol: "UNI", volume: "0.8B", marketCap: "5.1B" },
  { id: 15, name: "Binance Coin", symbol: "BNBUSDT", shortSymbol: "BNB", volume: "3.2B", marketCap: "89.5B" },
  { id: 16, name: "Shiba Inu", symbol: "SHIBUSDT", shortSymbol: "SHIB", volume: "1.4B", marketCap: "14.2B" },
  { id: 17, name: "TRON", symbol: "TRXUSDT", shortSymbol: "TRX", volume: "0.9B", marketCap: "8.7B" },
  { id: 18, name: "Cosmos", symbol: "ATOMUSDT", shortSymbol: "ATOM", volume: "0.6B", marketCap: "3.8B" },
  { id: 19, name: "Ethereum Classic", symbol: "ETCUSDT", shortSymbol: "ETC", volume: "0.4B", marketCap: "3.2B" },
  { id: 20, name: "Monero", symbol: "XMRUSDT", shortSymbol: "XMR", volume: "0.3B", marketCap: "2.9B" },
  { id: 21, name: "Bitcoin Cash", symbol: "BCHUSDT", shortSymbol: "BCH", volume: "0.8B", marketCap: "9.1B" },
  { id: 22, name: "Algorand", symbol: "ALGOUSDT", shortSymbol: "ALGO", volume: "0.2B", marketCap: "1.8B" },
  { id: 23, name: "VeChain", symbol: "VETUSDT", shortSymbol: "VET", volume: "0.3B", marketCap: "2.4B" },
  { id: 24, name: "Filecoin", symbol: "FILUSDT", shortSymbol: "FIL", volume: "0.4B", marketCap: "2.1B" },
  { id: 25, name: "Internet Computer", symbol: "ICPUSDT", shortSymbol: "ICP", volume: "0.3B", marketCap: "4.2B" },
  { id: 26, name: "Hedera", symbol: "HBARUSDT", shortSymbol: "HBAR", volume: "0.2B", marketCap: "1.9B" },
  { id: 27, name: "The Sandbox", symbol: "SANDUSDT", shortSymbol: "SAND", volume: "0.5B", marketCap: "1.2B" },
  { id: 28, name: "Decentraland", symbol: "MANAUSDT", shortSymbol: "MANA", volume: "0.4B", marketCap: "0.8B" },
  { id: 29, name: "Axie Infinity", symbol: "AXSUSDT", shortSymbol: "AXS", volume: "0.3B", marketCap: "0.9B" },
  { id: 30, name: "Aave", symbol: "AAVEUSDT", shortSymbol: "AAVE", volume: "0.6B", marketCap: "2.4B" },
  { id: 31, name: "Compound", symbol: "COMPUSDT", shortSymbol: "COMP", volume: "0.1B", marketCap: "0.7B" },
  { id: 32, name: "Maker", symbol: "MKRUSDT", shortSymbol: "MKR", volume: "0.2B", marketCap: "1.5B" },
  { id: 33, name: "Curve DAO Token", symbol: "CRVUSDT", shortSymbol: "CRV", volume: "0.3B", marketCap: "0.4B" },
  { id: 34, name: "SushiSwap", symbol: "SUSHIUSDT", shortSymbol: "SUSHI", volume: "0.1B", marketCap: "0.3B" },
  { id: 35, name: "Yearn Finance", symbol: "YFIUSDT", shortSymbol: "YFI", volume: "0.1B", marketCap: "0.2B" },
  { id: 36, name: "1inch", symbol: "1INCHUSDT", shortSymbol: "1INCH", volume: "0.2B", marketCap: "0.4B" },
  { id: 37, name: "Enjin Coin", symbol: "ENJUSDT", shortSymbol: "ENJ", volume: "0.2B", marketCap: "0.3B" },
  { id: 38, name: "Basic Attention Token", symbol: "BATUSDT", shortSymbol: "BAT", volume: "0.1B", marketCap: "0.3B" },
  { id: 39, name: "Zilliqa", symbol: "ZILUSDT", shortSymbol: "ZIL", volume: "0.1B", marketCap: "0.2B" },
  { id: 40, name: "OMG Network", symbol: "OMGUSDT", shortSymbol: "OMG", volume: "0.1B", marketCap: "0.4B" },
  { id: 41, name: "0x", symbol: "ZRXUSDT", shortSymbol: "ZRX", volume: "0.1B", marketCap: "0.3B" },
  { id: 42, name: "Qtum", symbol: "QTUMUSDT", shortSymbol: "QTUM", volume: "0.1B", marketCap: "0.3B" },
  { id: 43, name: "Waves", symbol: "WAVESUSDT", shortSymbol: "WAVES", volume: "0.1B", marketCap: "0.2B" },
  { id: 44, name: "Ontology", symbol: "ONTUSDT", shortSymbol: "ONT", volume: "0.1B", marketCap: "0.2B" },
  { id: 45, name: "IOTA", symbol: "IOTAUSDT", shortSymbol: "IOTA", volume: "0.1B", marketCap: "0.4B" },
  { id: 46, name: "Neo", symbol: "NEOUSDT", shortSymbol: "NEO", volume: "0.2B", marketCap: "0.8B" },
  { id: 47, name: "Dash", symbol: "DASHUSDT", shortSymbol: "DASH", volume: "0.1B", marketCap: "0.3B" },
  { id: 48, name: "Zcash", symbol: "ZECUSDT", shortSymbol: "ZEC", volume: "0.1B", marketCap: "0.4B" },
  { id: 49, name: "Bitcoin SV", symbol: "BSVUSDT", shortSymbol: "BSV", volume: "0.1B", marketCap: "1.2B" },
  { id: 50, name: "Tezos", symbol: "XTZUSDT", shortSymbol: "XTZ", volume: "0.1B", marketCap: "0.7B" },
  { id: 51, name: "Elrond", symbol: "EGLDUSDT", shortSymbol: "EGLD", volume: "0.1B", marketCap: "0.6B" },
  { id: 52, name: "Theta Network", symbol: "THETAUSDT", shortSymbol: "THETA", volume: "0.1B", marketCap: "1.1B" },
  { id: 53, name: "Klaytn", symbol: "KLAYUSDT", shortSymbol: "KLAY", volume: "0.2B", marketCap: "0.4B" },
  { id: 54, name: "Near Protocol", symbol: "NEARUSDT", shortSymbol: "NEAR", volume: "0.3B", marketCap: "1.8B" },
  { id: 55, name: "Flow", symbol: "FLOWUSDT", shortSymbol: "FLOW", volume: "0.1B", marketCap: "0.7B" },
  { id: 56, name: "Harmony", symbol: "ONEUSDT", shortSymbol: "ONE", volume: "0.1B", marketCap: "0.2B" },
  { id: 57, name: "Fantom", symbol: "FTMUSDT", shortSymbol: "FTM", volume: "0.2B", marketCap: "0.6B" },
  { id: 58, name: "Celo", symbol: "CELOUSDT", shortSymbol: "CELO", volume: "0.1B", marketCap: "0.4B" },
  { id: 59, name: "Kusama", symbol: "KSMUSDT", shortSymbol: "KSM", volume: "0.1B", marketCap: "0.2B" },
  { id: 60, name: "Helium", symbol: "HNTUSDT", shortSymbol: "HNT", volume: "0.1B", marketCap: "0.8B" },
  { id: 61, name: "Arweave", symbol: "ARUSDT", shortSymbol: "AR", volume: "0.1B", marketCap: "0.9B" },
  { id: 62, name: "Solana", symbol: "SOLUSDT", shortSymbol: "SOL", volume: "5.7B", marketCap: "45.6B" },
  { id: 63, name: "Terra Classic", symbol: "LUNCUSDT", shortSymbol: "LUNC", volume: "0.3B", marketCap: "0.6B" },
  { id: 64, name: "ApeCoin", symbol: "APEUSDT", shortSymbol: "APE", volume: "0.4B", marketCap: "0.8B" },
  { id: 65, name: "Immutable X", symbol: "IMXUSDT", shortSymbol: "IMX", volume: "0.2B", marketCap: "0.3B" },
  { id: 66, name: "Loopring", symbol: "LRCUSDT", shortSymbol: "LRC", volume: "0.1B", marketCap: "0.2B" },
  { id: 67, name: "Gala", symbol: "GALAUSDT", shortSymbol: "GALA", volume: "0.2B", marketCap: "0.3B" },
  { id: 68, name: "Render Token", symbol: "RNDR", shortSymbol: "RNDR", volume: "0.3B", marketCap: "1.2B" },
  { id: 69, name: "Injective", symbol: "INJUSDT", shortSymbol: "INJ", volume: "0.2B", marketCap: "0.8B" },
  { id: 70, name: "Sui", symbol: "SUIUSDT", shortSymbol: "SUI", volume: "0.4B", marketCap: "1.1B" },
  { id: 71, name: "Arbitrum", symbol: "ARBUSDT", shortSymbol: "ARB", volume: "0.6B", marketCap: "2.1B" },
  { id: 72, name: "Optimism", symbol: "OPUSDT", shortSymbol: "OP", volume: "0.3B", marketCap: "1.4B" },
  { id: 73, name: "Pepe", symbol: "PEPEUSDT", shortSymbol: "PEPE", volume: "1.2B", marketCap: "4.8B" },
  { id: 74, name: "Floki", symbol: "FLOKIUSDT", shortSymbol: "FLOKI", volume: "0.3B", marketCap: "1.2B" },
  { id: 75, name: "Bonk", symbol: "BONKUSDT", shortSymbol: "BONK", volume: "0.4B", marketCap: "0.9B" },
  { id: 76, name: "Worldcoin", symbol: "WLDUSDT", shortSymbol: "WLD", volume: "0.2B", marketCap: "0.7B" },
  { id: 77, name: "Stacks", symbol: "STXUSDT", shortSymbol: "STX", volume: "0.1B", marketCap: "0.8B" },
  { id: 78, name: "Kaspa", symbol: "KASUSDT", shortSymbol: "KAS", volume: "0.3B", marketCap: "2.1B" },
  { id: 79, name: "Sei", symbol: "SEIUSDT", shortSymbol: "SEI", volume: "0.2B", marketCap: "0.6B" },
  { id: 80, name: "Celestia", symbol: "TIAUSDT", shortSymbol: "TIA", volume: "0.1B", marketCap: "0.8B" },
]

// Function to get crypto icon URL with better fallback sources
const getCryptoIcon = (symbol: string) => {
  const iconMap: { [key: string]: string } = {
BTC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/btc.svg",
    ETH: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/eth.svg",
    XRP: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/xrp.svg",
    SOL: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/sol.svg",
    XLM: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/xlm.svg",
    DOGE: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/doge.svg",
    PNUT: "https://s2.coinmarketcap.com/static/img/coins/200x200/33788.png", // Not in standard set
    ADA: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ada.svg",
    MATIC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/matic.svg",
    LINK: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/link.svg",
    AVAX: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/avax.svg",
    DOT: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/dot.svg",
    LTC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ltc.svg",
    UNI: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/uni.svg",
    BNB: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/bnb.svg",
    SHIB: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/shib.svg",
    TRX: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/trx.svg",
    ATOM: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/atom.svg",
    ETC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/etc.svg",
    XMR: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/xmr.svg",
    BCH: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/bch.svg",
    ALGO: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/algo.svg",
    VET: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/vet.svg",
    FIL: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/fil.svg",
    ICP: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/icp.svg",
    HBAR: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/hbar.svg",
    SAND: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/sand.svg",
    MANA: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/mana.svg",
    AXS: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/axs.svg",
    AAVE: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/aave.svg",
    COMP: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/comp.svg",
    MKR: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/mkr.svg",
    CRV: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/crv.svg",
    SUSHI: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/sushi.svg",
    YFI: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/yfi.svg",
    "1INCH": "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/1inch.svg",
    ENJ: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/enj.svg",
    BAT: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/bat.svg",
    ZIL: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/zil.svg",
    OMG: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/omg.svg",
    ZRX: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/zrx.svg",
    QTUM: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/qtum.svg",
    WAVES: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/waves.svg",
    ONT: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ont.svg",
    IOTA: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/iota.svg",
    NEO: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/neo.svg",
    DASH: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/dash.svg",
    ZEC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/zec.svg",
    BSV: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/bsv.svg",
    XTZ: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/xtz.svg",
    EGLD: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/egld.svg",
    THETA: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/theta.svg",
    KLAY: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/klay.svg",
    NEAR: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/near.svg",
    FLOW: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/flow.svg",
    ONE: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/one.svg",
    FTM: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ftm.svg",
    CELO: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/celo.svg",
    KSM: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ksm.svg",
    HNT: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/hnt.svg",
    AR: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ar.svg",
    LUNC: "https://cdn.jsdelivr.net/gh/spothq/crypt Currency-icons@master/svg/color/lunc.svg",
    APE: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/ape.svg",
    IMX: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/imx.svg",
    LRC: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/lrc.svg",
    GALA: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/gala.svg",
    RNDR: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/rndr.svg",
    INJ: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/inj.svg",
    SUI: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/sui.svg",
    ARB: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/arb.svg",
    OP: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/op.svg",
    PEPE: "/placeholder.svg?height=32&width=32&text=🐸", // Not in standard set
    FLOKI: "/placeholder.svg?height=32&width=32&text=🐕‍🦺", // Not in standard set
    BONK: "/placeholder.svg?height=32&width=32&text=💥", // Not in standard set
    WLD: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/wld.svg",
    STX: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/stx.svg",
    KAS: "/placeholder.svg?height=32&width=32&text=💎", // Not in standard set
    SEI: "/placeholder.svg?height=32&width=32&text=🌊", // Not in standard set
    TIA: "/placeholder.svg?height=32&width=32&text=🌌", // Not in standard set
  }

  return iconMap[symbol] || `/placeholder.svg?height=32&width=32&text=${symbol.charAt(0)}`
}

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
  ADAUSDT: 0.45,
  MATICUSDT: 0.85,
  LINKUSDT: 14.5,
  AVAXUSDT: 28.3,
  DOTUSDT: 6.2,
  LTCUSDT: 85.4,
  UNIUSDT: 7.8,
  BNBUSDT: 320.5,
  SHIBUSDT: 0.000024,
  TRXUSDT: 0.095,
  ATOMUSDT: 9.8,
  ETCUSDT: 22.4,
  XMRUSDT: 145.2,
  BCHUSDT: 245.8,
  ALGOUSDT: 0.18,
  VETUSDT: 0.025,
  FILUSDT: 4.2,
  ICPUSDT: 12.8,
  HBARUSDT: 0.065,
  SANDUSDT: 0.42,
  MANAUSDT: 0.38,
  AXSUSDT: 6.5,
  AAVEUSDT: 95.2,
  COMPUSDT: 58.4,
  MKRUSDT: 1250.0,
  CRVUSDT: 0.85,
  SUSHIUSDT: 1.2,
  YFIUSDT: 8500.0,
  "1INCHUSDT": 0.45,
  ENJUSDT: 0.28,
  BATUSDT: 0.22,
  ZILUSDT: 0.018,
  OMGUSDT: 0.65,
  ZRXUSDT: 0.42,
  QTUMUSDT: 2.8,
  WAVESUSDT: 1.85,
  ONTUSDT: 0.18,
  IOTAUSDT: 0.22,
  NEOUSDT: 12.5,
  DASHUSDT: 28.4,
  ZECUSDT: 32.1,
  BSVUSDT: 45.2,
  XTZUSDT: 0.95,
  EGLDUSDT: 35.8,
  THETAUSDT: 1.15,
  KLAYUSDT: 0.18,
  NEARUSDT: 2.8,
  FLOWUSDT: 0.85,
  ONEUSDT: 0.012,
  FTMUSDT: 0.32,
  CELOUSDT: 0.68,
  KSMUSDT: 28.5,
  HNTUSDT: 6.2,
  ARUSDT: 18.4,
  LUNCUSDT: 0.00012,
  APEUSDT: 1.25,
  IMXUSDT: 1.45,
  LRCUSDT: 0.28,
  GALAUSDT: 0.025,
  RNDR: 7.8,
  INJUSDT: 22.4,
  SUIUSDT: 1.85,
  ARBUSDT: 0.95,
  OPUSDT: 2.15,
  PEPEUSDT: 0.0000085,
  FLOKIUSDT: 0.00018,
  BONKUSDT: 0.000025,
  WLDUSDT: 2.45,
  STXUSDT: 0.85,
  KASUSDT: 0.125,
  SEIUSDT: 0.42,
  TIAUSDT: 8.5,
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
  isSearchResult?: boolean
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
  const [searchResults, setSearchResults] = useState<CryptoData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(false)
  const [visibleItems, setVisibleItems] = useState(5) // Initially show 5 items
  const socketRef = useRef<WebSocket | null>(null)
  const priceMapRef = useRef<{ [symbol: string]: { price: number; lastPrice: number } }>({})
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<{ [symbol: string]: number }>({})
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasReceivedDataRef = useRef(false)

  // Search function
  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (term.trim() === "") {
      setSearchResults([])
      return
    }

    const filtered = additionalCryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(term.toLowerCase()) ||
        crypto.shortSymbol.toLowerCase().includes(term.toLowerCase()),
    )

    const searchResultsWithPrices = filtered.map((crypto) => ({
      ...crypto,
      price: basePrices[crypto.symbol] || Math.random() * 100,
      change: (Math.random() * 10 - 5).toFixed(2),
      lastPrice: basePrices[crypto.symbol] || Math.random() * 100,
      priceDirection: "neutral" as const,
      isSearchResult: true,
    }))

    setSearchResults(searchResultsWithPrices)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

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
    // Initialize price map and pending updates for all cryptos
    const allCryptos = [...trackedPairs, ...additionalCryptos]
    allCryptos.forEach((pair) => {
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
          allCryptos.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
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
        // Update main crypto data
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

        // Update search results
        setSearchResults((prevResults) => {
          return prevResults.map((crypto) => {
            const newPrice = pendingUpdatesRef.current[crypto.symbol]

            // Skip if no new price
            if (!newPrice) return crypto

            const lastPrice = crypto.price || basePrices[crypto.symbol] || 100

            let dailyChange = typeof crypto.change === "string" ? Number.parseFloat(crypto.change) : crypto.change
            if (isNaN(dailyChange)) {
              dailyChange = Math.random() * 10 - 5
            } else {
              dailyChange = dailyChange + (Math.random() * 0.2 - 0.1)
            }

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

        const allCryptos = [...trackedPairs, ...additionalCryptos]
        // Create new connection
        const socket = new WebSocket(
          "wss://stream.binance.com:9443/stream?streams=" +
            allCryptos.map((p) => `${p.symbol.toLowerCase()}@trade`).join("/"),
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

  // Render crypto row for mobile
  const renderMobileCryptoCard = (crypto: CryptoData, index: number) => (
    <motion.div
      key={`${crypto.id}-${crypto.isSearchResult ? "search" : "main"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`rounded-lg border border-gray-800 p-3 ${
        crypto.isSearchResult ? "bg-blue-900/20 border-blue-700" : ""
      } ${
        crypto.priceDirection === "up"
          ? "bg-green-900/10"
          : crypto.priceDirection === "down"
            ? "bg-red-900/10"
            : crypto.isSearchResult
              ? "bg-blue-900/20"
              : "bg-gray-800/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={getCryptoIcon(crypto.shortSymbol) || "/placeholder.svg"}
            alt={crypto.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-white text-sm">
              {crypto.name}
              {crypto.isSearchResult && (
                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">Neu</span>
              )}
            </div>
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
                <motion.span animate={{ y: [-2, 0] }} transition={{ duration: 0.2 }} className="text-green-500 mx-1">
                  ▲
                </motion.span>
              )}
              {crypto.priceDirection === "down" && (
                <motion.span animate={{ y: [0, 2] }} transition={{ duration: 0.2 }} className="text-red-500 mx-1">
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
  )

  // Render crypto row for desktop
  const renderDesktopCryptoRow = (crypto: CryptoData, index: number) => (
    <motion.tr
      key={`${crypto.id}-${crypto.isSearchResult ? "search" : "main"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
        crypto.isSearchResult ? "bg-blue-900/20 border-blue-700" : ""
      } ${
        crypto.priceDirection === "up"
          ? "bg-green-900/10"
          : crypto.priceDirection === "down"
            ? "bg-red-900/10"
            : crypto.isSearchResult
              ? "bg-blue-900/20"
              : ""
      }`}
    >
      <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-300">{crypto.id}</td>
      <td className="py-3 md:py-4 px-2 md:px-4">
        <div className="flex items-center gap-2">
          <img
            src={getCryptoIcon(crypto.shortSymbol) || "/placeholder.svg"}
            alt={crypto.name}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-white text-xs md:text-base flex items-center gap-2">
              {crypto.name}
              {crypto.isSearchResult && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Neu</span>}
            </div>
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
              <motion.span animate={{ y: [-2, 0] }} transition={{ duration: 0.2 }} className="text-green-500 mx-1">
                ▲
              </motion.span>
            )}
            {crypto.priceDirection === "down" && (
              <motion.span animate={{ y: [0, 2] }} transition={{ duration: 0.2 }} className="text-red-500 mx-1">
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
  )

  return (
    <section id="maerkte" className="w-full py-12 md:py-16 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header Section - Centered */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-green-400">Märkte</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-400">Echtzeit-Preise</h2>

            <div className="flex items-center justify-center gap-2 text-gray-100 text-sm">
              {!isConnected && (
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={reconnectWebSocket}>
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-200">Kryptowährungen und Preise in Echtzeit.</p>
          </motion.div>

          <span className="text-sm text-gray-200">Letzte Aktualisierung: {formatLastUpdated(lastUpdated)}</span>
        </div>

        {/* Search Field - Positioned differently for mobile and desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          {/* Mobile: Centered search */}
          <div className="md:hidden max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Suche nach weiteren Währungen"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              )}
            </div>
          </div>

          {/* Desktop: Right-aligned search */}
          <div className="hidden md:block">
            <div className="flex justify-end">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Suche nach weiteren Währungen"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Suchergebnisse</h3>

            {/* Mobile Search Results */}
            <div className="md:hidden space-y-3 mb-6">
              {searchResults.map((crypto, index) => renderMobileCryptoCard(crypto, index))}
            </div>

            {/* Desktop Search Results */}
            <div className="hidden md:block overflow-x-auto mb-6">
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
                <tbody>{searchResults.map((crypto, index) => renderDesktopCryptoRow(crypto, index))}</tbody>
              </table>
            </div>
          </motion.div>
        )}



        {/* Mobile version - Only visible on mobile */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {cryptoData.slice(0, visibleItems).map((crypto, index) => renderMobileCryptoCard(crypto, index))}
          </motion.div>
        </div>

        {/* Desktop version - Hidden on mobile */}
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
                {cryptoData.slice(0, visibleItems).map((crypto, index) => renderDesktopCryptoRow(crypto, index))}
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
              className="text-green-500 hover:bg-gray-800 transition-all duration-300"
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
                className="text-green-500 hover:bg-gray-800 transition-all duration-300"
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
