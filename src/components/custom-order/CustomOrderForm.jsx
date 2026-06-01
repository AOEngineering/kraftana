"use client"

import Image from "next/image"
import { useMemo, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  MapPin,
  Palette,
  ShoppingBag,
} from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import ColorPicker from "@/components/yarn/ColorPicker"
import { YARN_BY_ID } from "@/components/yarn/colors"
import { getYarnRuleLabel, getYarnRulesFromSelection } from "@/lib/customOrderYarnRules"

const STEP_LABELS = ["1 Choose the piece", "2 Add details", "3 Contact and delivery"]

const CATEGORY_OPTIONS = [
  {
    value: "tops",
    label: "Tops",
    description: "Granny square tops, halters, crops, and wearable pieces.",
    helper: "Best when you know your general size.",
    image: "/images/blush-sage-granny-square-top.jpeg",
    lead: "Starting from 1 week",
    yarnRules: {
      minColors: 1,
      maxColors: 4,
      recommendedColors: 2,
      allowDuplicateYarns: false,
    },
  },
  {
    value: "cardigans",
    label: "Cardigans",
    description: "Cozy layers with custom color and fit options.",
    helper: "Great for statement pieces.",
    image: "/images/blue-granny-square-cardigan.jpeg",
    lead: "6â€“9 days",
    yarnRules: {
      minColors: 1,
      maxColors: 4,
      recommendedColors: 2,
      allowDuplicateYarns: false,
    },
  },
  {
    value: "skirts",
    label: "Skirts",
    description: "Soft handmade texture with your preferred length and palette.",
    helper: "Good for color blocking or stripes.",
    image: "/images/striped-midi-skirt.jpeg",
    lead: "6â€“10 days",
    yarnRules: {
      minColors: 1,
      maxColors: 3,
      recommendedColors: 2,
      allowDuplicateYarns: false,
    },
  },
  {
    value: "blankets",
    label: "Blankets",
    description: "Keepsake pieces for gifting, nursery, or home use.",
    helper: "Longer timeline.",
    image: "/images/patchwork-drawstring-skirt.jpeg",
    lead: "2â€“3 weeks",
    yarnRules: {
      minColors: 2,
      maxColors: 5,
      recommendedColors: 3,
      allowDuplicateYarns: false,
    },
  },
  {
    value: "bags",
    label: "Bags & accessories",
    description: "Beanies, scarves, totes, and playful accessory starts.",
    helper: "Great for gifts.",
    image: "/images/striped-crochet-beanie.jpeg",
    lead: "7â€“12 days",
    yarnRules: {
      minColors: 1,
      maxColors: 4,
      recommendedColors: 2,
      allowDuplicateYarns: false,
    },
  },
  {
    value: "something-else",
    label: "Something else",
    description: "Have a direction outside the list? Tell Kevonne your idea.",
    helper: "We'll review and propose next steps.",
    lead: "Quoted by request",
    image: "/images/patchwork-drawstring-skirt.jpeg",
    yarnRules: {
      minColors: 1,
      maxColors: 6,
      recommendedColors: 2,
      allowDuplicateYarns: false,
    },
  },
]

