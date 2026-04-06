"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom" },
  { href: "/about", label: "About" },
]

export default function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line-soft)] bg-[color:var(--surface-3)] backdrop-blur-xl">
      <div className="section-shell flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="min-w-0">
          <span className="block font-display text-3xl leading-none text-[color:var(--foreground)] sm:text-[2.2rem]">
            Kraftana
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.32em] text-foreground/55 sm:block">
            Handmade crochet studio
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-0)] p-1 md:flex">
          {nav.map((item) => (
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
          <Button asChild size="sm" className="hidden sm:inline-flex">
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
        </div>
      </div>
    </header>
  )
}
