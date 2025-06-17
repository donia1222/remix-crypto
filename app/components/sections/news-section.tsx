"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Tag, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
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

// Mapeo de categorías para asegurar consistencia en alemán
const categoryMap: Record<string, string> = {
  Tecnología: "Technologie",
  Análisis: "Analyse",
  Noticias: "Nachrichten",
  Märkte: "Märkte",
  Technologie: "Technologie",
  Analyse: "Analyse",
  Nachrichten: "Nachrichten",
  Technology: "Technologie",
  Analysis: "Analyse",
  News: "Nachrichten",
  Markets: "Märkte",
}

// Colores para diferentes categorías
const categoryColors: Record<string, string> = {
  Technologie: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Analyse: "bg-green-400/10 text-green-400 border-green-400/20",
  Nachrichten: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  Märkte: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  Trading: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  Blockchain: "bg-indigo-400/10 text-indigo-400 border-indigo-400/20",
  DeFi: "bg-pink-400/10 text-pink-400 border-pink-400/20",
}

export default function NewsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Función para formatear la fecha en alemán
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

  // Función para normalizar categoría a alemán
  const normalizeCategory = (category: string) => {
    return categoryMap[category] || category
  }

  // Función para obtener color de categoría
  const getCategoryColor = (category: string) => {
    const normalizedCategory = normalizeCategory(category)
    return categoryColors[normalizedCategory] || "bg-cyan-400/10 text-cyan-400 border-cyan-400/20"
  }

  // Función para formatear URL de imagen
  const formatImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg"

    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    if (imageUrl.startsWith("/crypto/images/")) {
      return `https://web.lweb.ch${imageUrl}`
    }

    if (imageUrl.startsWith("/images/")) {
      return `https://web.lweb.ch/crypto${imageUrl}`
    }

    return `https://web.lweb.ch/crypto/images/${imageUrl.replace(/^\//, "")}`
  }

  // Cargar los últimos 3 posts al montar el componente
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("https://web.lweb.ch/crypto/blogchanges.php?latest=true")

        if (!response.ok) {
          throw new Error(`HTTP-Fehler: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data && data.data.length > 0) {
          // Normalizar categorías a alemán
          const normalizedPosts = data.data.map((post: BlogPost) => ({
            ...post,
            category: normalizeCategory(post.category),
          }))
          setPosts(normalizedPosts)
        } else {
          setError("Keine Beiträge gefunden")
        }
      } catch (err) {
        setError(`Fehler beim Laden der Daten: ${err instanceof Error ? err.message : String(err)}`)
        console.error("Fehler beim Abrufen der Beiträge:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Función para abrir modal con post específico
  const openModal = (post: BlogPost) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  // Función para navegar entre slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length)
  }

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
              <span className="ml-3 text-gray-300">Beiträge werden geladen...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Renderizar un mensaje de error
  if (error || posts.length === 0) {
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

  return (
    <section id="nachrichten" className="w-full py-12 md:py-24 bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-green-400">Nachrichten</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Neueste Updates</h2>
            <p className="max-w-[700px] text-gray-300">
              Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Trends aus der Welt der Kryptowährungen.
            </p>
          </div>
        </div>

        {/* Desktop: Improved Grid Layout for Large Screens */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* First post - large featured (spans 7 columns) */}
          <div className="col-span-7">
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 h-full cursor-pointer"
              onClick={() => openModal(posts[0])}
            >
              <div className="relative h-full">
                {/* Background image that covers the entire card */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={formatImageUrl(posts[0].image_url) || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=800&text=Krypto+News"
                    }}
                  />
                </div>

                {/* Content overlay */}
                <div className="relative p-6 flex flex-col h-full z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`flex items-center text-xs font-medium px-3 py-1 rounded-full border ${getCategoryColor(posts[0].category)}`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {normalizeCategory(posts[0].category)}
                    </span>
                    <span className="flex items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(posts[0].post_date)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 hover:text-cyan-400 transition-colors">
                    {posts[0].title}
                  </h3>

                  <p className="text-gray-300 mb-4 flex-grow">{posts[0].excerpt}</p>

                  <div className="mt-auto">
                    <div className="flex items-center text-cyan-400 text-sm font-medium">
                      <span>Zum vollständigen Artikel</span>
                      <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second and third posts - stacked in a column (5 columns) */}
          <div className="col-span-5 grid grid-rows-2 gap-6 h-full">
            {posts.slice(1, 3).map((post, index) => (
              <div
                key={post.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(post)}
              >
                <div className="flex h-full">
                  {/* Image on the left */}
                  <div className="w-1/3 relative">
                    <img
                      src={formatImageUrl(post.image_url) || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(post.category)}`
                      }}
                    />
                  </div>

                  {/* Content on the right */}
                  <div className="w-2/3 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`flex items-center text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(post.category)}`}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {normalizeCategory(post.category)}
                      </span>
                      <span className="flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.post_date)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-300 text-sm line-clamp-3 mb-2">{post.excerpt}</p>

                    <div className="mt-auto">
                      <div className="flex items-center text-cyan-400 text-xs font-medium">
                        <span>Zum vollständigen Artikel</span>
                        <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Carousel Layout */}
        <div className="md:hidden relative max-w-sm mx-auto">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="w-full flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl cursor-pointer"
                  onClick={() => openModal(post)}
                >
                  <div className="relative">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={formatImageUrl(post.image_url) || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400&text=Krypto+News"
                        }}
                      />
                    </div>
                    <div className="absolute top-0 right-0 p-2">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(post.category)}`}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {normalizeCategory(post.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <span className="flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.post_date)}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-cyan-400 text-sm font-medium">
                      <span>Zum vollständigen Artikel</span>
                      <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          {posts.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/4 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full "
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5 " />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/4 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-4 space-x-2">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-cyan-400" : "bg-gray-600"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* News Modal */}
        {isModalOpen && selectedPost && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-64 overflow-hidden">
                  <img
                    src={formatImageUrl(selectedPost.image_url) || "/placeholder.svg"}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=600&text=Krypto+News"
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
                  <span
                    className={`flex items-center text-xs font-medium px-3 py-1 rounded-full border ${getCategoryColor(selectedPost.category)}`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {normalizeCategory(selectedPost.category)}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(selectedPost.post_date)}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6">{selectedPost.title}</h3>

                <div
                  className="text-gray-300 space-y-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
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
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
