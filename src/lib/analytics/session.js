export const SESSION_COOKIE_NAME = "kraftana_sid"
export const UTM_COOKIE_NAME = "kraftana_utm"

export function parseCookieHeader(cookieHeader = "") {
  const cookies = {}
  for (const pair of String(cookieHeader || "").split(";")) {
    const trimmed = pair.trim()
    if (!trimmed) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    cookies[key] = decodeURIComponent(value)
  }
  return cookies
}

export function safeJsonParse(value, fallback = {}) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