const CATEGORY_STARTERS = {
  tops: [
    {
      label: "Granny square top",
      description: "A flexible wearable base with crop or regular line options.",
      lead: "Starting range: 1â€“2 weeks",
      image: "/images/blush-sage-granny-square-top.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "High neck granny halter",
      description: "Great for neckline contrast, fitted shoulders, and hand-finished edges.",
      lead: "Good for statement shapes",
      image: "/images/sunset-chevron-halter-top.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 5,
        recommendedColors: 3,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Granny square crop sweater vest",
      description: "A cropped wearable piece for layered styling and easy alterations.",
      lead: "Lead time varies by size",
      image: "/images/blue-granny-square-cardigan.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
  ],
  cardigans: [
    {
      label: "Granny twister cardigan",
      description: "Warm drape with visible edge stitch and border detail potential.",
      lead: "Starting range: 1 week",
      image: "/images/blue-granny-square-cardigan.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Granny hexagon cardigan",
      description: "Cozy layers with rich loops and natural movement.",
      lead: "Great for fall-through fabrics",
      image: "/images/autumn-granny-square-cardigan.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Long knit cardigan",
      description: "Soft throw-on style, tailored to your preferred hand-feel.",
      lead: "Plan for extra fitting time",
      image: "/images/autumn-granny-square-cardigan.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
  ],
  skirts: [
    {
      label: "Granny square skirt",
      description: "Classic silhouette with handmade texture and room for custom lines.",
      lead: "Best in medium-to-full yarn density",
      image: "/images/striped-midi-skirt.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Granny square skirt / wrap",
      description: "Length-flexible styling with warm tones and stitched movement.",
      lead: "Ideal for coordinated sets",
      image: "/images/floral-granny-square-skirt.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Mini pleated skirt variation",
      description: "Cleaner linework for a tailored mini silhouette.",
      lead: "Length confirms best in step 2",
      image: "/images/pastel-granny-square-skirt.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 3,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
  },
  ],
  blankets: [
    {
      label: "Blanket",
      description: "A keepsake project for nursery, home, or gifting.",
      lead: "Larger sizes need extra lead time",
      image: "/images/autumn-granny-square-cardigan.jpeg",
      yarnRules: {
        minColors: 2,
        maxColors: 5,
        recommendedColors: 3,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Patchwork drawstring blanket",
      description: "Structured with coordinated palette and warm texture.",
      lead: "Great for throws and small wall pieces",
      image: "/images/patchwork-drawstring-skirt.jpeg",
      yarnRules: {
        minColors: 2,
        maxColors: 5,
        recommendedColors: 3,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Light lap blanket",
      description: "Designed for smaller cozy use and travel moments.",
      lead: "Smaller run times",
      image: "/images/patchwork-drawstring-skirt.jpeg",
      yarnRules: {
        minColors: 2,
        maxColors: 5,
        recommendedColors: 3,
        allowDuplicateYarns: false,
      },
    },
  ],
  bags: [
    {
      label: "Bag or tote",
      description: "Useful with personalityâ€”small tote, shoulder size, or custom shape.",
      lead: "Great quick-project starter",
      image: "/images/striped-crochet-beanie.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Crochet bead basket",
      description: "Utility meets texture; open to handles, lining, and size tweaks.",
      lead: "Good for custom closures",
      image: "/images/striped-crochet-beanie.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 2,
        recommendedColors: 1,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Statement basket tote",
      description: "A decorative everyday piece with soft, visible stitches.",
      lead: "Ask for strap strength in details",
      image: "/images/blue-granny-square-cardigan.jpeg",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
  ],
  "something-else": [
    {
      label: "Gift or one-off idea",
      description: "Any handmade concept outside standard categories.",
      lead: "Submit your vision and weâ€™ll quote it",
      image: "",
      yarnRules: {
        minColors: 1,
        maxColors: 6,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Toy or plush request",
      description: "Soft animal shapes, plushies, or playful crochet builds.",
      lead: "Great for statement gifts",
      image: "",
      yarnRules: {
        minColors: 1,
        maxColors: 8,
        recommendedColors: 4,
        allowDuplicateYarns: false,
      },
    },
    {
      label: "Pillow or decorative accessory",
      description: "Wall dÃ©cor and home comfort in your preferred shape.",
      lead: "Share size and shape before we build",
      image: "",
      yarnRules: {
        minColors: 1,
        maxColors: 4,
        recommendedColors: 2,
        allowDuplicateYarns: false,
      },
    },
  ],
}

const CATEGORY_KEY_TERMS = {
  tops: ["top", "tops", "halter", "vest", "crop", "bra", "blouse", "wearable", "granny"],
  cardigans: ["cardigan", "cardigans", "sweater", "vest"],
  skirts: ["skirt", "skirts", "skort", "wrap"],
  blankets: [
    "blanket",
    "blankets",
    "throw",
    "pillow",
    "quilt",
    "quilted",
    "drape",
    "home",
    "dÃ©cor",
    "decor",
    "cushion",
  ],
  bags: [
    "bag",
    "bags",
    "beanie",
    "beanies",
    "scarf",
    "accessory",
    "tote",
    "shawl",
    "cap",
    "basket",
    "muffler",
    "cowl",
  ],
  "something-else": [
    "short",
    "shorts",
    "plush",
    "plushie",
    "plushies",
    "doll",
    "toy",
    "toyie",
    "custom",
    "other",
    "sock",
    "socks",
    "pillow",
  ],
}

const GUIDE_CATEGORY_ALIASES = {
  handbags: "bags",
  beanie: "bags",
  beanies: "bags",
  scarves: "bags",
  scarf: "bags",
  accessory: "bags",
  accessories: "bags",
  cap: "bags",
  caps: "bags",
  tote: "bags",
  totes: "bags",
  cowl: "bags",
  "cat ear": "something-else",
  toy: "something-else",
  plush: "something-else",
  plushie: "something-else",
  plushies: "something-else",
}

const SIZE_OPTIONS_BY_CATEGORY = {
  tops: [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
  ],
  cardigans: [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "one-size", label: "One size" },
  ],
  skirts: [
    { value: "s", label: "S (waist 24-26)" },
    { value: "m", label: "M (waist 27-30)" },
    { value: "l", label: "L (waist 31-34)" },
    { value: "xl", label: "XL (waist 35-38)" },
  ],
  blankets: [
    { value: "small", label: "Small (lap)" },
    { value: "throw", label: "Throw" },
    { value: "queen", label: "Queen" },
    { value: "king", label: "King" },
  ],
  bags: [
    { value: "small", label: "Small tote / cute bag" },
    { value: "medium", label: "Medium tote" },
    { value: "large", label: "Large tote" },
  ],
  "something-else": [{ value: "custom", label: "Custom" }],
}

const GUIDE_HINT_IMAGES = {
  tops: {
    "granny square top": "/images/blush-sage-granny-square-top.jpeg",
    "granny square crochet top": "/images/blush-sage-granny-square-top.jpeg",
    "halfter": "/images/sunset-chevron-halter-top.jpeg",
    halter: "/images/sunset-chevron-halter-top.jpeg",
    "crochet vest": "/images/blue-granny-square-cardigan.jpeg",
    default: "/images/blush-sage-granny-square-top.jpeg",
  },
  cardigans: {
    cardigan: "/images/blue-granny-square-cardigan.jpeg",
    twister: "/images/blue-granny-square-cardigan.jpeg",
    hexagon: "/images/blue-granny-square-cardigan.jpeg",
    default: "/images/blue-granny-square-cardigan.jpeg",
  },
  skirts: {
    skirt: "/images/striped-midi-skirt.jpeg",
    "granny square skirt": "/images/floral-granny-square-skirt.jpeg",
    default: "/images/striped-midi-skirt.jpeg",
  },
  blankets: {
    blanket: "/images/autumn-granny-square-cardigan.jpeg",
    default: "/images/autumn-granny-square-cardigan.jpeg",
  },
  bags: {
    bag: "/images/striped-crochet-beanie.jpeg",
    beanie: "/images/striped-crochet-beanie.jpeg",
    scarf: "/images/cobalt-fringe-scarf.jpeg",
    accessory: "/images/cobalt-fringe-scarf.jpeg",
    tote: "/images/striped-crochet-beanie.jpeg",
    default: "/images/striped-crochet-beanie.jpeg",
  },
  "something-else": {
    default: "",
  },
}

const ORDER_SCHEMA = z
  .object({
    category: z.string().min(1, "Pick what you want made"),
    itemType: z.string().min(1, "Please pick a piece"),
    guideProduct: z.string().max(200).default(""),
    customItemText: z.string().max(400).default(""),
    size: z.string().min(1, "Choose a size"),
    quantity: z.coerce.number().min(1, "At least 1 piece").max(20, "Too many pieces for one request"),
    selectedYarnIds: z.array(z.string().trim().min(1)).default([]),
    colors: z.string().trim().max(500).optional().default(""),
    message: z.string().trim().max(5000).default(""),
    name: z.string().trim().min(2, "Add your name"),
    email: z.string().trim().max(255).optional().default(""),
    phone: z.string().trim().max(80).optional().default(""),
    shippingAddressLine1: z.string().trim().min(1, "Street address is required"),
    shippingAddressLine2: z.string().trim().max(255).optional().default(""),
    shippingCity: z.string().trim().min(1, "City is required"),
    shippingState: z.string().trim().min(1, "State is required"),
    shippingPostalCode: z.string().trim().min(1, "Postal code is required"),
    shippingCountry: z.string().trim().max(120).default("United States"),
    requested_product_slug: z.string().trim().max(160).optional().default(""),
    cookieConsent: z.union([z.enum(["accepted", "declined"]), z.literal("")]).optional().default(""),
  })
  .superRefine((values, context) => {
    const category = String(values.category || "").trim().toLowerCase()
    const guideProduct = String(values.guideProduct || "").trim()
    const customItemText = String(values.customItemText || "").trim()
    const itemType = String(values.itemType || "").trim()
    const selectedYarnIds = Array.isArray(values.selectedYarnIds) ? values.selectedYarnIds : []

    const rules = getYarnRulesFromSelection({
      category,
      guideProduct,
      customItemText,
      itemType,
    })
    const uniqueSelectionCount = new Set(selectedYarnIds.filter(Boolean)).size

    if (!selectedYarnIds.length || uniqueSelectionCount < rules.minColors) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedYarnIds"],
        message: `Pick at least ${rules.minColors} yarn color${rules.minColors === 1 ? "" : "s"} for this piece.`,
      })
    }
    if (uniqueSelectionCount > rules.maxColors) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedYarnIds"],
        message: `You can only choose up to ${rules.maxColors} yarn color${rules.maxColors === 1 ? "" : "s"} for this piece.`,
      })
    }
    if (!rules.allowDuplicateYarns && uniqueSelectionCount !== selectedYarnIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedYarnIds"],
        message: "Duplicate yarn selection is not supported for this piece.",
      })
    }

    const hasEmail = Boolean(String(values.email || "").trim())
    const hasPhone = Boolean(String(values.phone || "").trim())

    if (!hasEmail && !hasPhone) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Add an email or phone number so we can follow up.",
      })
    }

    if (category === "something-else" && !String(values.customItemText || "").trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customItemText"],
        message: "Tell us your idea so we can prepare a custom quote.",
      })
    }
  })

