const SEARCH_HOST_HINTS = ["google.", "bing.", "yahoo.", "duckduckgo.", "ecosia.", "baidu."]
const SOCIAL_HOST_HINTS = [
  "facebook.",
  "instagram.",
  "tiktok.",
  "x.com",
  "twitter.",
  "pinterest.",
  "linkedin.",
  "youtube.",
  "reddit.",
]

function normalize(value) {
  return String(value || "").trim().toLowerCase()
}

export function parseReferrerHost(referrer) {
  try {
    const value = String(referrer || "").trim()
    if (!value) return ""
    return new URL(value).hostname.toLowerCase()
  } catch {
    return ""
  }
}

export function classifyChannel({ referrerHost = "", utmSource = "", utmMedium = "" }) {
  const source = normalize(utmSource)
  const medium = normalize(utmMedium)
  const host = normalize(referrerHost)

  if (medium) {
    if (["cpc", "ppc", "paid", "paid_social", "display"].includes(medium)) return "paid"
    if (["social", "social-organic"].includes(medium)) return "social"
    if (["email", "newsletter"].includes(medium)) return "email"
    if (["organic", "seo"].includes(medium)) return "search"
    if (["referral"].includes(medium)) return "referral"
  }

  if (source) {
    if (["google", "bing", "yahoo", "duckduckgo", "ecosia"].includes(source)) return "search"
    if (["facebook", "instagram", "tiktok", "twitter", "x", "pinterest", "linkedin", "youtube", "reddit"].includes(source)) return "social"
  }

  if (!host) return "direct"
  if (SEARCH_HOST_HINTS.some((hint) => host.includes(hint))) return "search"
  if (SOCIAL_HOST_HINTS.some((hint) => host.includes(hint))) return "social"
  return "referral"
}

export function getDeviceType(userAgent) {
  const ua = normalize(userAgent)
  if (!ua) return "unknown"
  if (/bot|spider|crawler|preview|slurp/.test(ua)) return "bot"
  if (/mobile|iphone|android/.test(ua)) return "mobile"
  if (/ipad|tablet/.test(ua)) return "tablet"
  return "desktop"
}

