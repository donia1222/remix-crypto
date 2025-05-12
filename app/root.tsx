import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "nextrade | Krypto Trading & IT Lösungen" },
    { name: "description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz. nextrade bietet innovative Handelsplattformen und massgeschneiderte IT-Dienstleistungen für den Kryptowährungsmarkt." },
    { name: "theme-color", content: "#000000" },
    { name: "keywords", content: "nextrade, Krypto, Trading, IT Lösungen, Schweiz, Kryptowährung, Blockchain, Bitcoin, Ethereum" },
    { property: "og:title", content: "nextrade | Krypto Trading & IT Lösungen" },
    { property: "og:description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "nextrade" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "nextrade | Krypto Trading & IT Lösungen" },
    { name: "twitter:description", content: "Professionelle Krypto Trading & IT Lösungen aus der Schweiz." },
    { name: "author", content: "nextrade" },
    { name: "language", content: "de" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="font-inter bg-gray-900 text-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}