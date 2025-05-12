"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

// Definir tipos para la respuesta de la API
interface BingXTransaction {
  orderId: string;
  symbol: string;
  side: string;
  price: string;
  vol: string;
  timestamp: number;
}

interface BingXApiResponse {
  code: number;
  msg: string;
  data: {
    fill_orders: BingXTransaction[];
  };
}

export default function BingXTransactions() {
  // URL del PHP que maneja toda la lógica de la API
  const PHP_API_URL = "https://web.lweb.ch/crypto/api.php";

  const [transactions, setTransactions] = useState<BingXTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Función para formatear fechas
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Función para formatear números con separador de miles
  const formatNumber = (numStr: string, decimals = 6) => {
    const num = Number.parseFloat(numStr);
    if (isNaN(num)) return "0.00";

    return num.toLocaleString("de-CH", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Función para probar la conexión con el servidor PHP
  const testPhpConnection = async () => {
    try {
      setDebugInfo("Probando conexión con el servidor PHP...");
      
      // Usar fetch con modo no-cors para evitar problemas de CORS
      const response = await fetch(PHP_API_URL, {
        method: "GET",
        mode: "cors", // Intentar con cors primero
        headers: {
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      setDebugInfo(`Respuesta del servidor PHP: ${text.substring(0, 200)}...`);
      
      try {
        // Intentar parsear la respuesta como JSON
        const data = JSON.parse(text);
        setDebugInfo(`Respuesta parseada: ${JSON.stringify(data, null, 2)}`);
      } catch (e) {
        setDebugInfo(`Error al parsear JSON: ${e instanceof Error ? e.message : String(e)}`);
      }
    } catch (err) {
      setDebugInfo(`Error al conectar con el servidor PHP: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Función para obtener las transacciones
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      setDebugInfo("Iniciando solicitud a la API...");
      
      // Intentar con diferentes opciones de fetch para resolver problemas de CORS
      const response = await fetch(PHP_API_URL, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      setDebugInfo(`Respuesta recibida. Estado: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Obtener el texto de la respuesta para depuración
      const responseText = await response.text();
      setDebugInfo(prev => `${prev}\nRespuesta: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
      
      // Intentar parsear la respuesta como JSON
      let data: BingXApiResponse;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Error al parsear la respuesta JSON: ${e instanceof Error ? e.message : String(e)}`);
      }

      setDebugInfo(prev => `${prev}\nDatos parseados: ${JSON.stringify(data, null, 2)}`);

      // Verificar si hay un error en la respuesta
      if (data.code !== 0) {
        throw new Error(`Error de la API: ${data.msg || 'Error desconocido'}`);
      }

      // Extraer las transacciones de la estructura de datos
      const orders = data.data?.fill_orders || [];
      
      setDebugInfo(prev => `${prev}\nTransacciones encontradas: ${orders.length}`);
      
      // Establecer las transacciones
      setTransactions(orders);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setDebugInfo(prev => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar transacciones al montar el componente
  useEffect(() => {
    // Primero probar la conexión
    testPhpConnection();
    
    // Luego intentar obtener las transacciones
    setTimeout(() => {
      fetchTransactions();
    }, 2000);
  }, []);

  return (
    <section id="bingx-transaktionen" className="w-full py-12 md:py-24 bg-gray-950">
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
            BingX-Transaktionen
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-400">
            Hier zeige ich meine abgeschlossenen Transaktionen, die ich für meine Handelsstrategie nutze.
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-6">

          
          <div className="flex gap-2">

            
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 rounded-md border border-gray-700 text-white hover:bg-gray-800 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-cyan-400 rounded-full border-t-transparent mb-4"></div>
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
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={fetchTransactions}
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
              <p className="text-gray-400 mb-2">Keine Transaktionen gefunden</p>
              <p className="text-gray-500 max-w-md text-center">
                Es wurden keine Transaktionen in meinem BingX-Konto gefunden. Sobald ich Transaktionen durchführe,
                werden sie hier angezeigt.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Paar</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Typ</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Preis</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Menge</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-300">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.orderId} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 align-middle font-medium text-white">{tx.orderId}</td>
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
                      <td className="p-4 align-middle text-gray-300">{formatNumber(tx.price, 2)}</td>
                      <td className="p-4 align-middle text-gray-300">{formatNumber(tx.vol)}</td>
                      <td className="p-4 align-middle text-gray-400">
                        <div className="flex items-center">
                          <Clock className="mr-1.5 h-3 w-3" />
                          {formatDate(tx.timestamp)}
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
  );
}