function buildCategoryFromPathValue(value = "") {
  const normalized = String(value || "").toLowerCase().trim()
  if (!normalized) return ""

  const has = (terms) => terms.some((term) => normalized.includes(term))

  if (normalized === "tops" || normalized === "tops-custom" || normalized === "top") return "tops"
  if (normalized === "cardigans" || normalized === "cardigan") return "cardigans"
  if (normalized === "skirts" || normalized === "skirt") return "skirts"
  if (normalized === "blankets" || normalized === "blanket") return "blankets"
  if (normalized === "bags" || normalized === "bag") return "bags"
  if (normalized === "something-else" || normalized === "custom") return "something-else"

  const alias = Object.entries(GUIDE_CATEGORY_ALIASES).find(([aliasValue]) =>
    normalized.includes(aliasValue)
  )?.[1]
  if (alias) return alias

  if (has(["granny square", "top", "tops", "halter", "vest", "crop", "bra", "sleeve", "wearable"])) return "tops"
  if (has(CATEGORY_KEY_TERMS.cardigans)) return "cardigans"
  if (has(["skirt", "skirts"])) return "skirts"
  if (has(CATEGORY_KEY_TERMS.blankets)) return "blankets"
  if (has(CATEGORY_KEY_TERMS.bags)) return "bags"
  if (has(CATEGORY_KEY_TERMS["something-else"])) return "something-else"

  return ""
}

function findImageForGuide(guide, category) {
  const map = GUIDE_HINT_IMAGES[category] || {}
  const raw = `${guide?.title || ""} ${guide?.slug || ""} ${guide?.category || ""}`.toLowerCase()

  for (const key of Object.keys(map)) {
    if (key === "default") continue
    if (raw.includes(key)) return map[key]
  }

  return map.default || ""
}

function normalizeCategoryKey(raw = "") {
  const text = String(raw || "").toLowerCase()
  if (!text) return "something-else"

  const has = (terms) => terms.some((term) => text.includes(term))

  const alias = Object.entries(GUIDE_CATEGORY_ALIASES).find(([aliasValue]) => text.includes(aliasValue))
  if (alias) return alias[1]
  if (has(CATEGORY_KEY_TERMS.cardigans)) return "cardigans"
  if (has(CATEGORY_KEY_TERMS.blankets)) return "blankets"
  if (has(CATEGORY_KEY_TERMS.bags)) return "bags"
  if (has(["top", "tops", "halter", "vest", "granny", "crop", "wearable"])) return "tops"
  if (text.includes("skirt")) return "skirts"
  if (has(CATEGORY_KEY_TERMS["something-else"])) return "something-else"
  return "something-else"
}

function toLabelFromCategory(category = "") {
  const found = CATEGORY_OPTIONS.find((option) => option.value === category)
  return found?.label || "Custom item"
}

function formatSizesFromGuide(guide) {
  if (!guide?.sizes || !guide.sizes.length) return []
  const seen = new Set()
  return guide.sizes
    .map((entry) => {
      const value = String(entry.label || entry.value || "").trim().toLowerCase().replace(/\s+/g, "-")
      const label = String(entry.label || entry.value || "").trim()
      if (!value || seen.has(value)) return null
      seen.add(value)
      return { value, label }
    })
    .filter(Boolean)
}

function normalizeYarnRules(raw = null) {
  if (!raw || typeof raw !== "object") return null

  if (!Object.keys(raw).length) return null

  const minColors = Number(raw.minColors)
  const maxColors = Number(raw.maxColors)
  const recommendedColors = Number(raw.recommendedColors)

  return {
    id: raw.id || `rule-${Math.random().toString(36).slice(2, 8)}`,
    minColors: Number.isFinite(minColors) ? minColors : 1,
    maxColors: Number.isFinite(maxColors) ? maxColors : 1,
    recommendedColors: Number.isFinite(recommendedColors) ? recommendedColors : 1,
    allowDuplicateYarns: Boolean(raw.allowDuplicateYarns),
    source: raw.source || "piece-meta",
  }
}

