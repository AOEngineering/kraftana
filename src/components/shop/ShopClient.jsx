"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { PRODUCT_CATEGORIES, PRODUCTS, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "lead_asc", label: "Lead Time: Shortest" },
  { value: "lead_desc", label: "Lead Time: Longest" },
]

function CategoryPills({ active, onChange }) {
  return (
    <div className="relative -mx-1 flex gap-2 overflow-x-auto pb-2">
      {PRODUCT_CATEGORIES.map((category) => {
        const selected = active === category.value

        return (
          <button
            key={category.value}
            onClick={() => onChange(category.value)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
              selected
                ? "border-transparent bg-[linear-gradient(135deg,#b7776d,#915a51)] text-white shadow-[0_14px_32px_rgba(145,90,81,0.22)]"
                : "border-[color:var(--line-soft)] bg-[color:var(--surface-3)] text-foreground/72 hover:border-[rgba(145,90,81,0.24)] hover:bg-[color:var(--surface-4)] hover:text-foreground"
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}

function ProductCard({ product }) {
  const cover = product.images?.[0] || {
    src: "/images/blush-sage-granny-square-top.jpeg",
    alt: product.alt || product.title,
  }

  return (
    <Card className="group overflow-hidden rounded-[2rem] border-0 bg-transparent p-0 shadow-none">
      <div className="paper-panel flex h-full flex-col overflow-hidden rounded-[2rem] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
          <WatermarkedImage
            src={cover?.src}
            alt={cover?.alt || product.alt}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            showWatermark={false}
            imageClassName="object-cover"
          />
        </div>

        <CardContent className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                {product.categoryLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">
                {product.title}
              </h3>
            </div>
            <span className="rounded-full bg-[color:var(--surface-3)] px-3 py-1 text-sm font-semibold text-[color:var(--foreground)]">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-3 text-sm leading-7 text-foreground/68">
            {product.shortDescription}
          </p>

          <div className="mt-5 grid gap-2 text-sm text-foreground/58 sm:grid-cols-2">
            <div>Lead time: {product.leadDays} days</div>
            <div>Availability: {product.availability}</div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 p-5 pt-0 sm:flex-row">
          <Button asChild className="w-full sm:flex-1">
            <Link href={`/shop/${product.slug}`}>View details</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1">
            <Link href={`/custom?piece=${product.slug}`}>Request this piece</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default function ShopClient({ products = PRODUCTS }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [temp, setTemp] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => setQuery(temp), 180)
    return () => clearTimeout(timeout)
  }, [temp])

  const filtered = useMemo(() => {
    let list = products.slice()

    if (category !== "all") list = list.filter((product) => product.category === category)
    if (query.trim()) {
      const normalizedQuery = query.toLowerCase()
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(normalizedQuery) ||
          product.shortDescription.toLowerCase().includes(normalizedQuery) ||
          product.categoryLabel.toLowerCase().includes(normalizedQuery)
      )
    }

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "lead_asc":
        list.sort((a, b) => a.leadDays - b.leadDays)
        break
      case "lead_desc":
        list.sort((a, b) => b.leadDays - a.leadDays)
        break
      default:
        list.sort((a, b) => a.price - b.price)
    }

    return list
  }, [category, products, query, sort])

  return (
    <div className="grid gap-8">
      <div className="paper-panel rounded-[2rem] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[380px]">
              <SheetHeader>
                <SheetTitle>Browse the collection</SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-5">
                <div>
                  <div className="mb-3 text-sm font-semibold text-[color:var(--foreground)]">
                    Category
                  </div>
                  <CategoryPills active={category} onChange={setCategory} />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">
                    Search
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="Search by piece or style"
                      className="rounded-full border-[color:var(--line-soft)] bg-[color:var(--surface-3)] pl-10"
                      value={temp}
                      onChange={(event) => setTemp(event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">
                    Sort
                  </div>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="rounded-full border-[color:var(--line-soft)] bg-[color:var(--surface-3)]">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORTS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <Button onClick={() => setFiltersOpen(false)}>Apply filters</Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:block">
            <CategoryPills active={category} onChange={setCategory} />
          </div>

          <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
            <div className="relative flex-1 sm:w-[300px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
              <Input
                placeholder="Search by piece or style"
                className="rounded-full border-[color:var(--line-soft)] bg-[color:var(--surface-3)] pl-10"
                value={temp}
                onChange={(event) => setTemp(event.target.value)}
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full rounded-full border-[color:var(--line-soft)] bg-[color:var(--surface-3)] sm:w-[190px]">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {filtered.length === 0 && (
          <div className="paper-panel col-span-full rounded-[1.8rem] p-10 text-center text-sm leading-7 text-foreground/62">
            No pieces match that filter yet. Try a different category or search term.
          </div>
        )}
      </div>

    </div>
  )
}
