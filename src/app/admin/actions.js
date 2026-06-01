"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import {
  clearAdminSession,
  createAdminSession,
  normalizeAdminNextPath,
  requireAdminSession,
  validateAdminCredentials,
} from "@/lib/adminAuth"
import { createAdminAuditLog } from "@/lib/db/adminAudit"
import { updateContactMessageStatusInDb } from "@/lib/db/contactMessages"
import { updateCustomRequestInDb } from "@/lib/db/customRequests"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import {
  deleteMediaAssetRecordInDb,
  updateMediaAssetAltTextInDb,
} from "@/lib/db/media"
import { updateFeedbackStatusInDb } from "@/lib/db/feedback"
import { saveGalleryItemToDb } from "@/lib/db/gallery"
import {
  fetchProductByIdFromDb,
  saveProductToDb,
  toggleProductFeatured,
  updateProductStatus,
} from "@/lib/db/products"
import { saveSiteSettingsToDb } from "@/lib/db/settings"
import { saveTestimonialToDb } from "@/lib/db/testimonials"

function requireDb() {
  return getRequiredDb(getServerEnv())
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseCheckbox(formData, key) {
  return formData.get(key) === "on"
}

function parseProductImages(formData) {
  const jsonValue = String(formData.get("imagesJson") || "").trim()

  if (jsonValue) {
    try {
      const parsed = JSON.parse(jsonValue)
      if (Array.isArray(parsed)) {
        return parsed
          .map((image, index) => ({
            src: String(image.src || "").trim(),
            alt: String(image.alt || "Product image").trim(),
            isPrimary: Boolean(image.isPrimary) || index === 0,
            sortOrder: Number(image.sortOrder ?? index),
          }))
          .filter((image) => image.src)
      }
    } catch {
      return []
    }
  }

  const legacyValue = String(formData.get("imageLines") || "")
  return legacyValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [src = "", alt = "", primary = ""] = line.split("|").map((part) => part.trim())
      return {
        src,
        alt: alt || "Product image",
        isPrimary: primary.toLowerCase() === "primary" || index === 0,
        sortOrder: index,
      }
    })
    .filter((image) => image.src)
}

function parseSiteSettings(formData) {
  const featuredValues = formData
    .getAll("homepageFeaturedProductSlugs")
    .flatMap((value) =>
      String(value)
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    )

  return {
    announcementBannerEnabled: parseCheckbox(formData, "announcementBannerEnabled"),
    announcementBannerText: String(formData.get("announcementBannerText") || ""),
    contactEmail: String(formData.get("contactEmail") || ""),
    instagramUrl: String(formData.get("instagramUrl") || ""),
    facebookUrl: String(formData.get("facebookUrl") || ""),
    homepageFeaturedProductSlugs: [...new Set(featuredValues)],
    customOrderAvailabilityText: String(formData.get("customOrderAvailabilityText") || ""),
    shopIntroText: String(formData.get("shopIntroText") || ""),
    footerNote: String(formData.get("footerNote") || ""),
  }
}

function revalidateAdminCore() {
  revalidatePath("/")
  revalidatePath("/shop")
  revalidatePath("/gallery")
  revalidatePath("/custom")
  revalidatePath("/admin/start")
  revalidatePath("/admin/dashboard")
}

async function audit(entry, nextPath = "/admin/start") {
  const db = requireDb()
  const session = await requireAdminSession(nextPath)
  await createAdminAuditLog(db, {
    actorLabel: session.username,
    ...entry,
  })
}

async function saveProductPayload(db, formData) {
  const productId = String(formData.get("id") || "")
  const intent = String(formData.get("intent") || "save")
  const requestedStatus = String(formData.get("status") || "draft")
  const status =
    intent === "publish" ? "active" : intent === "archive" ? "archived" : requestedStatus

  return saveProductToDb(db, {
    id: productId ? Number(productId) : null,
    slug: slugify(formData.get("slug") || formData.get("title")),
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || "tops"),
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    priceCents: Math.round(Number(formData.get("price") || 0) * 100),
    currency: "USD",
    leadDays: Number(formData.get("leadDays") || 0),
    careNotes: String(formData.get("careNotes") || ""),
    fitNotes: String(formData.get("fitNotes") || ""),
    customizationNotes: String(formData.get("customizationNotes") || ""),
    availability: String(formData.get("availability") || ""),
    isFeatured: parseCheckbox(formData, "isFeatured"),
    isCustomizable: parseCheckbox(formData, "isCustomizable"),
    status,
    images: parseProductImages(formData),
  })
}