function buildGuideRuleMeta(guide, fallbackCards = [], guideProduct = "") {
  if (guide) {
    const fromGuideYarnRules = normalizeYarnRules(guide.yarnRules)
    if (fromGuideYarnRules) return fromGuideYarnRules

    const fromGuideMax = Number(guide.maxColors)
    const fromGuideMin = Number(guide.minColors)
    const fromGuideRecommended = Number(guide.recommendedColors)
    if (Number.isFinite(fromGuideMax)) {
      return {
        id: guide.id || guide.slug || `guide-${String(guide.title || "").toLowerCase().replace(/\s+/g, "-")}`,
        minColors: Number.isFinite(fromGuideMin) ? Math.max(1, Math.floor(fromGuideMin)) : 1,
        maxColors: Math.max(1, Math.floor(fromGuideMax)),
        recommendedColors: Number.isFinite(fromGuideRecommended)
          ? Math.max(1, Math.floor(fromGuideRecommended))
          : Math.max(1, Math.min(3, Math.floor(fromGuideMax))),
        allowDuplicateYarns: false,
        source: guide.source || "guide-meta",
      }
    }
  }

  const matchedStarter = fallbackCards.find((item) =>
    String(item.label || "").trim().toLowerCase() === String(guideProduct || "").trim().toLowerCase()
  )
  if (!matchedStarter) return null

  return normalizeYarnRules(matchedStarter.yarnRules)
}

function getDefaultCategoryRule(category) {
  const match = CATEGORY_OPTIONS.find((option) => option.value === category)
  return normalizeYarnRules(match?.yarnRules)
}

function resolveItemType(category, guideTitle, customText) {
  if (category === "something-else") return String(customText || "").trim() || "Custom item"
  if (guideTitle) return guideTitle
  const categoryOption = CATEGORY_OPTIONS.find((option) => option.value === category)
  return categoryOption?.label || "Custom piece"
}

function sizeLabelFromValue(value) {
  if (!value) return "Not selected"
  const options = [
    ...SIZE_OPTIONS_BY_CATEGORY.tops,
    ...SIZE_OPTIONS_BY_CATEGORY.cardigans,
    ...SIZE_OPTIONS_BY_CATEGORY.skirts,
    ...SIZE_OPTIONS_BY_CATEGORY.blankets,
    ...SIZE_OPTIONS_BY_CATEGORY.bags,
    ...SIZE_OPTIONS_BY_CATEGORY["something-else"],
  ]
  return options.find((option) => option.value === value)?.label || value
}

function selectedGuideLabelForForm(guideProduct = "") {
  return guideProduct ? String(guideProduct).trim() : ""
}

