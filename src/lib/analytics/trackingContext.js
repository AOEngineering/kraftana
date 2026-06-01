import crypto from "node:crypto"

import { classifyChannel, parseReferrerHost } from "@/lib/analytics/classify"
import { parseCookieHeader, safeJsonParse, SESSION_COOKIE_NAME, UTM_COOKIE_NAME } from "@/lib/analytics/session"

function firstHeader(request, keys) {
  for (const key of keys) {
    const value = request.headers.get(key)
    if (value) return value
  }
  return ""
}

function getClientIp(request) {
  const raw = firstHeader(request, ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"])
  if (!raw) return ""
  return raw.split(",")[0].trim()
}

function hashIp(ip) {
  if (!ip) return ""
  return crypto.createHash("sha256").update(ip).digest("hex")
}

function readUtmFromUrl(url) {
  return {
    utmSource: url.searchParams.get("utm_source") || "",
    utmMedium: url.searchParams.get("utm_medium") || "",
    utmCampaign: url.searchParams.get("utm_campaign") || "",
    utmTerm: url.searchParams.get("utm_term") || "",
    utmContent: url.searchParams.get("utm_content") || "",
  }
}

export function getTrackingContextFromRequest(request, fallbackPath = "") {
  const cookieMap = parseCookieHeader(request.headers.get("cookie") || "")
  const sessionId = cookieMap[SESSION_COOKIE_NAME] || ""
  const utmCookie = safeJsonParse(cookieMap[UTM_COOKIE_NAME], {})
  const requestUrl = new URL(request.url)
  const utmFromUrl = readUtmFromUrl(requestUrl)

  const utmSource = utmFromUrl.utmSource || utmCookie.utm_source || ""
  const utmMedium = utmFromUrl.utmMedium || utmCookie.utm_medium || ""
  const utmCampaign = utmFromUrl.utmCampaign || utmCookie.utm_campaign || ""
  const utmTerm = utmFromUrl.utmTerm || utmCookie.utm_term || ""
  const utmContent = utmFromUrl.utmContent || utmCookie.utm_content || ""

  const referrer = firstHeader(request, ["referer", "referrer"]) || ""
  const referrerHost = parseReferrerHost(referrer)
  const userAgent = request.headers.get("user-agent") || ""
  const ipHash = hashIp(getClientIp(request))
  const country = request.headers.get("cf-ipcountry") || ""
  const region = request.headers.get("cf-region-code") || ""
  const path = fallbackPath || requestUrl.pathname || ""

  return {
    sessionId,
    path,
    queryString: requestUrl.search || "",
    referrer,
    referrerHost,
    channel: classifyChannel({ referrerHost, utmSource, utmMedium }),
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    userAgent,
    ipHash,
    country,
    region,
  }
}

