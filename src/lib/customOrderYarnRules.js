import { getStaticProductGuides } from "@/lib/productGuides"

function normalizeText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function clampRule(value, fallback, min = 1, max = 12) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.max(min, Math.min(Math.round(numeric), max))
}

function containsAny(text = "", terms = []) {
  return terms.some((term) => text.includes(term))
}

function clampRange(rule = {}) {
  const min = clampRule(rule.minColors, DEFAULT_YARN_RULE.minColors, 1, 12)
  const fallbackMax = Math.max(min, DEFAULT_YARN_RULE.maxColors)
  const max = clampRule(
    Object.prototype.hasOwnProperty.call(rule, "maxColors") ? rule.maxColors : fallbackMax,
    fallbackMax,
    min,
    12
  )
  const recommended = clampRule(
    rule.recommendedColors,
    Math.min(max, DEFAULT_YARN_RULE.recommendedColors),
    1,
    max
  )

  return {
    minColors: min,
    maxColors: max,
    recommendedColors: recommended,
    allowDuplicateYarns: Boolean(rule.allowDuplicateYarns),
    id: rule.id || "default",
  }
}

const DEFAULT_YARN_RULE = {
  id: "default",
  minColors: 1,
  maxColors: 3,
  recommendedColors: 2,
  allowDuplicateYarns: false,
}

