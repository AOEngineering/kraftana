"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { primaryNav, siteConfig } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line-soft)] bg-[color:var(--surface-3)] backdrop-blur-xl">
      <div className="section-shell flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="min-w-0">
          <span className="block font-display text-3xl leading-none text-[color:var(--foreground)] sm:text-[2.2rem]">
            {siteConfig.wordmark}
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.32em] text-foreground/55 sm:block">
            Handmade crochet studio
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-0)] p-1 md:flex">
          {primaryNav.slice(1, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-foreground/72 transition hover:bg-[color:var(--surface-3)] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="px-3 sm:px-4">
            <Link href="/custom">Start a custom</Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-[color:var(--surface-0)]"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
            ) : (
              <span className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-[color:var(--surface-0)] md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[360px] border-[color:var(--line-soft)] bg-[color:var(--surface-1)]">
              <SheetHeader>
                <SheetTitle className="font-display text-3xl text-[color:var(--foreground)]">
                  {siteConfig.wordmark}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 grid gap-3">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[1.2rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 py-3 text-base text-[color:var(--foreground)] transition hover:border-[rgba(145,90,81,0.24)] hover:bg-[color:var(--surface-4)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] p-4 text-sm leading-7 text-foreground/68">
                Handmade crochet from Kevonne Workman&apos;s Cleveland studio, with room for custom sizing, thoughtful gifts, and one-of-a-kind requests.
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