export default function CustomOrderForm({
  requestedPiece = "",
  requestedProductTitle = "",
  guides = [],
}) {
  const router = useRouter()
  const requestedGuide = useMemo(() => {
    if (!Array.isArray(guides) || (!requestedPiece && !requestedProductTitle)) return null

    const normalizedProductTitle = String(requestedProductTitle || "").trim().toLowerCase()

    return (
      guides.find((guide) => guide?.slug === requestedPiece) ||
      guides.find((guide) => {
        const guideTitle = String(guide?.title || "").trim().toLowerCase()
        return normalizedProductTitle && guideTitle === normalizedProductTitle
      }) ||
      null
    )
  }, [guides, requestedPiece, requestedProductTitle])

  const preselectedCategory = useMemo(() => {
    const fromSlug = buildCategoryFromPathValue(requestedPiece)
    if (fromSlug) return fromSlug
    if (requestedGuide?.category) {
      const fromGuideCategory = normalizeCategoryKey(requestedGuide.category)
      if (fromGuideCategory) return fromGuideCategory
    }
    const fromTitle = buildCategoryFromPathValue(requestedProductTitle)
    if (fromTitle) return fromTitle
    return ""
  }, [requestedGuide, requestedPiece, requestedProductTitle])

  const guideSuggestions = useMemo(() => {
    const groups = CATEGORY_OPTIONS.reduce((acc, option) => {
      acc[option.value] = []
      return acc
    }, {})

    guides?.forEach((guide) => {
      const key = normalizeCategoryKey([guide?.category, guide?.title].filter(Boolean).join(" "))
      const title = String(guide?.title || "").trim()
      const label = title || guide?.slug || "Guide option"
      groups[key].push({
        key: guide?.slug || label.toLowerCase(),
        slug: guide?.slug || "",
        title: label,
        category: key,
        sizeOptions: formatSizesFromGuide(guide),
        minColors: guide?.minColors,
        maxColors: guide?.maxColors || "",
        recommendedColors: guide?.recommendedColors,
        image: guide?.image || findImageForGuide(guide, key),
        yarnRules: guide?.yarnRules || null,
      })
    })

    const orderedGroups = Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, value]))

    return orderedGroups
  }, [guides])

  const defaultGuide = requestedGuide?.title || requestedProductTitle || ""

  const form = useForm({
    resolver: zodResolver(ORDER_SCHEMA),
    defaultValues: {
      category: preselectedCategory,
      itemType: "",
      guideProduct: defaultGuide || "",
      customItemText: requestedProductTitle || "",
      size: "",
      quantity: 1,
      selectedYarnIds: [],
      colors: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingCity: "",
      shippingState: "",
      shippingPostalCode: "",
      shippingCountry: "United States",
      requested_product_slug: requestedPiece || "",
      cookieConsent: "",
    },
    mode: "onBlur",
  })

  const [step, setStep] = useState(1)
  const [showAllGuides, setShowAllGuides] = useState(false)
  const [paletteNotice, setPaletteNotice] = useState("")

  const isSubmitting = form.formState.isSubmitting

  const [
    category = "",
    itemType = "",
    guideProduct = "",
    customItemText = "",
    size = "",
    quantity = 1,
    colors = "",
    selectedYarnIds = [],
    name = "",
    email = "",
    phone = "",
    shippingAddressLine1 = "",
    shippingAddressLine2 = "",
    shippingCity = "",
    shippingState = "",
    shippingPostalCode = "",
    shippingCountry = "United States",
    message = "",
  ] = useWatch({
    control: form.control,
    name: [
      "category",
      "itemType",
      "guideProduct",
      "customItemText",
      "size",
      "quantity",
      "colors",
      "selectedYarnIds",
      "name",
      "email",
      "phone",
      "shippingAddressLine1",
      "shippingAddressLine2",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
      "shippingCountry",
      "message",
    ],
  })

  const relatedGuides = guideSuggestions[category] || []
  const hasGuideChoices = relatedGuides.length > 0
  const fallbackCards = CATEGORY_STARTERS[category] || []

  const pieceCards = useMemo(() => {
    if (!category) return []
    const guides = relatedGuides.map((guide) => ({
      key: `guide-${guide.slug || guide.title}`,
      title: guide.title,
      slug: guide.slug,
      sizeOptions: guide.sizeOptions || [],
      maxColors: guide.maxColors || null,
      minColors: guide.minColors || null,
      recommendedColors: guide.recommendedColors || null,
      image: guide.image || "",
      source: "guide",
      helperText: guide.title,
      leadText: guide.sizeOptions?.length
        ? `${guide.sizeOptions.length} size${guide.sizeOptions.length > 1 ? "s" : ""} to start`
        : "",
      noteText: guide.maxColors ? `Up to ${guide.maxColors} colors` : null,
      yarnRules: guide.yarnRules || null,
    }))

    const starters = fallbackCards.map((card, index) => ({
      key: `${category}-starter-${index}`,
      title: card.label,
      slug: "",
      sizeOptions: [],
      maxColors: null,
      minColors: null,
      recommendedColors: null,
      image: card.image || "",
      source: "starter",
      helperText: card.description,
      leadText: card.lead,
      noteText: card.priceRange ? `Estimated price: ${card.priceRange}` : null,
      yarnRules: card.yarnRules || null,
    }))

    if (guides.length > 0) {
      return guides
    }

    return starters
  }, [category, relatedGuides, fallbackCards])

  const shownPieces = useMemo(() => {
    if (showAllGuides) return pieceCards
    return pieceCards.slice(0, 3)
  }, [pieceCards, showAllGuides])

  const hasStarterCards = shownPieces.length > 0

  const starterIsGuideDriven = hasGuideChoices
  const canShowMoreGuides = pieceCards.length > 3

  const selectedGuide = relatedGuides.find((guide) => guide.title === guideProduct)

  const guideSizeOptions = useMemo(() => {
    if (selectedGuide?.sizeOptions?.length) return selectedGuide.sizeOptions
    return SIZE_OPTIONS_BY_CATEGORY[category] || SIZE_OPTIONS_BY_CATEGORY["something-else"]
  }, [selectedGuide, category])

  const guideRuleMeta = useMemo(() => {
    if (guideProduct) {
      const guideMetaFromGuide = buildGuideRuleMeta(
        {
          ...selectedGuide,
          source: selectedGuide ? "guide" : "guide-name",
        },
        fallbackCards,
        guideProduct
      )

      if (guideMetaFromGuide) return guideMetaFromGuide
    }

    const selectedCategory = getDefaultCategoryRule(category)
    return selectedCategory || null
  }, [guideProduct, selectedGuide, fallbackCards, category])

  const activeYarnRules = useMemo(
    () =>
      getYarnRulesFromSelection({
        category,
        itemType,
        guideProduct,
        customItemText,
        guideMeta: guideRuleMeta,
      }),
    [category, itemType, guideProduct, customItemText, guideRuleMeta]
  )

  const selectedYarns = useMemo(() => {
    const ids = Array.isArray(selectedYarnIds) ? selectedYarnIds : []
    return ids
      .map((id) => YARN_BY_ID[id])
      .filter(Boolean)
      .filter((yarn, index, source) => source.findIndex((item) => item?.id === yarn.id) === index)
  }, [selectedYarnIds])

  const selectedYarnIdsSet = useMemo(
    () => new Set((selectedYarnIds || []).filter(Boolean)),
    [selectedYarnIds]
  )

  const selectedYarnCount = selectedYarnIdsSet.size
  const maxYarnSelections = activeYarnRules.maxColors
  const minYarnSelections = activeYarnRules.minColors
  const canAddMoreYarns = selectedYarnCount < maxYarnSelections
  const remainingYarnSelections = Math.max(0, maxYarnSelections - selectedYarnCount)
  const paletteStatusLabel = `${selectedYarnCount} / ${maxYarnSelections} colors selected`
  const selectedYarnRuleSummary = getYarnRuleLabel(activeYarnRules)
  const remainingSlotsText = canAddMoreYarns
    ? `${remainingYarnSelections} more color${remainingYarnSelections === 1 ? "" : "s"} can be added.`
    : selectedYarnCount >= maxYarnSelections
      ? "Maximum colors reached."
      : ""

  useEffect(() => {
    form.setValue("itemType", resolveItemType(category, guideProduct, customItemText), {
      shouldValidate: false,
      shouldDirty: false,
    })
  }, [category, guideProduct, customItemText, form])

  useEffect(() => {
    if (!maxYarnSelections) return

    if (selectedYarnCount > maxYarnSelections) {
      const trimmed = selectedYarnIds.slice(0, maxYarnSelections)
      form.setValue("selectedYarnIds", trimmed, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setPaletteNotice(`This piece allows up to ${maxYarnSelections} colors. Extra colors were removed.`)
      return
    }

    if (selectedYarnCount < minYarnSelections) {
      setPaletteNotice(`This piece needs at least ${minYarnSelections} colors before moving forward.`)
      return
    }

    if (!paletteNotice) {
      return
    }

    setPaletteNotice("")
  }, [
    maxYarnSelections,
    selectedYarnCount,
    selectedYarnIds,
    minYarnSelections,
    form,
    paletteNotice,
  ])

  useEffect(() => {
    if (!paletteNotice) return
    const timer = setTimeout(() => setPaletteNotice(""), 2400)
    return () => clearTimeout(timer)
  }, [paletteNotice])

  const continueStep = useCallback(async () => {
    if (step === 1) {
      if (!category) {
        await form.trigger("category")
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      const valid = await form.trigger(["size", "quantity", "selectedYarnIds"])
      if (!valid) return
      setStep(3)
    }
  }, [category, form, step])

  const goBackStep = useCallback(() => {
    setStep((value) => Math.max(1, value - 1))
  }, [])

  const goToStep = useCallback((nextStep) => {
    setStep(nextStep)
    if (nextStep === 1) {
      setShowAllGuides(false)
    }
  }, [])

  const handleYarnChange = useCallback(
    (next) => {
      const normalized = (() => {
        if (activeYarnRules.allowDuplicateYarns) return next
        const seen = new Set()
        return next.filter((id) => {
          if (seen.has(id)) return false
          seen.add(id)
          return true
        })
      })()
      const trimmed = normalized.slice(0, maxYarnSelections)

      form.setValue("selectedYarnIds", trimmed, {
        shouldValidate: true,
        shouldDirty: true,
      })
      if (trimmed.length < normalized.length) {
        setPaletteNotice(`This piece allows up to ${maxYarnSelections} colors.`)
      }
    },
    [activeYarnRules.allowDuplicateYarns, form, maxYarnSelections]
  )

  const onSubmit = useCallback(
    async (values) => {
      const payload = {
        ...values,
        message: `${values.message}`.trim(),
        itemType: resolveItemType(values.category, values.guideProduct, values.customItemText),
        requested_product_slug: requestedPiece || "",
      }

      try {
        const response = await fetch("/api/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || !data?.ok) {
          throw new Error(data?.error || "Could not submit request")
        }

        toast.success("Request received. We will follow up with a quote and next steps.")
        const requestNumber = String(data?.requestNumber || "")
        const params = new URLSearchParams({
          requestNumber,
          itemType: String(payload.itemType || ""),
          category: String(payload.category || ""),
          size: String(payload.size || ""),
        })
        form.reset({
          category: "",
          itemType: "",
          guideProduct: "",
          customItemText: "",
          size: "",
          quantity: 1,
          selectedYarnIds: [],
          colors: "",
          name: "",
          email: "",
          phone: "",
          message: "",
          shippingAddressLine1: "",
          shippingAddressLine2: "",
          shippingCity: "",
          shippingState: "",
          shippingPostalCode: "",
          shippingCountry: "United States",
          requested_product_slug: "",
          cookieConsent: "",
        })
        setStep(1)
        setShowAllGuides(false)
        router.push(`/custom/thank-you?${params.toString()}`)
      } catch (error) {
        console.error(error)
        toast.error(error instanceof Error ? error.message : "Could not submit request. Please try again.")
      }
    },
    [form, requestedPiece, router]
  )

  const guideImage = useMemo(() => {
    if (!guideProduct) return ""

    const selected = relatedGuides.find((item) => item.title === guideProduct)
    if (selected?.image) return selected.image

    const starterFallback = (fallbackCards || []).find(
      (card) => String(card.label || "").trim() === String(guideProduct || "").trim()
    )
    return starterFallback?.image || ""
  }, [guideProduct, relatedGuides, fallbackCards])

  const minNotMet = selectedYarnCount < minYarnSelections
  const atMaxLimit = selectedYarnCount >= maxYarnSelections
  const missingRequiredYarns = selectedYarnCount < minYarnSelections

  const getYarnSummaryHelper = () => {
    if (missingRequiredYarns) return `Minimum ${minYarnSelections} colors needed.`
    if (canAddMoreYarns) return `You can add ${remainingYarnSelections} more color${remainingYarnSelections === 1 ? "" : "s"}.`
    if (atMaxLimit) return "Maximum colors reached."
    return `${paletteStatusLabel}.`
  }

  const removeYarn = useCallback(
    (yarnId) => {
      const next = selectedYarnIds.filter((id) => id !== yarnId)
      form.setValue("selectedYarnIds", next, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    [form, selectedYarnIds]
  )

  const step2Ready = Boolean(
    size &&
      quantity > 0 &&
      !missingRequiredYarns &&
      selectedYarnCount <= maxYarnSelections &&
      selectedYarnCount >= minYarnSelections &&
      (!selectedYarnIds || selectedYarnIds.length > 0)
  )

  const canSubmit = useMemo(() => {
    const hasContact = Boolean(name?.trim()) && (Boolean(email?.trim()) || Boolean(phone?.trim()))
    const hasShipping =
      Boolean(shippingAddressLine1?.trim()) &&
      Boolean(shippingCity?.trim()) &&
      Boolean(shippingState?.trim()) &&
      Boolean(shippingPostalCode?.trim()) &&
      Boolean(shippingCountry?.trim())

    return (
      Boolean(category) &&
      Boolean(itemType) &&
      Boolean(size) &&
      selectedYarnCount >= minYarnSelections &&
      selectedYarnCount <= maxYarnSelections &&
      Number(quantity) >= 1 &&
      hasContact &&
      hasShipping
    )
  }, [
    category,
    itemType,
    size,
    selectedYarnIds,
    quantity,
    colors,
    name,
    email,
    phone,
    shippingAddressLine1,
    shippingCity,
    shippingState,
    shippingPostalCode,
    shippingCountry,
    selectedYarnCount,
    minYarnSelections,
    maxYarnSelections,
  ])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.78fr)]">
        <div className="grid gap-6">
          <Card className="paper-panel rounded-[1.8rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="font-display text-3xl leading-none text-[color:var(--foreground)]">
                Craft your custom request
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-7 text-foreground/66">
                The flow is compact and guided: choose a piece, select one yarn and size, add
                details, then share shipping so we can confirm details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6 sm:px-7">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {STEP_LABELS.map((text, index) => {
                  const active = index + 1 === step
                  return (
                    <div
                      key={text}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase ${
                        active
                          ? "border-[#be8f82] bg-[#be8f82] text-white"
                          : "border-[color:var(--line-soft)] bg-[color:var(--surface-1)] text-foreground/78"
                      }`}
                    >
                      {text}
                    </div>
                  )
                })}
              </div>

              {step === 1 ? (
                <section className="space-y-4">
                  <div>
                    <p className="font-medium text-[color:var(--foreground)]">What would you like made?</p>
                    <p className="mt-1 text-sm text-foreground/68">
                      Start with the closest category. You can choose a specific inspiration piece after.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CATEGORY_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => {
                          form.setValue("category", option.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                          form.setValue("guideProduct", "", { shouldValidate: false, shouldDirty: true })
                          if (option.value !== "something-else") {
                            form.setValue("customItemText", "", { shouldValidate: false, shouldDirty: true })
                          }
                          form.setValue("size", "", { shouldValidate: false, shouldDirty: true })
                          form.setValue("colors", "", { shouldValidate: false, shouldDirty: true })
                          setShowAllGuides(false)
                        }}
                        className={`group relative min-h-[12rem] overflow-hidden rounded-[1.3rem] border px-4 pb-4 pt-3 text-left transition ${
                          category === option.value
                            ? "border-[#be8f82] bg-[#fff6ef] shadow-[0_18px_44px_rgba(97,66,48,0.14)]"
                            : "border-[color:var(--line-soft)] bg-[color:var(--surface-2)] hover:border-[#d3b399]"
                        }`}
                        aria-pressed={category === option.value}
                      >
                        <div className="mb-3 h-28 rounded-[1rem] overflow-hidden bg-[#f6e6d7]">
                          {option.image ? (
                            <Image
                              src={option.image}
                              alt={option.label}
                              width={460}
                              height={220}
                              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                              decoding="async"
                              loading="lazy"
                            />
                          ) : (
                            <div className="grid h-full place-items-center bg-gradient-to-br from-[#f8eee3] to-[#f4e0ce] text-sm text-[#7b5f54]">
                              {option.label}
                            </div>
                          )}
                        </div>
                        <p className="text-lg font-semibold text-[color:var(--foreground)]">{option.label}</p>
                        <p className="mt-1 text-sm text-foreground/76">{option.description}</p>
                        <p className="mt-2 text-xs text-foreground/60">{option.helper}</p>
                        <p className="mt-2 text-xs font-medium text-[color:var(--foreground)]">{option.lead}</p>
                        {category === option.value ? (
                          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-[#7d6358]">
                            Selected
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-[color:var(--foreground)]">Pick a starting point</p>
                    <p className="text-sm text-foreground/68">
                      Optional specific guide pieces that keep your request focused.
                    </p>

                    {category && category !== "something-else" ? (
                      hasStarterCards ? (
                        <>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {shownPieces.map((guide) => {
                              const isSelected = guideProduct === guide.title
                              const minColors = guide.minColors || 1
                              const maxColors = guide.maxColors || null
                              const colorText = guide.noteText
                                ? guide.noteText
                                : maxColors
                                  ? `${minColors} to ${maxColors} colors`
                                  : guide.source === "starter"
                                    ? "Start from category + add details"
                                    : "Size and finish details needed"
                              const descriptionText = guide.helperText || guide.leadText || ""
                              return (
                                <button
                                  type="button"
                                  key={guide.key}
                                  onClick={() => {
                                    form.setValue("guideProduct", guide.title, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    })
                                    if (guide.sizeOptions?.length) {
                                      form.setValue("size", "", {
                                        shouldValidate: false,
                                        shouldDirty: true,
                                      })
                                    }
                                    if (guide.maxColors) {
                                      form.setValue(
                                        "colors",
                                        `Up to ${guide.maxColors} colors (guide note).`,
                                        { shouldValidate: false, shouldDirty: true }
                                      )
                                    } else if (guide.source === "starter") {
                                      form.setValue("colors", "", { shouldValidate: false, shouldDirty: true })
                                    } else if (guide.noteText) {
                                      form.setValue("colors", guide.noteText, {
                                        shouldValidate: false,
                                        shouldDirty: true,
                                      })
                                    }
                                  }}
                                  className={`group grid grid-cols-[72px_1fr] items-start gap-3 rounded-[1rem] border p-2 text-left transition ${
                                    isSelected
                                      ? "border-[#be8f82] bg-[#fff6ef]"
                                      : "border-[color:var(--line-soft)] bg-[color:var(--surface-2)] hover:bg-[color:var(--surface-4)]"
                                  }`}
                                >
                                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#f4e4d1]">
                                    {guide.image ? (
                                      <Image
                                        src={guide.image}
                                        alt={guide.title}
                                        fill
                                        sizes="72px"
                                        className="object-cover"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    ) : (
                                      <span className="grid h-full place-items-center text-[10px] text-[#7b6358]">
                                        {guide.source === "starter" ? "idea" : "guide"}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                                      {guide.title}
                                    </p>
                                    {descriptionText ? (
                                      <p className="mt-0.5 text-xs text-foreground/62">{descriptionText}</p>
                                    ) : null}
                                    <p className="mt-1 text-xs text-foreground/64">{colorText}</p>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                          {starterIsGuideDriven && canShowMoreGuides ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowAllGuides((value) => !value)}
                            >
                              {showAllGuides ? "Show fewer ideas" : "Show more ideas"}
                            </Button>
                          ) : null}
                        </>
                      ) : (
                        <p className="rounded-[1rem] border border-dashed border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-4 py-3 text-sm text-foreground/66">
                          Start from the category and add your own details in the next step.
                        </p>
                      )
                    ) : null}

                    {category === "something-else" ? (
                      <p className="rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-4 py-3 text-sm text-foreground/66">
                        Tell us your idea in the details step. A guide is optional and only needed if you
                        want us to match an existing shape.
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={continueStep}
                    disabled={!category}
                  >
                    Continue to details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="space-y-5">
                  <div>
                    <p className="font-medium text-[color:var(--foreground)]">Add details</p>
                    <p className="mt-1 text-sm text-foreground/68">
                      Pick size, quantity, yarn, and your color or style preferences.
                    </p>
                  </div>

                  {category === "something-else" ? (
                    <FormField
                      control={form.control}
                      name="customItemText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us your idea</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Example: I want a soft blanket-style tote with chunky granny texture and warm sage + blush."
                              className="rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="guideProduct"
                      render={() => (
                        <FormItem>
                          <FormLabel>Starting point</FormLabel>
                          <FormDescription>
                            {guideProduct ? guideProduct : "No specific guide selected. Add your sizing and finish notes below."}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Choose size</FormLabel>
                          <FormControl>
                            <div className="grid gap-2">
                              {guideSizeOptions.map((option) => {
                                const isActive = field.value === option.value
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={`rounded-[0.9rem] border px-3 py-2 text-left transition ${
                                      isActive
                                        ? "border-[#be8f82] bg-[#fff6ef]"
                                        : "border-[color:var(--line-soft)] bg-[color:var(--surface-2)] hover:bg-[color:var(--surface-4)]"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                )
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={20}
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                              onChange={(event) => field.onChange(event.target.value)}
                            />
                          </FormControl>
                          <FormDescription>Typical small run, plus one color focus.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="selectedYarnIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yarn palette</FormLabel>
                        <FormDescription className="text-xs">
                          {selectedYarnRuleSummary} {remainingSlotsText || ""}
                        </FormDescription>
                        <p className={`mt-1 text-xs ${minNotMet || atMaxLimit ? "text-[#9a5146]" : "text-foreground/60"}`}>
                          {getYarnSummaryHelper()}
                          {paletteNotice ? ` ${paletteNotice}` : ""}
                        </p>
                        <FormControl>
                          <ColorPicker
                            value={field.value || []}
                            onChange={handleYarnChange}
                            max={maxYarnSelections}
                            allowEmpty={!minNotMet}
                            allowDuplicateYarns={activeYarnRules.allowDuplicateYarns}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Color preferences</FormLabel>
                                <FormDescription className="text-xs">
                                  Add finishing notes after selecting a yarn palette, like texture and
                                  wash preferences.
                                </FormDescription>
                                <FormControl>
                                  <Input
                              placeholder="Example: dusty rose with warm cream and muted sage"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Finish details, stitch openness, or fit hints"
                              {...field}
                              className="rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={goBackStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="button" onClick={continueStep} disabled={!step2Ready}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section className="space-y-5">
                  <div>
                    <p className="font-medium text-[color:var(--foreground)]">Contact and delivery</p>
                    <p className="mt-1 text-sm text-foreground/68">
                      We'll send a follow-up quote and timeline after your details are reviewed.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 555-5555"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="shippingAddressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Maple Street"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apt, suite, etc.</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Unit, building, or floor (optional)"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="shippingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Atlanta"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="GA"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingPostalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="30301"
                              {...field}
                              className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shippingCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                            className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-xs text-foreground/68">
                    Address details are for follow-up planning so we can send timing and quote details.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={goBackStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !canSubmit}>
                      {isSubmitting ? "Submitting..." : "Send request"}
                    </Button>
                  </div>
                </section>
              ) : null}

            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-5 lg:sticky lg:top-16 lg:self-start">
          <Card className="paper-panel rounded-[1.8rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="font-display text-2xl leading-none text-[color:var(--foreground)]">
                Request summary
              </CardTitle>
              <CardDescription className="text-sm leading-7 text-foreground/66">
                Update summary appears as you pick each part.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 pb-6 sm:px-7">
              <div className="grid gap-2 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/54">Category</p>
                <p className="text-sm text-[color:var(--foreground)]">{toLabelFromCategory(category)}</p>
              </div>
              <div className="grid gap-2 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/54">Starting point</p>
                <p className="text-sm text-[color:var(--foreground)]">
                  {selectedGuideLabelForForm(guideProduct) || "Not selected yet"}
                </p>
                {category === "something-else" && customItemText ? (
                  <p className="text-xs text-foreground/70">{customItemText}</p>
                ) : null}
              </div>
              <div className="grid gap-2 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/54">Size</p>
                <p className="text-sm text-[color:var(--foreground)]">{sizeLabelFromValue(size)}</p>
              </div>
              <div className="grid gap-2 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/54">Quantity</p>
                <p className="text-sm text-[color:var(--foreground)]">{quantity}</p>
              </div>
              <div className="grid gap-2 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/54">Yarn</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Palette className="mt-0.5 h-4 w-4 text-[#7f6a60]" />
                    <span className="text-[color:var(--foreground)]">
                      {selectedYarnCount > 0
                        ? `${selectedYarnCount} / ${maxYarnSelections} colors selected`
                        : "Not selected yet"}
                    </span>
                  </div>
                  {selectedYarnCount > 0 ? (
                    <div className="space-y-2">
                      {selectedYarns.map((yarn) => (
                        <div
                          key={yarn.id}
                          className="flex items-center justify-between gap-2 rounded-[0.8rem] border border-[#f0d7c4] bg-[#fffaf4] px-2.5 py-2 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[color:var(--foreground)]">
                              {yarn.code} • {yarn.name}
                            </p>
                            <p className="truncate text-[11px] text-foreground/68">
                              {yarn.line || "Unknown line"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeYarn(yarn.id)}
                            className="shrink-0 rounded-full border border-[#e1c9b4] px-2 py-1 text-[11px] text-[#7b6055] transition hover:bg-[#f9eee5]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              {guideImage ? (
                <div className="overflow-hidden rounded-[1rem] border border-[color:var(--line-soft)] bg-[#f4e8da]">
                  <Image
                    src={guideImage}
                    alt={guideProduct || "Selected style"}
                    width={560}
                    height={280}
                    className="h-36 w-full object-cover"
                  />
                </div>
              ) : null}

              <Separator />

              <div className="grid gap-3">
                <div className="flex items-start gap-2">
                  <ShoppingBag className="mt-1 h-4 w-4 text-[#7f6a60]" />
                  <p className="text-sm text-foreground/64">
                    Color selection is saved as structured yarn identity, not a vague description.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 text-[#7f6a60]" />
                  <p className="text-sm text-foreground/64">
                    Shipping is captured only for quote follow-up.
                  </p>
                </div>
                  <div className="flex items-start gap-2">
                  <Clock3 className="mt-1 h-4 w-4 text-[#7f6a60]" />
                  <p className="text-sm text-foreground/64">
                    Typical projects are reviewed within 1â€“2 business days.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => goToStep(1)}
              >
                Reset to start
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </Form>
  )
}
