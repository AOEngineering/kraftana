import Link from "next/link"
import { Cormorant_Garamond, Geist_Mono, Manrope } from "next/font/google"

import "./globals.css"
import SiteHeader from "@/components/SiteHeader"
import SiteVisitTracker from "@/components/SiteVisitTracker"
import { buildMetadata } from "@/lib/metadata"
import { getPublicSiteSettings } from "@/lib/publicData"
import { primaryNav, siteConfig } from "@/lib/site"
import CookieConsent from "@/components/site/cookie-consent"
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
  ...buildMetadata({
    description: siteConfig.description,
  }),
  metadataBase: new URL(siteConfig.baseUrl),
  icons: {
    icon: "/yarn-bundle.svg",
    shortcut: "/yarn-bundle.svg",
    apple: "/yarn-bundle.svg",
  },
}

export default async function RootLayout({ children }) {
  const siteSettings = await getPublicSiteSettings()
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.wordmark,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl.replace(/\/$/, "")}/yarn-bundle.svg`,
    email: siteConfig.email,
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteVisitTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="aoe-theme"
        >
          {siteSettings.announcementBannerEnabled && siteSettings.announcementBannerText ? (
            <div className="border-b border-[color:var(--line-soft)] bg-[rgba(242,223,220,0.68)] px-4 py-3 text-center text-sm text-[color:var(--foreground)]">
              {siteSettings.announcementBannerText}
            </div>
          ) : null}
          <SiteHeader />

          <main
            id="content"
            className="kraftana-page-bg min-h-[calc(100dvh-4.5rem)] overflow-x-clip overflow-hidden"
          >
            {children}
          </main>

          <footer className="relative footer-wash border-t border-[color:var(--line-soft)] bg-[rgba(255,247,239,0.55)] backdrop-blur-[2px]">
            <div className="section-shell py-10 sm:py-14">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <p className="eyebrow">Handmade crochet studio</p>
                  <Link
                    href="/"
                    className="mt-5 inline-block font-display text-4xl leading-none text-[color:var(--foreground)]"
                  >
                    {siteConfig.wordmark}
                  </Link>
                  <p className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
                    Thoughtful pieces for home, gifting, and custom requests. Every stitch is made
                    slowly, with softness and care at the center.
                  </p>
                </div>

                <nav className="flex flex-wrap gap-3 text-sm text-foreground/70">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-[color:var(--line-soft)] px-4 py-2 transition hover:border-[rgba(145,90,81,0.28)] hover:bg-[color:var(--surface-3)] hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-8 border-t border-[color:var(--line-soft)] pt-5 text-sm text-foreground/55">
                (c) {new Date().getFullYear()} {siteConfig.name}.{" "}
                {siteSettings.footerNote || "Handmade in small batches."}
              </div>
            </div>
          </footer>
        </ThemeProvider>
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  )
}
