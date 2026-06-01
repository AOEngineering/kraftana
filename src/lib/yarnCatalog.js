import rawHobbiiYarnCatalog from "@/lib/data/hobbiiYarnCatalog.generated.json"
import yarnImageManifest from "@/lib/data/yarnImageManifest.json"

function normalizeHex(hex) {
  if (typeof hex !== "string") return "#ffffff"

  const cleaned = hex.trim()
  if (!cleaned) return "#ffffff"
  if (/^#[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`
  }

  if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) return cleaned.toUpperCase()

  return cleaned.startsWith("#") ? cleaned : `#${cleaned}`
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex).replace("#", "")

  if (!/^([0-9a-fA-F]{6})$/.test(normalized)) {
    return { r: 0, g: 0, b: 0 }
  }

  const num = parseInt(normalized, 16)
  if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

export function getContrastColor(hex) {
  const rgb = hexToRgb(hex)
  const luminance =
    0.2126 * (rgb.r / 255) ** 2.2 +
    0.7152 * (rgb.g / 255) ** 2.2 +
    0.0722 * (rgb.b / 255) ** 2.2

  return luminance > 0.44 ? "#2a1f19" : "#fffaf4"
}

function rgbDistance(a, b) {
  return Math.sqrt(
    (a.r - b.r) ** 2 +
    (a.g - b.g) ** 2 +
    (a.b - b.b) ** 2
  )
}

export function groupByLine(values) {
  return values.reduce((acc, item) => {
    const key = item.line || "Unknown"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

export function groupByFamily(values) {
  return values.reduce((acc, item) => {
    const key = item.color_family || "Unknown"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

function ensureArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback
}

function deriveTextureLine(yarn) {
  return String(yarn.texture || "").trim() || "Unknown texture"
}

function normalizeCatalogImage(image) {
  if (typeof image !== "string") return ""
  const trimmed = image.trim()
  if (!trimmed) return ""
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  if (/^\/images\//i.test(normalized)) {
    const knownImage = yarnImageManifest?.imagePaths?.includes(normalized)
    return knownImage ? normalized : ""
  }
  return ""
}

const baseCatalog = ensureArray(rawHobbiiYarnCatalog, [])
  .filter((yarn) => yarn && yarn.id)
  .map((yarn) => {
    const normalizedHex = normalizeHex(yarn.hex)
    return {
      ...yarn,
      hex: normalizedHex,
      rgb: hexToRgb(normalizedHex),
      tags: ensureArray(yarn.tags),
      image: normalizeCatalogImage(yarn.image),
      brand: yarn.brand || "Hobbii",
      line: yarn.line || "Unknown",
      color_family: yarn.color_family || "neutral",
      undertone: yarn.undertone || "neutral",
      fiber: yarn.fiber || "100% Cotton",
      weight: yarn.weight || "Unknown",
      texture: deriveTextureLine(yarn),
      washable: Boolean(yarn.washable),
    }
  })

export const HOBBII_YARN_CATALOG = baseCatalog

export const YARN_BY_ID = Object.fromEntries(HOBBII_YARN_CATALOG.map((yarn) => [yarn.id, yarn]))

export const YARN_BRANDS = Array.from(new Set(HOBBII_YARN_CATALOG.map((yarn) => yarn.brand))).sort()
export const YARN_LINES = Array.from(new Set(HOBBII_YARN_CATALOG.map((yarn) => yarn.line))).sort()
export const YARN_FAMILIES = Array.from(new Set(HOBBII_YARN_CATALOG.map((yarn) => yarn.color_family))).sort()
export const YARN_WEIGHTS = Array.from(new Set(HOBBII_YARN_CATALOG.map((yarn) => yarn.weight))).sort()
export const YARN_TAGS = Array.from(
  new Set(HOBBII_YARN_CATALOG.flatMap((yarn) => ensureArray(yarn.tags, [])))
).sort()

export const YARN_BY_LINE = groupByLine(HOBBII_YARN_CATALOG)
export const YARN_BY_FAMILY = groupByFamily(HOBBII_YARN_CATALOG)

export function getYarnById(id) {
  if (!id || typeof id !== "string") return null
  return YARN_BY_ID[id] || null
}

function getAvailableColorFamilies(yarn) {
  return new Set(ensureArray(yarn.tags, []))
}

export function suggestMatchingColors(reference, catalog = HOBBII_YARN_CATALOG) {
  const base = typeof reference === "string" ? getYarnById(reference) : reference
  if (!base) return []

  const target = hexToRgb(base.hex)
  const familyBoost = getAvailableColorFamilies(base)

  return [...catalog]
    .filter((yarn) => yarn.id !== base.id)
    .map((yarn) => ({
      ...yarn,
      _distance: rgbDistance(target, hexToRgb(yarn.hex)) -
        (yarn.color_family === base.color_family ? 15 : 0) -
        (yarn.line === base.line ? 10 : 0) -
        (getAvailableColorFamilies(yarn).size && [...familyBoost].some((tag) => getAvailableColorFamilies(yarn).has(tag)) ? 8 : 0),
    }))
    .sort((a, b) => a._distance - b._distance)
    .slice(0, 8)
    .map(({ _distance, ...yarn }) => yarn)
}

export function recommendAccentColors(reference, catalog = HOBBII_YARN_CATALOG, limit = 4) {
  const base = typeof reference === "string" ? getYarnById(reference) : reference
  if (!base) return []

  const baseWeight = String(base.weight).toLowerCase()
  const family = String(base.color_family).toLowerCase()

  const sorted = [...catalog]
    .filter((yarn) => yarn.id !== base.id)
    .map((yarn) => ({
      ...yarn,
      _score: 0 +
        (String(yarn.color_family).toLowerCase() !== family ? 8 : -6) +
        (String(yarn.weight).toLowerCase() === baseWeight ? -2 : 0),
    }))
    .sort((a, b) => b._score - a._score)

  return sorted.slice(0, Math.max(1, limit)).map(({ _score, ...yarn }) => yarn)
}

export const YARN_CATALOG_HELPERS = {
  hexToRgb,
  getContrastColor,
  groupByLine,
  groupByFamily,
  suggestMatchingColors,
  recommendAccentColors,
}
