import type { MetaFunction } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

import styles from "./tailwind.css?url";

export const links = () => [{ rel: "stylesheet", href: styles }]

export const meta: MetaFunction = () => {
  return [
    { title: "nextrade | Krypto Trading & IT Lösungen" },
    {
      name: "description",
      content:
        "Professionelle Krypto Trading & IT Lösungen aus der Schweiz. nextrade bietet innovative Handelsplattformen und massgeschneiderte IT-Dienstleistungen für den Kryptowährungsmarkt.",
    },
    { name: "theme-color", content: "#000000" },
    {
      name: "keywords",
      content: "nextrade, Krypto, Trading, IT Lösungen, Schweiz, Kryptowährung, Blockchain, Bitcoin, Ethereum",
    },

    // Updated Open Graph tags
    { property: "og:title", content: "nextrade | Krypto Trading & IT Lösungen" },
    { property: "og:description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "nextrade" },
    { property: "og:url", content: "https://remix-crypto.vercel.app" },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "nextrade | Krypto Trading & IT Lösungen" },
    { name: "twitter:description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },

    // Other meta tags
    { name: "author", content: "nextrade" },
    { name: "language", content: "de" },
  ]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