export async function loginAction(_prevState, formData) {
  const username = String(formData.get("username") || "")
  const password = String(formData.get("password") || "")
  const nextPath = normalizeAdminNextPath(formData.get("next"))

  try {
    const valid = await validateAdminCredentials(username, password)
    if (!valid) {
      return { error: "That username or password did not match. Please try again." }
    }

    await createAdminSession(username)
    redirect(nextPath)
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Admin login is not configured.",
    }
  }
}

export async function logoutAction() {
  await clearAdminSession()
  redirect("/admin/login")
}

export async function saveProductAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/products")
  const productId = String(formData.get("id") || "")

  const product = await saveProductPayload(db, formData)

  await audit(
    {
      action: productId ? "update" : "create",
      entityType: "product",
      entityId: product.id,
      summary: `${productId ? "Updated" : "Created"} product ${product.title}`,
    },
    "/admin/products"
  )

  revalidateAdminCore()
  revalidatePath(`/shop/${product.slug}`)
  revalidatePath("/admin/products")
  redirect(`/admin/products/${product.id}?${productId ? "saved=1" : "created=1"}`)
}

export async function saveProductWizardAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/wizard/product")
  const product = await saveProductPayload(db, formData)

  await audit(
    {
      action: "create",
      entityType: "product",
      entityId: product.id,
      summary: `Created product ${product.title} from simple wizard`,
    },
    "/admin/wizard/product"
  )

  revalidateAdminCore()
  revalidatePath(`/shop/${product.slug}`)
  revalidatePath("/admin/products")
  redirect(`/admin/wizard/product?created=1&productId=${product.id}`)
}

export async function archiveProductAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/products")
  const id = Number(formData.get("id"))
  await updateProductStatus(db, id, "archived")
  await audit(
    {
      action: "archive",
      entityType: "product",
      entityId: id,
      summary: `Archived product ${id}`,
    },
    "/admin/products"
  )
  revalidateAdminCore()
  revalidatePath("/admin/products")
}

export async function toggleFeaturedProductAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/products")
  const id = Number(formData.get("id"))
  const current = String(formData.get("current")) === "true"
  await toggleProductFeatured(db, id, !current)
  await audit(
    {
      action: "toggle_featured",
      entityType: "product",
      entityId: id,
      summary: `${!current ? "Featured" : "Unfeatured"} product ${id}`,
    },
    "/admin/products"
  )
  revalidateAdminCore()
  revalidatePath("/admin/products")
}

export async function saveGalleryItemAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/gallery")
  const id = String(formData.get("id") || "")
  const item = await saveGalleryItemToDb(db, {
    id: id ? Number(id) : null,
    title: String(formData.get("title") || ""),
    slug: slugify(formData.get("slug") || formData.get("title")),
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || ""),
    alt: String(formData.get("alt") || ""),
    tag: String(formData.get("tag") || ""),
    relatedProductSlug: String(formData.get("relatedProductSlug") || ""),
    isFeatured: parseCheckbox(formData, "isFeatured"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: String(formData.get("status") || "active"),
  })

  await audit(
    {
      action: id ? "update" : "create",
      entityType: "gallery_item",
      entityId: item.id,
      summary: `${id ? "Updated" : "Created"} gallery item ${item.title}`,
    },
    "/admin/gallery"
  )
  revalidateAdminCore()
  revalidatePath("/admin/gallery")
  revalidatePath("/admin/media")
}

export async function saveGalleryWizardAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/wizard/gallery")
  const item = await saveGalleryItemToDb(db, {
    id: null,
    title: String(formData.get("title") || ""),
    slug: slugify(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || ""),
    alt: String(formData.get("alt") || ""),
    tag: String(formData.get("tag") || ""),
    relatedProductSlug: String(formData.get("relatedProductSlug") || ""),
    isFeatured: parseCheckbox(formData, "isFeatured"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    status: String(formData.get("status") || "active"),
  })

  await audit(
    {
      action: "create",
      entityType: "gallery_item",
      entityId: item.id,
      summary: `Created gallery item ${item.title} from simple wizard`,
    },
    "/admin/wizard/gallery"
  )
  revalidateAdminCore()
  revalidatePath("/admin/gallery")
  redirect(`/admin/wizard/gallery?created=1&galleryId=${item.id}`)
}

export async function saveTestimonialAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/testimonials")
  const id = String(formData.get("id") || "")
  const testimonial = await saveTestimonialToDb(db, {
    id: id ? Number(id) : null,
    name: String(formData.get("name") || ""),
    location: String(formData.get("location") || ""),
    quote: String(formData.get("quote") || ""),
    productContext: String(formData.get("productContext") || ""),
    rating: Number(formData.get("rating") || 5),
    isFeatured: parseCheckbox(formData, "isFeatured"),
    isApproved: parseCheckbox(formData, "isApproved"),
    sortOrder: Number(formData.get("sortOrder") || 0),
  })

  await audit(
    {
      action: id ? "update" : "create",
      entityType: "testimonial",
      entityId: testimonial.id,
      summary: `${id ? "Updated" : "Created"} testimonial ${testimonial.name}`,
    },
    "/admin/testimonials"
  )
  revalidatePath("/")
  revalidatePath("/admin/testimonials")
}