const CATEGORY_YARN_RULES = {
  tops: {
    id: "tops",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  cardigans: {
    id: "cardigans",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  skirts: {
    id: "skirts",
    minColors: 1,
    maxColors: 3,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  blankets: {
    id: "blankets",
    minColors: 2,
    maxColors: 5,
    recommendedColors: 3,
    allowDuplicateYarns: false,
  },
  bags: {
    id: "bags",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  "something-else": {
    id: "something-else",
    minColors: 1,
    maxColors: 6,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
}

export const CUSTOM_YARN_RULE_SETS = Object.freeze({
  default: DEFAULT_YARN_RULE,
  ...CATEGORY_YARN_RULES,
  beanie: {
    id: "beanie",
    minColors: 1,
    maxColors: 2,
    recommendedColors: 1,
    allowDuplicateYarns: false,
  },
  "baby-blanket": {
    id: "baby-blanket",
    minColors: 2,
    maxColors: 5,
    recommendedColors: 3,
    allowDuplicateYarns: false,
  },
  plush: {
    id: "plush",
    minColors: 1,
    maxColors: 8,
    recommendedColors: 4,
    allowDuplicateYarns: false,
  },
  pillow: {
    id: "pillow",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  "wall-hanging": {
    id: "wall-hanging",
    minColors: 3,
    maxColors: 10,
    recommendedColors: 4,
    allowDuplicateYarns: false,
  },
  scarf: {
    id: "scarf",
    minColors: 1,
    maxColors: 3,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  cardigan: {
    id: "cardigan",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  skirt: {
    id: "granny-square-skirt",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
  halter: {
    id: "halter",
    minColors: 1,
    maxColors: 5,
    recommendedColors: 3,
    allowDuplicateYarns: false,
  },
  "shorts": {
    id: "shorts",
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
    allowDuplicateYarns: false,
  },
})

function normalizeCategory(category = "") {
  return normalizeText(category)
}

const CATEGORY_RULE_MAP = {
  tops: "tops",
  cardigans: "cardigans",
  skirts: "skirts",
  blankets: "blankets",
  bags: "bags",
  "something-else": "something-else",
}

const ITEM_RULES = [
  {
    id: "beanie",
    terms: ["beanie", "cat ear", "cat-ear", "cat ear beanie", "cat-ear beanie", "cat ear beanie"],
    minColors: 1,
    maxColors: 2,
    recommendedColors: 1,
  },
  {
    id: "baby-blanket",
    terms: ["baby blanket", "baby throw", "blanket", "throws", "throw", "shawl"],
    minColors: 2,
    maxColors: 5,
    recommendedColors: 3,
  },
  {
    id: "plush",
    terms: ["plush", "amigurumi", "doll", "toy", "toyie"],
    minColors: 1,
    maxColors: 8,
    recommendedColors: 4,
  },
  {
    id: "pillow",
    terms: ["pillow", "cushion", "home comfort", "decor pillow", "deco pillow", "decorative pillow"],
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
  },
  {
    id: "wall-hanging",
    terms: ["wall hanging", "wall decor", "wall decoration", "wall art", "hanging"],
    minColors: 3,
    maxColors: 10,
    recommendedColors: 4,
  },
  {
    id: "shorts",
    terms: ["short", "shorts", "granny stitch shorts"],
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
  },
  {
    id: "scarf",
    terms: ["scarf"],
    minColors: 1,
    maxColors: 3,
    recommendedColors: 2,
  },
  {
    id: "cardigan",
    terms: ["cardigan", "cardigans", "tweister", "twister", "granny twister", "granny hexagon"],
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
  },
  {
    id: "granny-square-skirt",
    terms: ["granny square skirt", "granny stitch short", "granny stitch", "skirt"],
    minColors: 1,
    maxColors: 4,
    recommendedColors: 2,
  },
]

const PRODUCT_GUIDE_RULE_INDEX = Object.freeze(
  getStaticProductGuides().map((guide) => ({
    id: guide.slug || guide.title || "",
    title: normalizeText(guide.title || ""),
    slug: normalizeText(guide.slug || ""),
    category: normalizeText(guide.category || ""),
    maxColors: guide.maxColors,
    minColors: guide.minColors,
    recommendedColors: guide.recommendedColors,
    yarnRules: guide.yarnRules,
  }))
)

const GUIDE_BY_TEXT_CACHE = Object.freeze(
  PRODUCT_GUIDE_RULE_INDEX.map((guide) => ({
    ...guide,
    tokens: [guide.title, guide.slug, guide.category].filter(Boolean).join(" "),
  }))
)

function parseGuideRuleFromCatalog(text = "") {
  const haystack = normalizeText(text)
  if (!haystack) return null

  const exact = GUIDE_BY_TEXT_CACHE.find((guide) => {
    if (!guide.maxColors || !Number.isFinite(Number(guide.maxColors))) return false
    return containsAny(haystack, [guide.title, guide.slug].filter(Boolean))
  })
  if (exact) {
    const normalizedMin = Number.isFinite(Number(exact.minColors)) ? Number(exact.minColors) : 1
    const normalizedMax = Number(exact.maxColors)
    const recommended = clampRule(exact.recommendedColors, Math.min(3, normalizedMax))
    return {
      id: exact.id || "guide",
      minColors: normalizedMin,
      maxColors: normalizedMax,
      recommendedColors: recommended,
      allowDuplicateYarns: false,
    }
  }

  const categoryHint = GUIDE_BY_TEXT_CACHE.find(
    (guide) =>
      guide.category &&
      containsAny(haystack, [guide.category]) &&
      Number.isFinite(Number(guide.maxColors))
  )
  if (!categoryHint) return null

  return {
    id: categoryHint.id || "guide-category",
    minColors: Number.isFinite(Number(categoryHint.minColors)) ? Number(categoryHint.minColors) : 1,
    maxColors: Number(categoryHint.maxColors),
    recommendedColors: clampRule(categoryHint.recommendedColors, Math.min(3, Number(categoryHint.maxColors)), 1, 3),
    allowDuplicateYarns: false,
  }
}

function normalizeGuideMeta(guideMeta) {
  if (!guideMeta || typeof guideMeta !== "object") return null

  if (guideMeta.yarnRules && typeof guideMeta.yarnRules === "object") {
    return {
      id: guideMeta.id || guideMeta.source || "guideMeta",
      ...guideMeta.yarnRules,
    }
  }

  if (
    !Object.prototype.hasOwnProperty.call(guideMeta, "maxColors") &&
    !Object.prototype.hasOwnProperty.call(guideMeta, "minColors") &&
    !Object.prototype.hasOwnProperty.call(guideMeta, "recommendedColors") &&
    !Object.prototype.hasOwnProperty.call(guideMeta, "allowDuplicateYarns")
  ) {
    return null
  }

  return {
    id: guideMeta.id || guideMeta.source || "guideMeta",
    minColors: guideMeta.minColors,
    maxColors: guideMeta.maxColors,
    recommendedColors: guideMeta.recommendedColors,
    allowDuplicateYarns: guideMeta.allowDuplicateYarns,
  }
}

function parseRuleByTerms(text = "") {
  const haystack = normalizeText(text)
  const matched = ITEM_RULES.find((rule) => containsAny(haystack, rule.terms || []))
  return matched ? { ...matched, id: matched.id } : null
}

function parseRuleFromSelection(category, itemType, guideProduct, customItemText) {
  const source = normalizeText([itemType, guideProduct, customItemText, category].join(" "))
  if (!source) return null

  return (
    parseRuleByTerms(source) ||
    parseGuideRuleFromCatalog(source) ||
    null
  )
}

export function getYarnRulesFromSelection({
  category = "",
  itemType = "",
  guideProduct = "",
  customItemText = "",
  guideMeta = null,
} = {}) {
  if (guideMeta) {
    const fromMeta = normalizeGuideMeta(guideMeta)
    if (fromMeta) {
      return {
        ...clampRange(fromMeta),
        source: guideMeta.id || guideMeta.source || "guideMeta",
      }
    }
  }

  const byItem = parseRuleFromSelection(category, itemType, guideProduct, customItemText)
  if (byItem) {
    return {
      ...clampRange(byItem),
      source: byItem.id,
    }
  }

  const normalizedCategory = normalizeCategory(category)
  const categoryRule = CATEGORY_RULE_MAP[normalizedCategory] || "default"
  return {
    ...clampRange(CUSTOM_YARN_RULE_SETS[categoryRule] || CUSTOM_YARN_RULE_SETS.default),
    source: categoryRule,
  }
}

export function getYarnRuleLabel(rule) {
  const safe = clampRange(rule || CUSTOM_YARN_RULE_SETS.default)
  const { minColors, maxColors, recommendedColors } = safe
  const recommendationText = recommendedColors
    ? ` (recommended ${recommendedColors})`
    : ""
  return `Choose ${minColors} to ${maxColors} colors${recommendationText}.`
}
