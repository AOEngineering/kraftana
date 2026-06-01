const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024
const UPLOAD_FOLDERS = {
  product: "products",
  gallery: "gallery",
  testimonial: "general",
  general: "general",
}

function readProcessEnv() {
  return typeof process !== "undefined" && process.env ? process.env : {}
}

function sanitizeFileName(fileName) {
  const cleaned = String(fileName || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  return cleaned || "upload"
}

function normalizePublicBaseUrl(value) {
  const raw = String(value || "").trim()
  if (!raw) return ""
  return raw.endsWith("/") ? raw : `${raw}/`
}

export function getMediaPublicBaseUrl(env = {}) {
  return normalizePublicBaseUrl(
    env.NEXT_PUBLIC_MEDIA_BASE_URL || readProcessEnv().NEXT_PUBLIC_MEDIA_BASE_URL
  )
}

export function validateUploadFile(file) {
  if (!file) {
    throw new Error("Choose an image before uploading.")
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload a JPG, PNG, WEBP, or GIF image.")
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Each image must be 8 MB or smaller.")
  }
}

export function normalizeUsageType(value) {
  const usageType = String(value || "general").toLowerCase()
  return Object.hasOwn(UPLOAD_FOLDERS, usageType) ? usageType : "general"
}

export function buildMediaStorageKey({ usageType = "general", fileName, now = new Date() }) {
  const folder = UPLOAD_FOLDERS[normalizeUsageType(usageType)] || "general"
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, "0")
  const safeName = sanitizeFileName(fileName)
  const extension = safeName.includes(".") ? "" : ".bin"

  return `${folder}/${year}/${month}/${crypto.randomUUID()}-${safeName}${extension}`
}

export function buildMediaPublicUrl(storageKey, env = {}) {
  const baseUrl = getMediaPublicBaseUrl(env)

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_MEDIA_BASE_URL is not configured. Admin uploads need a public media base URL so uploaded images can be displayed."
    )
  }

  return new URL(storageKey, baseUrl).toString()
}

export function getMaxImageSizeBytes() {
  return MAX_IMAGE_SIZE_BYTES
}
