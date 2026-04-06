import Link from "next/link"
import { Cormorant_Garamond, Geist_Mono, Manrope } from "next/font/google"

import "./globals.css"
import SiteHeader from "@/components/SiteHeader"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Kraftana | Crochet & Craft Studio",
  description: "Boutique crochet pieces, custom commissions, and handmade warmth from the studio.",
  icons: {
    icon: "/yarn-bundle.svg",
    shortcut: "/yarn-bundle.svg",
    apple: "/yarn-bundle.svg",
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="aoe-theme"
        >
          <SiteHeader />

          <main id="content" className="min-h-[calc(100dvh-4.5rem)] overflow-x-clip">
            {children}
          </main>

          <footer className="footer-wash border-t border-[color:var(--line-soft)]">
            <div className="section-shell py-10 sm:py-14">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <p className="eyebrow">Handmade crochet studio</p>
                  <Link
                    href="/"
                    className="mt-5 inline-block font-display text-4xl leading-none text-[color:var(--foreground)]"
                  >
                    Kraftana
                  </Link>
                  <p className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
                    Thoughtful pieces for home, gifting, and custom requests. Every stitch is made
                    slowly, with softness and care at the center.
                  </p>
                </div>

                <nav className="flex flex-wrap gap-3 text-sm text-foreground/70">
                  <Link
                    href="/shop"
                    className="rounded-full border border-[color:var(--line-soft)] px-4 py-2 transition hover:border-[rgba(145,90,81,0.28)] hover:bg-[color:var(--surface-3)] hover:text-foreground"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/custom"
                    className="rounded-full border border-[color:var(--line-soft)] px-4 py-2 transition hover:border-[rgba(145,90,81,0.28)] hover:bg-[color:var(--surface-3)] hover:text-foreground"
                  >
                    Custom Order
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-full border border-[color:var(--line-soft)] px-4 py-2 transition hover:border-[rgba(145,90,81,0.28)] hover:bg-[color:var(--surface-3)] hover:text-foreground"
                  >
                    About
                  </Link>
                </nav>
              </div>

              <div className="mt-8 border-t border-[color:var(--line-soft)] pt-5 text-sm text-foreground/55">
                (c) {new Date().getFullYear()} Kraftana. Handmade in small batches.
              </div>
            </div>
          </footer>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
