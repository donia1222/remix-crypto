import { useLocation } from "@remix-run/react"

interface SocialMetaTagsProps {
  title?: string
  description?: string
  imageUrl?: string
}

export function SocialMetaTags({
  title = "nextrade | Krypto Trading & IT Lösungen",
  description = "Professionelle Krypto Trading & IT Lösungen aus der Schweiz.",
  imageUrl = "/A5.png",
}: SocialMetaTagsProps) {
  const location = useLocation()
  const currentUrl = `https://remix-crypto.vercel.app${location.pathname}`

  return (
    <>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="nextrade" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  )
}