export async function updateMediaAltTextAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/media")
  const id = Number(formData.get("id"))
  const altText = String(formData.get("altText") || "")

  await updateMediaAssetAltTextInDb(db, id, altText)
  await audit(
    {
      action: "update_media_alt",
      entityType: "media_asset",
      entityId: id,
      summary: `Updated alt text for upload ${id}`,
    },
    "/admin/media"
  )
  revalidatePath("/admin/media")
}

export async function deleteMediaAssetRecordAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/media")
  const id = Number(formData.get("id"))

  const result = await deleteMediaAssetRecordInDb(db, id)

  if (result.deleted) {
    await audit(
      {
        action: "delete_media_record",
        entityType: "media_asset",
        entityId: id,
        summary: `Removed unused upload ${id}`,
      },
      "/admin/media"
    )
  }

  revalidatePath("/admin/media")
}

export async function updateRequestAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/requests")
  const id = Number(formData.get("id"))
  const status = String(formData.get("status") || "")
  const adminNotes = String(formData.get("adminNotes") || "")
  await updateCustomRequestInDb(db, id, { status, adminNotes })
  await audit(
    {
      action: "update_request",
      entityType: "custom_request",
      entityId: id,
      summary: `Updated request ${id} to ${status}`,
    },
    "/admin/requests"
  )
  revalidatePath("/admin/start")
  revalidatePath("/admin/dashboard")
  revalidatePath("/admin/requests")
}

export async function quickRequestStatusAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/requests")
  const id = Number(formData.get("id"))
  const intent = String(formData.get("intent") || "reviewed")
  const currentNotes = String(formData.get("currentNotes") || "")

  let status = "reviewed"
  let adminNotes = currentNotes

  if (intent === "quote") {
    status = "quoted"
  } else if (intent === "archive") {
    status = "archived"
  } else if (intent === "needs_info") {
    status = "reviewed"
    adminNotes = currentNotes
      ? `${currentNotes}\n\nNeeds more information before quoting.`
      : "Needs more information before quoting."
  }

  await updateCustomRequestInDb(db, id, { status, adminNotes })
  await audit(
    {
      action: "quick_request_status",
      entityType: "custom_request",
      entityId: id,
      summary: `Updated request ${id} to ${status} from simple actions`,
    },
    "/admin/requests"
  )
  revalidatePath("/admin/start")
  revalidatePath("/admin/dashboard")
  revalidatePath("/admin/requests")
}

export async function updateMessageStatusAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/messages")
  const type = String(formData.get("type") || "contact")
  const id = Number(formData.get("id"))
  const status = String(formData.get("status") || "reviewed")

  if (type === "feedback") {
    await updateFeedbackStatusInDb(db, id, status)
  } else {
    await updateContactMessageStatusInDb(db, id, status)
  }

  await audit(
    {
      action: "update_message_status",
      entityType: type,
      entityId: id,
      summary: `Marked ${type} ${id} as ${status}`,
    },
    "/admin/messages"
  )
  revalidatePath("/admin/start")
  revalidatePath("/admin/dashboard")
  revalidatePath("/admin/messages")
}

export async function saveSettingsAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/settings")

  await saveSiteSettingsToDb(db, parseSiteSettings(formData))
  await audit(
    {
      action: "update_settings",
      entityType: "site_settings",
      entityId: "site",
      summary: "Updated site settings",
    },
    "/admin/settings"
  )
  revalidateAdminCore()
  revalidatePath("/admin/settings")
}

export async function saveSiteInfoWizardAction(formData) {
  const db = requireDb()
  await requireAdminSession("/admin/wizard/site-info")
  await saveSiteSettingsToDb(db, parseSiteSettings(formData))
  await audit(
    {
      action: "update_settings",
      entityType: "site_settings",
      entityId: "site",
      summary: "Updated site info from simple wizard",
    },
    "/admin/wizard/site-info"
  )
  revalidateAdminCore()
  revalidatePath("/admin/settings")
  redirect("/admin/wizard/site-info?saved=1")
}

export async function preloadProductForEdit(id) {
  const db = requireDb()
  await requireAdminSession(`/admin/products/${id}`)
  return fetchProductByIdFromDb(db, id)
}
