import { logDatabaseWarning, getOptionalDb, getServerEnv } from "@/lib/db/d1"
import {
  fetchGalleryItemsFromDb,
} from "@/lib/db/gallery"
import {
  fetchProductsFromDb,
  fetchProductBySlugFromDb,
} from "@/lib/db/products"
import {
  fetchProductGuideBySlugFromDb,
  fetchProductGuidesFromDb,
  fetchProductGuideSizesFromDb,
} from "@/lib/db/productGuides"
import { fetchSiteSettingsFromDb } from "@/lib/db/settings"
import { fetchTestimonialsFromDb } from "@/lib/db/testimonials"
import {
  getStaticProductGuideBySlug,
  getStaticProductGuides,
  getStaticProductGuideSizes,
} from "@/lib/productGuides"
import { PRODUCTS, getProductBySlug as getStaticProductBySlug } from "@/lib/products"
import {
  faqItems,
  galleryItems,
  policySections,
  staticSiteSettings,
  testimonials,
} from "@/lib/site"

const isDev = process.env.NODE_ENV !== "production"

function logFallback(scope, reason) {
  if (isDev) {
    console.warn(`[kraftana:fallback:${scope}] ${reason}`)
  }
}

async function withPublicFallback(scope, databaseReader, fallbackFactory) {
  /**
   * Public pages must not fail while D1 is being wired up locally or on Cloudflare.
   * We always try D1 first, but if bindings are missing, migrations are not applied,
   * the database is empty, or a query fails, we deliberately fall back to the static
   * content layer so the public site keeps working during setup.
   *
   * Once D1 is fully proven in production, this fallback layer can be removed in a
   * later phase without changing the public UI contracts.
   */
  const db = getOptionalDb(getServerEnv())

  if (!db) {
    logFallback(scope, "D1 binding missing, using static fallback")
    return fallbackFactory()
  }

  try {
    const result = await databaseReader(db)
    const hasRows =
      Array.isArray(result) ? result.length > 0 : result && Object.keys(result).length > 0

    if (!hasRows) {
      logFallback(scope, "D1 returned no usable rows, using static fallback")
      return fallbackFactory()
    }

    return result
  } catch (error) {
    logDatabaseWarning(scope, error)
    logFallback(scope, "D1 query failed, using static fallback")
    return fallbackFactory()
  }
}

export async function getPublicProducts() {
  return withPublicFallback(
    "products",
    (db) => fetchProductsFromDb(db, { status: "active" }),
    () => PRODUCTS
  )
}

export const getProducts = getPublicProducts

export async function getPublicProductBySlug(slug) {
  const db = getOptionalDb(getServerEnv())

  if (!db) {
    logFallback("product-by-slug", "D1 binding missing, using static fallback")
    return getStaticProductBySlug(slug) ?? null
  }

  try {
    const product = await fetchProductBySlugFromDb(db, slug)
    return product ?? getStaticProductBySlug(slug) ?? null
  } catch (error) {
    logDatabaseWarning("product-by-slug", error)
    logFallback("product-by-slug", "D1 query failed, using static fallback")
    return getStaticProductBySlug(slug) ?? null
  }
}

export const getProductBySlug = getPublicProductBySlug

export async function getPublicGalleryItems() {
  return withPublicFallback(
    "gallery",
    (db) => fetchGalleryItemsFromDb(db, { status: "active" }),
    () => galleryItems
  )
}

export const getGalleryItems = getPublicGalleryItems

export async function getPublicTestimonials() {
  return withPublicFallback(
    "testimonials",
    (db) => fetchTestimonialsFromDb(db, { approvedOnly: true }),
    () => testimonials
  )
}

export const getTestimonials = getPublicTestimonials

export async function getPublicSiteSettings() {
  return withPublicFallback(
    "site-settings",
    async (db) => {
      const settings = await fetchSiteSettingsFromDb(db)
      return { ...staticSiteSettings, ...settings }
    },
    () => ({ ...staticSiteSettings })
  )
}

export const getSiteSettings = getPublicSiteSettings

export async function getPublicProductGuides() {
  return withPublicFallback(
    "product-guides",
    (db) => fetchProductGuidesFromDb(db, { activeOnly: true }),
    () => getStaticProductGuides()
  )
}

export async function getPublicProductGuideBySlug(slug) {
  const db = getOptionalDb(getServerEnv())

  if (!db) {
    logFallback("product-guide-by-slug", "D1 binding missing, using static fallback")
    return getStaticProductGuideBySlug(slug) ?? null
  }

  try {
    const guide = await fetchProductGuideBySlugFromDb(db, slug)
    return guide ?? getStaticProductGuideBySlug(slug) ?? null
  } catch (error) {
    logDatabaseWarning("product-guide-by-slug", error)
    logFallback("product-guide-by-slug", "D1 query failed, using static fallback")
    return getStaticProductGuideBySlug(slug) ?? null
  }
}

export async function getProductGuideSizes(slug) {
  const db = getOptionalDb(getServerEnv())

  if (!db) {
    logFallback("product-guide-sizes", "D1 binding missing, using static fallback")
    return getStaticProductGuideSizes(slug)
  }

  try {
    const sizes = await fetchProductGuideSizesFromDb(db, slug)
    return sizes.length ? sizes : getStaticProductGuideSizes(slug)
  } catch (error) {
    logDatabaseWarning("product-guide-sizes", error)
    logFallback("product-guide-sizes", "D1 query failed, using static fallback")
    return getStaticProductGuideSizes(slug)
  }
}

export async function getPublicFaqContent() {
  return faqItems
}

export const getFaqItems = getPublicFaqContent

export async function getPublicPolicyContent() {
  return policySections
}

export const getPolicyContent = getPublicPolicyContent
