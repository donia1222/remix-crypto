"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X, Calendar, Tag, Loader2 } from "lucide-react"
import { Button } from "~/components/ui/button"

// Interfaz para el tipo de post
interface BlogPost {
  id: number
  title: string
  excerpt: string
  post_date: string
  image_url: string
  category: string
  content: string
}

export default function NewsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  // Cargar el último post al montar el componente
  useEffect(() => {
    const fetchLatestPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("https://web.lweb.ch/crypto/blogchanges.php")

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data && data.data.length > 0) {
          // Obtener el post más reciente (el primero en el array)
          setLatestPost(data.data[0])
        } else {
          setError("No se encontraron posts")
        }
      } catch (err) {
        setError(`Error al cargar los datos: ${err instanceof Error ? err.message : String(err)}`)
        console.error("Error fetching posts:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestPost()
  }, [])

  // Renderizar un estado de carga
  if (isLoading) {
    return (
      <section id="nachrichten" className="w-full py-12 md:py-24 bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Nachrichten</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Neueste Updates</h2>
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Renderizar un mensaje de error
  if (error || !latestPost) {
    return (
      <section id="nachrichten" className="w-full py-12 md:py-24 bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Nachrichten</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Neueste Updates</h2>
            <p className="text-red-400">{error || "Keine Nachrichten verfügbar"}</p>
          </div>
        </div>
      </section>
    )
  }

  // Asegurarse de que la URL de la imagen sea completa
  const imageUrl = latestPost.image_url.startsWith("http")
    ? latestPost.image_url
    : latestPost.image_url.startsWith("/crypto/")
      ? `https://web.lweb.ch${latestPost.image_url}`
      : latestPost.image_url.startsWith("/images/")
        ? `https://web.lweb.ch/crypto${latestPost.image_url}`
        : `https://web.lweb.ch/crypto/images/${latestPost.image_url.replace(/^\//, "")}`

  // Formatear la fecha
  const formattedDate = formatDate(latestPost.post_date)

  return (
    <section id="nachrichten" className="w-full py-12 md:py-24 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-cyan-400">Nachrichten</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Neueste Updates</h2>
            <p className="max-w-[700px] text-gray-300">
              Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Trends aus der Welt der Kryptowährungen.
            </p>
          </motion.div>
        </div>

        {/* Single Featured News Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-cyan-900/10 transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-64 md:h-full overflow-hidden">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={latestPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Si la imagen falla, usar una imagen de placeholder
                    ;(e.target as HTMLImageElement).src = "/bitcoin-chart.png"
                  }}
                />
              </div>
            </div>
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-xs font-medium text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded">
                    <Tag className="h-3 w-3 mr-1" />
                    {latestPost.category}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formattedDate}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 hover:text-cyan-400 transition-colors">
                  {latestPost.title}
                </h3>
                <p className="text-gray-300 mb-6">{latestPost.excerpt}</p>
              </div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white"
                >
                  Mehr lesen <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* News Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={latestPost.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Si la imagen falla, usar una imagen de placeholder
                        ;(e.target as HTMLImageElement).src = "/bitcoin-chart.png"
                        console.error("Error loading image:", imageUrl)
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center text-xs font-medium text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded">
                      <Tag className="h-3 w-3 mr-1" />
                      {latestPost.category}
                    </span>
                    <span className="flex items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formattedDate}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-6">{latestPost.title}</h3>

                  <div
                    className="text-gray-300 space-y-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: latestPost.content }}
                  />

                  <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Quelle: Krypto News</span>
                    <Button
                      variant="ghost"
                      className="text-cyan-400 hover:text-cyan-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Schließen
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

