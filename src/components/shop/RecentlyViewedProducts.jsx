"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { PRODUCTS } from "@/lib/products"

const KEY = "kraftana_recently_viewed"

export default function RecentlyViewedProducts({ currentSlug }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const parsed = (() => {
      try {
        return JSON.parse(localStorage.getItem(KEY) || "[]")
      } catch {
        return []
      }
    })()

    const next = [currentSlug, ...parsed.filter((slug) => slug !== currentSlug)].slice(0, 8)
    localStorage.setItem(KEY, JSON.stringify(next))

    const resolved = next
      .filter((slug) => slug !== currentSlug)
      .map((slug) => PRODUCTS.find((product) => product.slug === slug))
      .filter(Boolean)
      .slice(0, 4)
    setItems(resolved)
  }, [currentSlug])

  if (!items.length) return null

  return (
    <section className="paper-panel rounded-[2rem] p-6 sm:p-7">
      <h2 className="font-display text-3xl text-[color:var(--foreground)]">Recently viewed</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/shop/${item.slug}`}
            className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 py-2 text-sm text-foreground/74 transition hover:text-foreground"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  )
}

