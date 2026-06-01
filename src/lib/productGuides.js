export const PRODUCT_GUIDE_TIMING_NOTE =
  "Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation."

export const PRODUCT_GUIDE_CUSTOMER_TIMING_COPY =
  "Custom crochet pieces are made with care and planned around yarn availability. Please allow about 2 weeks for yarn to arrive, plus an additional 1 to 2 weeks for creation. Some pieces may take longer depending on size, color count, and complexity."

export const PRODUCT_GUIDE_SIZING_NOTE =
  "Sizing is used as a starting guide. For custom pieces, Kevonne may confirm measurements before beginning so the final piece fits as closely as possible."

export const PRODUCT_GUIDE_YARN_NOTE =
  "Yarn type may vary slightly based on color availability, but similar texture, weight, and quality will be matched whenever possible."

export const PRODUCT_GUIDES = [
  {
    slug: "cat-ear-beanie",
    title: "Cat Ear Beanie",
    category: "Beanies",
    maxColors: 2,
    yarn: ["Hobbii Amigo"],
    colorNotes: "Up to 2 colors.",
    sizeNotes: "Choose child or adult sizing by head measurement.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What colors would you like for your cat ear beanie?",
    isActive: true,
    sortOrder: 10,
    sizes: [
      { label: "Child Small", measurements: { head: "19 in" }, sortOrder: 10 },
      { label: "Child Medium", measurements: { head: "20 in" }, sortOrder: 20 },
      { label: "Child Large", measurements: { head: "21 in" }, sortOrder: 30 },
      { label: "Adult Small", measurements: { head: "22 in" }, sortOrder: 40 },
      { label: "Adult Medium", measurements: { head: "23 in" }, sortOrder: 50 },
      { label: "Adult Large", measurements: { head: "24 in" }, sortOrder: 60 },
      { label: "Adult Extra Large", measurements: { head: "25 in" }, sortOrder: 70 },
    ],
  },
  {
    slug: "scarf",
    title: "Scarf",
    category: "Accessories",
    maxColors: 3,
    yarn: ["Hobbii Baby Cotton Organic Mercerized"],
    colorNotes: "Up to 3 colors.",
    sizeNotes: "Choose toddler, child, or adult sizing.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What colors would you like for your scarf?",
    isActive: true,
    sortOrder: 20,
    sizes: [
      { label: "Toddler", measurements: {}, sortOrder: 10 },
      { label: "Child", measurements: {}, sortOrder: 20 },
      { label: "Adult", measurements: {}, sortOrder: 30 },
    ],
  },
  {
    slug: "granny-square-skirt",
    title: "Granny Square Skirt",
    category: "Skirts",
    maxColors: 4,
    yarn: ["Hobbii Rainbow Cotton 8/8"],
    colorNotes:
      "Long skirt, up to 4 colors plus main color. Short skirt, up to 3 colors plus main color.",
    sizeNotes: "Choose size by waist and preferred length.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "Would you like a long or short skirt, and what colors do you want?",
    isActive: true,
    sortOrder: 30,
    sizes: [
      {
        label: "XS",
        measurements: { waist: "22 to 23 in", longLength: "36 to 38 in", shortLength: "18 to 20 in" },
        sortOrder: 10,
      },
      {
        label: "S",
        measurements: { waist: "24 to 25 in", longLength: "37 to 39 in", shortLength: "19 to 21 in" },
        sortOrder: 20,
      },
      {
        label: "M",
        measurements: { waist: "26 to 28 in", longLength: "38 to 40 in", shortLength: "20 to 22 in" },
        sortOrder: 30,
      },
      {
        label: "L",
        measurements: { waist: "29 to 31 in", longLength: "39 to 41 in", shortLength: "21 to 23 in" },
        sortOrder: 40,
      },
      {
        label: "XL",
        measurements: { waist: "32 to 34 in", longLength: "40 to 42 in", shortLength: "22 to 24 in" },
        sortOrder: 50,
      },
      {
        label: "XXL",
        measurements: { waist: "35 to 38 in", longLength: "41 to 43 in", shortLength: "23 to 25 in" },
        sortOrder: 60,
      },
    ],
  },
  {
    slug: "high-neck-granny-halter",
    title: "High Neck Granny Halter",
    category: "Tops",
    maxColors: 5,
    yarn: ["Hobbii Twister Solid"],
    colorNotes: "Up to 5 colors.",
    sizeNotes: "Choose size by cup guide. Contact if a larger cup size is needed.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What colors would you like for your halter?",
    isActive: true,
    sortOrder: 40,
    sizes: [
      { label: "XS", measurements: { cup: "A" }, sortOrder: 10 },
      { label: "S", measurements: { cup: "B" }, sortOrder: 20 },
      { label: "M", measurements: { cup: "C" }, sortOrder: 30 },
      { label: "L", measurements: { cup: "D" }, sortOrder: 40 },
      { label: "XL", measurements: { cup: "E" }, sortOrder: 50 },
      {
        label: "Larger cup needed",
        measurements: { note: "Contact if a larger cup size is needed" },
        sortOrder: 60,
      },
    ],
  },
  {
    slug: "granny-square-crop-sweater-vest",
    title: "Granny Square Crop Sweater Vest",
    category: "Tops",
    maxColors: 4,
    yarn: ["Hobbii Twister Solid"],
    colorNotes: "Up to 4 colors.",
    sizeNotes: "Choose size by cup guide.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What colors would you like for your crop sweater vest?",
    isActive: true,
    sortOrder: 50,
    sizes: [
      { label: "S", measurements: { cup: "A" }, sortOrder: 10 },
      { label: "M", measurements: { cup: "B" }, sortOrder: 20 },
      { label: "L", measurements: { cup: "C" }, sortOrder: 30 },
      { label: "XL", measurements: { cup: "D plus" }, sortOrder: 40 },
    ],
  },
  {
    slug: "blanket",
    title: "Blanket",
    category: "Home",
    maxColors: null,
    yarn: [],
    colorNotes: "Color count depends on design.",
    sizeNotes: "Choose blanket size by dimensions.",
    timingNotes: "Blankets may take longer depending on size and color count.",
    customerPrompt: "What size blanket and colors would you like?",
    isActive: true,
    sortOrder: 60,
    sizes: [
      { label: "Lap", measurements: { dimensions: "36 x 49 in" }, sortOrder: 10 },
      { label: "Small Throw", measurements: { dimensions: "48 x 60 in" }, sortOrder: 20 },
      { label: "Standard Throw", measurements: { dimensions: "52 x 60 in" }, sortOrder: 30 },
      { label: "Large Throw", measurements: { dimensions: "60 x 72 in" }, sortOrder: 40 },
      { label: "Single or Twin", measurements: { dimensions: "66 x 96 in" }, sortOrder: 50 },
      { label: "Double", measurements: { dimensions: "80 x 90 in" }, sortOrder: 60 },
      { label: "Queen", measurements: { dimensions: "90 x 100 in" }, sortOrder: 70 },
      { label: "King", measurements: { dimensions: "108 x 100 in" }, sortOrder: 80 },
    ],
  },
  {
    slug: "granny-twister-cardigan",
    title: "Granny Twister Cardigan",
    category: "Cardigans",
    maxColors: null,
    yarn: ["Hobbii Sunbird, main color", "Hobbii Twister Solid, border"],
    colorNotes: "Main color plus border color.",
    sizeNotes: "One size.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What main color and border color would you like?",
    isActive: true,
    sortOrder: 70,
    sizes: [{ label: "One Size", measurements: {}, sortOrder: 10 }],
  },
  {
    slug: "granny-hexagon-cardigan",
    title: "Granny Hexagon Cardigan",
    category: "Cardigans",
    maxColors: 4,
    yarn: ["Hobbii Twister Solid", "Hobbii Horizon, main color", "Hobbii Kind Feather, border"],
    colorNotes: "Up to 4 colors. Buttons optional. Hood optional.",
    sizeNotes:
      "Choose size by torso and arm circumference. Arm length values after size S need confirmation.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What colors would you like, and do you want buttons or a hood?",
    isActive: true,
    sortOrder: 80,
    sizes: [
      {
        label: "S",
        measurements: { armLength: "20 in", torsoCircumference: "20 in", armCircumference: "8 in" },
        sortOrder: 10,
      },
      { label: "M", measurements: { torsoCircumference: "22 in", armCircumference: "9 in" }, sortOrder: 20 },
      { label: "L", measurements: { torsoCircumference: "24 in", armCircumference: "10 in" }, sortOrder: 30 },
      { label: "XL", measurements: { torsoCircumference: "26 in", armCircumference: "11 in" }, sortOrder: 40 },
      { label: "XXL", measurements: { torsoCircumference: "28 in", armCircumference: "12 in" }, sortOrder: 50 },
      { label: "XXXL", measurements: { torsoCircumference: "30 in", armCircumference: "13 in" }, sortOrder: 60 },
    ],
  },
  {
    slug: "granny-stitch-shorts",
    title: "Granny Stitch Shorts",
    category: "Shorts",
    maxColors: 4,
    yarn: ["Hobbii Twister Solid"],
    colorNotes: "Up to 4 colors.",
    sizeNotes: "Choose size by waist, hip, and length guide.",
    timingNotes: PRODUCT_GUIDE_TIMING_NOTE,
    customerPrompt: "What colors would you like for your shorts?",
    isActive: true,
    sortOrder: 90,
    sizes: [
      { label: "XS", measurements: { waistCircumference: "25 in", hipCircumference: "32 in", length: "13 in" }, sortOrder: 10 },
      { label: "S", measurements: { waistCircumference: "27 in", hipCircumference: "34 in", length: "14 in" }, sortOrder: 20 },
      { label: "M", measurements: { waistCircumference: "28 in", hipCircumference: "37 in", length: "14 in" }, sortOrder: 30 },
      { label: "L", measurements: { waistCircumference: "30 in", hipCircumference: "39 in", length: "14 in" }, sortOrder: 40 },
      { label: "XL", measurements: { waistCircumference: "32 in", hipCircumference: "42 in", length: "16 in" }, sortOrder: 50 },
      { label: "XXL", measurements: { waistCircumference: "34 in", hipCircumference: "44 in", length: "16 in" }, sortOrder: 60 },
    ],
  },
]

export function getStaticProductGuides() {
  return PRODUCT_GUIDES.filter((guide) => guide.isActive).sort((left, right) => left.sortOrder - right.sortOrder)
}

export function getStaticProductGuideBySlug(slug) {
  return PRODUCT_GUIDES.find((guide) => guide.slug === slug) ?? null
}

export function getStaticProductGuideSizes(slug) {
  return getStaticProductGuideBySlug(slug)?.sizes ?? []
}

export function formatGuideMeasurements(measurements = {}) {
  return Object.entries(measurements)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) => character.toUpperCase())
      return `${label}: ${value}`
    })
    .join(", ")
}

export function formatGuideSizeSummary(size) {
  if (!size) return ""
  const summary = formatGuideMeasurements(size.measurements)
  return summary ? `${size.label} (${summary})` : size.label
}
