import { PRODUCTS } from "./products.js"

export const siteConfig = {
  name: "Kraftana Studio",
  wordmark: "Kraftana",
  title: "Kraftana Studio | Handmade Crochet, Custom Orders, and Craft Classes",
  description:
    "Kraftana Studio creates handmade crochet wearables, custom orders, craft kits, patterns, and classes by Kevonne Workman in Cleveland, Ohio.",
  keywords: [
    "Kraftana Studio",
    "Kraftana",
    "handmade crochet",
    "custom crochet orders",
    "crochet clothing",
    "crochet gifts",
    "crochet patterns",
    "craft kits",
    "crochet classes",
    "Cleveland crochet",
    "Ohio handmade",
  ],
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://kraftanastudio.com",
  ogImage: "/og-cover.jpg",
  email: "hello@kraftanastudio.com",
  location: "Cleveland, Ohio",
  socials: {
    instagram: "",
    facebook: "",
  },
}

export const staticSiteSettings = {
  announcementBannerEnabled: false,
  announcementBannerText: "",
  contactEmail: siteConfig.email,
  instagramUrl: "",
  facebookUrl: "",
  homepageFeaturedProductSlugs: [
    "blush-sage-square-top",
    "blue-granny-square-cardigan",
    "striped-midi-skirt",
  ],
  customOrderAvailabilityText:
    "Custom order requests are open. Share your idea, fit notes, and timeline for a quote.",
  shopIntroText:
    "Browse studio favorites, explore details, and request the piece that feels closest to yours.",
  footerNote: "Handmade in small batches.",
}

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom Orders" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Contact" },
]

export const galleryItems = [
  {
    slug: "autumn-cardigan",
    title: "Autumn Cardigan",
    description:
      "A warmer palette and classic granny-square structure with a polished handmade finish.",
    image: "/images/autumn-granny-square-cardigan.jpeg",
    alt: "Autumn-toned handmade crochet cardigan photographed in the Kraftana studio",
    tag: "Wearable",
  },
  {
    slug: "blush-sage-top",
    title: "Blush & Sage Top",
    description:
      "Soft color contrast and a lighter silhouette for an easy studio favorite.",
    image: "/images/blush-sage-granny-square-top.jpeg",
    alt: "Blush and sage handmade crochet top shown in soft studio light",
    tag: "Custom crochet clothing",
  },
  {
    slug: "sunset-halter",
    title: "Sunset Halter",
    description:
      "A brighter palette for visitors who want color, shape, and personality in one piece.",
    image: "/images/sunset-chevron-halter-top.jpeg",
    alt: "Sunset chevron handmade crochet halter top with warm striped color",
    tag: "Made to order",
  },
  {
    slug: "striped-skirt",
    title: "Striped Midi Skirt",
    description:
      "A longer handmade skirt that shows off the rhythm and texture of crochet beautifully.",
    image: "/images/striped-midi-skirt.jpeg",
    alt: "Striped handmade crochet midi skirt with blue, cream, and berry tones",
    tag: "Studio collection",
  },
  {
    slug: "blue-cardigan",
    title: "Blue Granny Square Cardigan",
    description:
      "A cool-toned cardigan with room for fit adjustments and custom sizing.",
    image: "/images/blue-granny-square-cardigan.jpeg",
    alt: "Blue granny square handmade crochet cardigan for a cozy layered look",
    tag: "Size-inclusive crochet",
  },
  {
    slug: "cobalt-scarf",
    title: "Cobalt Fringe Scarf",
    description:
      "A graphic accessory with open stitchwork, movement, and a more dramatic finish.",
    image: "/images/cobalt-fringe-scarf.jpeg",
    alt: "Handmade crochet scarf with cobalt fringe and open stitch texture",
    tag: "Crochet gifts",
  },
]

export const faqItems = [
  {
    question: "How do custom orders work?",
    answer:
      "You send your idea, colors, size notes, and budget. Kevonne reviews the details, follows up if anything needs clarifying, and then sends a quote with a timeline before any work begins.",
  },
  {
    question: "Do you offer custom sizing?",
    answer:
      "Yes. Kraftana was created from a real desire for stylish handmade pieces that fit well, so custom sizing is a core part of the studio.",
  },
  {
    question: "How long does a handmade piece take?",
    answer:
      "Lead time depends on the piece, the yarn, and the current studio queue. Smaller accessories may move faster, while garments and more detailed custom work take longer. Every quote includes a timeline estimate.",
  },
  {
    question: "Can I request different colors?",
    answer:
      "Absolutely. Many pieces can be remade in a different palette, and custom work is the best place to talk through color direction, mood, and contrast.",
  },
  {
    question: "Do you make gifts?",
    answer:
      "Yes. Gifts, keepsakes, and personal pieces are welcome. If it is for a special date, mention that in your request so the timeline can be reviewed honestly.",
  },
  {
    question: "How should I care for handmade crochet?",
    answer:
      "Most pieces should be hand washed or washed gently in cool water and laid flat to dry. Specific care notes are shared with each finished piece.",
  },
]

export const testimonials = [
  {
    name: "Early Kraftana visitor",
    location: "Cleveland",
    quote:
      "The site feels warm, thoughtful, and personal. I can immediately tell who the maker is and what kind of custom work she wants to create.",
    productContext: "Site feedback",
    rating: 5,
    isFeatured: true,
    isApproved: true,
    sortOrder: 1,
  },
  {
    name: "Studio supporter",
    location: "Ohio",
    quote:
      "The handmade pieces feel stylish instead of generic, and the custom order process is easy to understand.",
    productContext: "Custom request flow",
    rating: 5,
    isFeatured: true,
    isApproved: true,
    sortOrder: 2,
  },
]

export const policySections = [
  {
    title: "Custom Quotes",
    body:
      "Every custom order begins with a request, not instant checkout. Quotes are based on size, complexity, materials, and timeline. Work starts only after the details are approved.",
  },
  {
    title: "Turnaround Times",
    body:
      "Lead times vary depending on the studio queue and the type of piece requested. Kraftana values clear expectations over rushed promises, so you will receive an honest timeline before work begins.",
  },
  {
    title: "Shipping",
    body:
      "Shipping timing depends on whether a piece is ready to ship or made to order. Once an order is complete, shipping details and tracking are shared directly.",
  },
  {
    title: "Returns and Cancellations",
    body:
      "Because many pieces are handmade to order, returns may not be available on customized work. If something feels unclear, ask before approving the project so expectations stay simple and fair.",
  },
  {
    title: "Sizing and Fit",
    body:
      "Sizing notes matter, especially for custom crochet clothing. Please share measurements and fit preferences as clearly as possible so Kevonne can build around real comfort and shape.",
  },
  {
    title: "Care",
    body:
      "Handmade crochet deserves gentle care. Most pieces should be washed cool, handled softly, and laid flat to dry. Specific instructions are included when a piece is finished.",
  },
]

export const homeFeedbackPrompts = [
  "What kind of crochet piece would you love to see next?",
  "Is there a color palette, garment, or gift idea you wish Kraftana offered?",
]

export function getStaticRoutes() {
  return [
    "",
    "/shop",
    "/custom",
    "/gallery",
    "/about",
    "/faq",
    "/policies",
    "/contact",
    ...PRODUCTS.map((product) => `/shop/${product.slug}`),
  ]
}
