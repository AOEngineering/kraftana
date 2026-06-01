"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

import Image from "next/image"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { YARN_COLORS, YARN_FAMILIES, YARN_LINES, YARN_TAGS, YARN_WEIGHTS } from "./colors"

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getTagList(tags = []) {
  return Array.isArray(tags) ? tags : []
}

function normalizeTerm(value) {
  return String(value || "").trim().toLowerCase()
}

function useDebouncedValue(value, delay = 180) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

function useResizeColumns(ref) {
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const update = () => {
      const nextWidth = Math.max(node.clientWidth || 320, 220)
      let nextColumns = 2
      if (nextWidth >= 1100) nextColumns = 4
      else if (nextWidth >= 760) nextColumns = 3
      else if (nextWidth >= 540) nextColumns = 3

      setColumns((current) => (current === nextColumns ? current : nextColumns))
    }

    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(node)
    return () => resizeObserver.disconnect()
  }, [ref])

  return columns
}

const MiniYarnCard = memo(function MiniYarnCard({
  yarn,
  selected,
  onSelect,
  onImageError,
  loading,
  disabled,
}) {
  const imageKey = loading && yarn.image ? `${yarn.id}-${yarn.code}` : yarn.id

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(yarn)}
      aria-pressed={selected}
      className={[
        "group relative h-16 rounded-[0.95rem] border p-2 text-left transition",
        selected
          ? "border-[#b56f63] bg-[#fff6ef] shadow-[0_10px_24px_rgba(97,66,48,0.16)]"
          : "border-[#ecd0bc] bg-[#fffaf4]/85 hover:-translate-y-0.5 hover:border-[#d8b89e]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad6f63]/40 focus-visible:ring-offset-2",
        disabled ? "cursor-not-allowed opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex h-full items-center gap-2">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f4e4d1]">
          {yarn.image ? (
            <Image
              src={yarn.image}
              alt={`${yarn.name} yarn`}
              fill
              sizes="56px"
              className="object-cover"
              loading={loading ? "lazy" : "eager"}
              decoding="async"
              onError={() => onImageError(yarn.id)}
              key={imageKey}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[9px] font-medium text-[#7e6358]">
              {yarn.code}
            </span>
          )}
          <span
            className="pointer-events-none absolute inset-0 border border-white/55"
            style={{ backgroundColor: `rgba(255,255,255,${selected ? 0.2 : 0.08})` }}
          />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium leading-tight text-[color:var(--foreground)]">
            {yarn.name}
          </div>
          <div className="truncate text-xs text-foreground/65">{yarn.code}</div>
          <div className="mt-0.5 truncate text-[11px] text-foreground/62">{yarn.line}</div>
        </div>

        <span
          className="shrink-0 inline-flex h-4 w-4 rounded-full border border-white/70"
          style={{ backgroundColor: yarn.hex || "#ded5ca" }}
          aria-hidden="true"
        />
      </div>

      {yarn.texture ? (
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-[#f6ede4]/85 px-2 py-0.5 text-[10px] font-medium text-[#6f554b]">
          {String(yarn.texture).split(" ").slice(0, 2).join(" ")}
        </span>
      ) : null}

      {selected ? (
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[#ad6f63] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          On
        </span>
      ) : null}
    </button>
  )
})

function getCatalogCache() {
  return YARN_COLORS.slice()
}

const CATALOG_CACHE = Object.freeze(getCatalogCache())

export default function ColorPicker({
  value = [],
  onChange = () => {},
  max = 1,
  allowEmpty = false,
  allowDuplicateYarns = false,
}) {
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const [search, setSearch] = useState("")
  const [line, setLine] = useState("any")
  const [family, setFamily] = useState("any")
  const [weight, setWeight] = useState("any")
  const [tag, setTag] = useState("any")
  const [imageErrors, setImageErrors] = useState(() => new Set())
  const [height, setHeight] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const debouncedSearch = useDebouncedValue(search, 200)
  const searchTerm = normalizeTerm(debouncedSearch)
  const columns = useResizeColumns(containerRef)

  const catalog = useMemo(() => CATALOG_CACHE, [])
  const normalized = useMemo(
    () => ({
      line,
      family,
      weight,
      tag,
    }),
    [line, family, weight, tag]
  )

  const filtered = useMemo(() => {
    return catalog.filter((item) => {
      const inSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm) ||
        item.line.toLowerCase().includes(searchTerm)

      if (!inSearch) return false
      if (normalized.family !== "any" && normalized.family !== item.color_family) return false
      if (normalized.weight !== "any" && normalized.weight !== item.weight) return false
      if (normalized.tag !== "any") {
        const tags = getTagList(item.tags)
        if (!tags.includes(normalized.tag)) return false
      }
      if (normalized.line !== "any" && normalized.line !== item.line) return false

      return true
    })
  }, [catalog, normalized, searchTerm])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    setHeight(list.clientHeight)

    const handleScroll = (event) => setScrollTop(event.currentTarget.scrollTop)
    list.addEventListener("scroll", handleScroll, { passive: true })
    return () => list.removeEventListener("scroll", handleScroll)
  }, [])

  const rowHeight = 76
  const overscanRows = 2
  const rowCount = Math.max(1, Math.ceil(filtered.length / columns))
  const listHeight = Math.max(0, height || 292)

  const startRow = clamp(Math.floor(scrollTop / rowHeight), 0, rowCount - 1)
  const visibleRows = Math.ceil(listHeight / rowHeight) + overscanRows * 2
  const start = clamp(startRow - overscanRows, 0, Math.max(0, rowCount - 1))
  const end = clamp(start + visibleRows, 1, rowCount)

  const startIndex = start * columns
  const endIndex = Math.min(filtered.length, end * columns)
  const visibleItems = filtered.slice(startIndex, endIndex)

  const selectedSet = useMemo(() => new Set(value), [value])
  const hasReachedMax = !allowDuplicateYarns && max > 0 && selectedSet.size >= max

  const markImageError = useCallback((id) => {
    setImageErrors((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }, [])

  const handleYarnToggle = useCallback(
    (yarn) => {
      if (max === 1) {
        const next = selectedSet.has(yarn.id) ? [] : [yarn.id]
        onChange(next)
        return
      }

      const next = new Set(selectedSet)
      if (next.has(yarn.id)) {
        next.delete(yarn.id)
      } else if (allowDuplicateYarns || max <= 0 || next.size < max) {
        next.add(yarn.id)
      }
      onChange(Array.from(next))
    },
    [max, onChange, selectedSet, allowDuplicateYarns]
  )

  const selectedCount = value.length
  const limitText =
    max === 1
      ? "Select one yarn"
      : max > 0
        ? `Select up to ${max} yarns`
        : "Select yarns"

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="yarn-q">Search yarns</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-[#8b6f5f]" />
            <Input
              id="yarn-q"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="name, code, line"
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Line</Label>
          <Select value={line} onValueChange={setLine}>
            <SelectTrigger>
              <SelectValue placeholder="Any line" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any line</SelectItem>
              {YARN_LINES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Family</Label>
          <Select value={family} onValueChange={setFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Any family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any family</SelectItem>
              {YARN_FAMILIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label>Weight</Label>
          <Select value={weight} onValueChange={setWeight}>
            <SelectTrigger>
              <SelectValue placeholder="Any weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any weight</SelectItem>
              {YARN_WEIGHTS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tag</Label>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger>
              <SelectValue placeholder="Any tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any tag</SelectItem>
              {YARN_TAGS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 flex items-end">
          <div className="text-xs text-foreground/66">
            {filtered.length} match{filtered.length === 1 ? "" : "es"} - {limitText}
            {!allowEmpty && selectedCount === 0 ? <span className="text-[#9a5146]"> (required)</span> : null}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="overflow-hidden rounded-[1rem] border border-[#ecdbc9] bg-[#fffaf4]/65">
        <div
          ref={listRef}
          className="relative max-h-72 overflow-y-auto px-2 py-2"
          onWheel={(event) => {
            const node = event.currentTarget
            if (node.scrollHeight <= node.clientHeight) return
            event.stopPropagation()
          }}
        >
          <div style={{ height: `${rowCount * rowHeight}px`, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                insetInlineStart: 0,
                top: `${start * rowHeight}px`,
                left: 0,
                right: 0,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: "0.4rem",
                paddingBottom: "0.25rem",
                paddingTop: "0.1rem",
              }}
            >
              {visibleItems.length ? (
                visibleItems.map((yarn) => {
                  const showImage = yarn.image && !imageErrors.has(yarn.id)
                  return (
                    <MiniYarnCard
                      key={yarn.id}
                      yarn={{
                        ...yarn,
                        image: showImage ? yarn.image : "",
                      }}
                      selected={selectedSet.has(yarn.id)}
                      onSelect={handleYarnToggle}
                      onImageError={markImageError}
                      loading={startIndex > 24}
                      disabled={!allowDuplicateYarns && !selectedSet.has(yarn.id) && hasReachedMax}
                    />
                  )
                })
              ) : (
                <div className="col-span-full rounded-[0.8rem] border border-dashed border-[#ead0ba] bg-[#fcf6ef] px-3 py-4 text-sm text-foreground/62">
                  No yarns match these filters. Try broadening your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
