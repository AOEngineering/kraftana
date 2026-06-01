import {
  HOBBII_YARN_CATALOG as CatalogYarns,
  YARN_BRANDS as CatalogBrands,
  YARN_LINES as CatalogLines,
  YARN_BY_ID as CatalogById,
  YARN_FAMILIES as CatalogFamilies,
  YARN_WEIGHTS as CatalogWeights,
  YARN_TAGS as CatalogTags,
  YARN_BY_FAMILY as CatalogByFamily,
  YARN_BY_LINE as CatalogByLine,
} from "@/lib/yarnCatalog"

const FallbackYarns = Array.isArray(CatalogYarns) ? CatalogYarns : []
const FallbackBrands = Array.isArray(CatalogBrands) ? CatalogBrands : []
const FallbackLines = Array.isArray(CatalogLines) ? CatalogLines : []
const FallbackById = CatalogById && typeof CatalogById === "object" ? CatalogById : {}
const FallbackFamilies = Array.isArray(CatalogFamilies) ? CatalogFamilies : []
const FallbackWeights = Array.isArray(CatalogWeights) ? CatalogWeights : []
const FallbackTags = Array.isArray(CatalogTags) ? CatalogTags : []
const FallbackByFamily =
  CatalogByFamily && typeof CatalogByFamily === "object" ? CatalogByFamily : {}
const FallbackByLine = CatalogByLine && typeof CatalogByLine === "object" ? CatalogByLine : {}

export const HOBBII_YARN_CATALOG = FallbackYarns
export const YARN_BRANDS = FallbackBrands
export const YARN_LINES = FallbackLines
export const YARN_BY_ID = FallbackById
export const YARN_FAMILIES = FallbackFamilies
export const YARN_WEIGHTS = FallbackWeights
export const YARN_TAGS = FallbackTags
export const YARN_BY_FAMILY = FallbackByFamily
export const YARN_BY_LINE = FallbackByLine

export const YARN_COLORS = HOBBII_YARN_CATALOG

export const HOBBII_HONEY_BUNNY = YARN_COLORS.filter((item) => item.line === "Honey Bunny")

export const HOBBII_RAINBOW_84 = YARN_COLORS.filter((item) => item.line === "Rainbow Cotton 8/4")

export function distRGB(a, b) {
  const ar = a?.r ?? 0
  const ag = a?.g ?? 0
  const ab = a?.b ?? 0
  const br = b?.r ?? 0
  const bg = b?.g ?? 0
  const bb = b?.b ?? 0
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2)
}
