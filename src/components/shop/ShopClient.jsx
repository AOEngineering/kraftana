"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

import WatermarkedImage from "@/components/WatermarkedImage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const PRODUCTS = [
  {
    id: "p1",
    title: "Blush & Sage Square Top",
    price: 160,
    category: "tops",
    leadDays: 10,
    images: ["/images/blush-sage-granny-square-top.jpeg", "/images/blue-granny-square-cardigan.jpeg"],
    blurb: "A white, blush, and sage square-motif top with a soft studio-table finish.",
  },
  {
    id: "p2",
    title: "Sunset Chevron Halter",
    price: 75,
    category: "tops",
    leadDays: 7,
    images: ["/images/sunset-chevron-halter-top.jpeg", "/images/cobalt-fringe-scarf.jpeg"],
    blurb: "A warm citrus-and-rust halter with a playful chevron layout and custom color potential.",
  },
  {
    id: "p3",
    title: "Striped Midi Skirt",
    price: 58,
    category: "skirts",
    leadDays: 6,
    images: ["/images/striped-midi-skirt.jpeg", "/images/patchwork-drawstring-skirt.jpeg"],
    blurb: "A longer striped skirt in blue, cream, olive, and berry with a clean boutique silhouette.",
  },
  {
    id: "p4",
    title: "Blue Stripe Beanie",
    price: 90,
    category: "accessories",
    leadDays: 8,
    images: ["/images/striped-crochet-beanie.jpeg", "/images/pastel-granny-square-skirt.jpeg"],
    blurb: "A chunky striped beanie in blue, oat, and cream with a soft hand and giftable feel.",
  },
  {
    id: "p5",
    title: "Cobalt Fringe Scarf",
    price: 175,
    category: "accessories",
    leadDays: 12,
    images: ["/images/cobalt-fringe-scarf.jpeg", "/images/blush-sage-granny-square-top.jpeg"],
    blurb: "An open-stitch scarf with bright cobalt edging and long fringe for a more graphic finish.",
  },
  {
    id: "p6",
    title: "Blue Granny Square Cardigan",
    price: 62,
    category: "layers",
    leadDays: 6,
    images: ["/images/blue-granny-square-cardigan.jpeg", "/images/striped-midi-skirt.jpeg"],
    blurb: "A cool-toned cardigan with crisp edging, visible stitchwork, and a cozy handmade drape.",
  },
]

const CATEGORIES = [
  { value: "all", label: "All pieces" },
  { value: "tops", label: "Tops" },
  { value: "skirts", label: "Skirts" },
  { value: "layers", label: "Layers" },
  { value: "accessories", label: "Accessories" },
]

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "lead_asc", label: "Lead Time: Shortest" },
  { value: "lead_desc", label: "Lead Time: Longest" },
]

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

function CategoryPills({ active, onChange }) {
  return (
    <div className="relative -mx-1 flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => {
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

function ProductCard({ product, onQuickView }) {
  const cover = product.images?.[0]

  return (
    <Card className="group overflow-hidden rounded-[2rem] border-0 bg-transparent p-0 shadow-none">
      <div className="paper-panel overflow-hidden rounded-[2rem] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
          <WatermarkedImage
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            watermarkMode="corner"
            watermarkOpacity={0.28}
            watermarkPosition="bottom-right"
            imageClassName="object-cover"
          />
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                {product.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">{product.title}</h3>
            </div>
            <span className="rounded-full bg-[color:var(--surface-3)] px-3 py-1 text-sm font-semibold text-[color:var(--foreground)]">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-3 text-sm leading-7 text-foreground/66">{product.blurb}</p>
          <div className="mt-4 text-sm text-foreground/55">Lead time: {product.leadDays} days</div>
        </CardContent>

        <CardFooter className="flex gap-2 p-5 pt-0">
          <Button onClick={() => onQuickView(product)}>Quick view</Button>
          <Button variant="outline" disabled>
            Add to cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default function ShopClient() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("featured")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [temp, setTemp] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => setQuery(temp), 180)
    return () => clearTimeout(timeout)
  }, [temp])

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice()

    if (category !== "all") list = list.filter((product) => product.category === category)
    if (query.trim()) {
      const normalizedQuery = query.toLowerCase()
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(normalizedQuery) ||
          product.blurb.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
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
        list.sort((a, b) => (a.category > b.category ? 1 : -1) || a.price - b.price)
    }

    return list
  }, [category, query, sort])

  function openQuickView(product) {
    setActive(product)
    setOpen(true)
  }

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
                  <div className="mb-3 text-sm font-semibold text-[color:var(--foreground)]">Category</div>
                  <CategoryPills active={category} onChange={setCategory} />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">Search</div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="Search by piece or vibe"
                      className="rounded-full border-[color:var(--line-soft)] bg-[color:var(--surface-3)] pl-10"
                      value={temp}
                      onChange={(event) => setTemp(event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">Sort</div>
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
                placeholder="Search by piece or vibe"
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
          <ProductCard key={product.id} product={product} onQuickView={openQuickView} />
        ))}

        {filtered.length === 0 && (
          <div className="paper-panel col-span-full rounded-[1.8rem] p-10 text-center text-sm leading-7 text-foreground/62">
            No pieces match that filter yet. Try a different category or search term.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-[color:var(--line-soft)] bg-[color:var(--surface-1)]">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-4xl leading-none text-[color:var(--foreground)]">
                  {active.title}
                </DialogTitle>
                <DialogDescription className="mt-2 max-w-2xl text-sm leading-7 text-foreground/68">
                  {active.blurb}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
                <div className="grid gap-3 sm:grid-cols-2">
                  {active.images.map((src, index) => (
                    <figure key={src} className="paper-panel overflow-hidden rounded-[1.5rem] p-3">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem]">
                        <WatermarkedImage
                          src={src}
                          alt={`${active.title} view ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          watermarkMode={index === 0 ? "corner" : "pattern"}
                          watermarkOpacity={index === 0 ? 0.28 : 0.11}
                          watermarkPosition="bottom-right"
                          imageClassName="object-cover"
                        />
                      </div>
                    </figure>
                  ))}
                </div>

                <div className="paper-panel flex h-full flex-col justify-between rounded-[1.6rem] p-5">
                  <div>
                    <div className="text-3xl font-semibold text-[color:var(--foreground)]">
                      {formatPrice(active.price)}
                    </div>
                    <div className="mt-2 text-sm text-foreground/58">Lead time: {active.leadDays} days</div>
                    <Separator className="my-5" />
                    <p className="text-sm leading-7 text-foreground/68">
                      Every piece is handmade in the studio. Colors can be customized, sizing can be
                      discussed, and special requests are welcome when you start a custom order.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button disabled>Add to cart</Button>
                    <Button variant="outline" asChild>
                      <Link href="/custom">Request custom</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
