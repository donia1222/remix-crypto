"use client"

import { useState, useEffect } from "react";
import { Wallet, RefreshCw, DollarSign, Bitcoin, TrendingUp } from 'lucide-react';

// Definir tipos para la respuesta de la API según la estructura real
interface BingXBalance {
  userId: string;
  asset: string;
  balance: string;
  equity: string;
  unrealizedProfit: string;
  realisedProfit: string;
  availableMargin: string;
  usedMargin: string;
  freezedMargin: string;
  shortUid: string;
}

interface BingXApiResponse {
  code: number;
  msg: string;
  data: {
    balance: BingXBalance;
  };
}

export default function BingXBalance() {
  // URL del PHP que maneja la lógica de la API
  const PHP_API_URL = "https://web.lweb.ch/balance.php";

  const [balanceData, setBalanceData] = useState<BingXBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Función segura para formatear números
  const formatNumber = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return "0.00";
    
    try {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return "0.00";
      return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (e) {
      console.error("Error formatting number:", e);
      return "0.00";
    }
  };

  // Función para obtener el saldo de la API
  const fetchBalance = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      setDebugInfo("Iniciando solicitud a la API...");
      
      // Hacer la solicitud a la API
      const response = await fetch(PHP_API_URL);
      
      setDebugInfo(prev => `${prev}\nRespuesta recibida. Estado: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Obtener el texto de la respuesta para depuración
      const responseText = await response.text();
      setDebugInfo(prev => `${prev}\nRespuesta: ${responseText}`);
      
      // Intentar parsear la respuesta como JSON
      let responseData: BingXApiResponse;
      try {
        responseData = JSON.parse(responseText);
        setDebugInfo(prev => `${prev}\nJSON parseado correctamente`);
      } catch (e) {
        setDebugInfo(prev => `${prev}\nError al parsear JSON: ${e instanceof Error ? e.message : String(e)}`);
        throw new Error("Error al parsear la respuesta JSON");
      }
      
      // Verificar la estructura de la respuesta
      if (!responseData || typeof responseData !== 'object') {
        setDebugInfo(prev => `${prev}\nRespuesta inválida: no es un objeto`);
        throw new Error("Respuesta inválida");
      }
      
      // Verificar si hay un código de error
      if (responseData.code !== undefined && responseData.code !== 0) {
        setDebugInfo(prev => `${prev}\nError de la API: ${responseData.msg || 'Error desconocido'}`);
        throw new Error(`Error de la API: ${responseData.msg || 'Error desconocido'}`);
      }
      
      // Verificar si existe data.balance
      if (!responseData.data || !responseData.data.balance) {
        setDebugInfo(prev => `${prev}\nDatos inválidos: no contiene balance`);
        throw new Error("Datos inválidos: no contiene balance");
      }
      
      // Establecer los datos del balance
      setBalanceData(responseData.data.balance);
      setLastUpdated(new Date());
      setDebugInfo(prev => `${prev}\nDatos cargados correctamente`);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setDebugInfo(prev => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <section className="w-full py-12 bg-gray-950">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400 mb-4">BingX</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Mein BingX-Kontostand
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-400">
            Hier zeige ich meinen aktuellen Kontostand und verfügbare Mittel auf BingX.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            {debugInfo && (
              <details className="text-left bg-gray-800 p-4 rounded-md mb-4 max-w-2xl overflow-auto">
                <summary className="text-cyan-400 cursor-pointer">Debug Information</summary>
                <pre className="text-xs text-gray-300 mt-2 whitespace-pre-wrap">{debugInfo}</pre>
              </details>
            )}
          </div>
          
          <button
            onClick={fetchBalance}
            className="px-4 py-2 rounded-md border border-gray-700 text-white hover:bg-gray-800 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">⟳</span>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Aktualisieren
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="animate-spin h-10 w-10 border-4 border-cyan-400 rounded-full border-t-transparent mb-4"></div>
            <p className="text-gray-400">Mein Kontostand wird geladen...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
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
              onClick={fetchBalance}
              className="px-4 py-2 rounded-md border border-gray-700 text-white hover:bg-gray-800"
            >
              Erneut versuchen
            </button>
          </div>
        ) : balanceData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Saldo total (equity) */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Gesamtvermögen</h3>
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  ${formatNumber(balanceData.equity)}
                </p>
                <p className="text-sm text-gray-400">Gesamtwert aller Assets</p>
              </div>

              {/* Saldo disponible (availableMargin) */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Verfügbar</h3>
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  ${formatNumber(balanceData.availableMargin)}
                </p>
                <p className="text-sm text-gray-400">Verfügbares Guthaben für Trading</p>
              </div>

              {/* Beneficio no realizado (unrealizedProfit) */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Unrealisierter Gewinn</h3>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-2 ${
                  parseFloat(balanceData.unrealizedProfit) > 0 
                    ? 'text-green-400' 
                    : parseFloat(balanceData.unrealizedProfit) < 0 
                      ? 'text-red-400' 
                      : 'text-white'
                }`}>
                  {parseFloat(balanceData.unrealizedProfit) > 0 ? '+' : ''}
                  ${formatNumber(balanceData.unrealizedProfit)}
                </p>
                <p className="text-sm text-gray-400">Noch nicht realisierte Gewinne/Verluste</p>
              </div>

              {/* Saldo de la cartera (balance) */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Wallet-Guthaben</h3>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Bitcoin className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  ${formatNumber(balanceData.balance)}
                </p>
                <p className="text-sm text-gray-400">Gesamtes Wallet-Guthaben</p>
              </div>
            </div>

            {/* Detalles del saldo */}
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-medium text-white">Kontodetails</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Asset</h4>
                    <p className="text-lg font-medium text-white">{balanceData.asset}</p>
                  </div>
           
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Realisierter Gewinn</h4>
                    <p className="text-lg font-medium text-white">${formatNumber(balanceData.realisedProfit)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Verwendete Margin</h4>
                    <p className="text-lg font-medium text-white">${formatNumber(balanceData.usedMargin)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Eingefrorene Margin</h4>
                    <p className="text-lg font-medium text-white">${formatNumber(balanceData.freezedMargin)}</p>
                  </div>

                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">Keine Daten verfügbar</p>
            <p className="text-gray-500 max-w-md text-center">
              Es konnten keine Kontodaten abgerufen werden. Bitte versuche es später erneut.
            </p>
          </div>
        )}

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