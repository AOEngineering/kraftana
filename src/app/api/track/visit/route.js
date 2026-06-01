import { getCloudflareContext } from "@opennextjs/cloudflare"

import { createVisitEventInDb, upsertSessionAttributionInDb } from "@/lib/db/analytics"
import { getOptionalDb, logDatabaseWarning } from "@/lib/db/d1"
import { getTrackingContextFromRequest } from "@/lib/analytics/trackingContext"

function getCloudflareEnv() {
  try {
    return getCloudflareContext().env ?? {}
  } catch {
    return {}
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

function getCookieConsentFromPayload(payload) {
  if (payload?.cookieConsent === "accepted") {
    return true
  }

  return false
}

function getCookieConsentFromHeaders(request) {
  const header = request.headers.get("X-Kraftana-Cookie-Consent")
  return header === "accepted"
}

export async function POST(request) {
  const db = getOptionalDb(getCloudflareEnv())
  if (!db) return jsonResponse({ ok: true, skipped: true })

  let payload = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const consented = getCookieConsentFromHeaders(request) || getCookieConsentFromPayload(payload)
  if (!consented) {
    return jsonResponse({ ok: true, skipped: true })
  }

  const tracking = getTrackingContextFromRequest(request, payload.path || "")
  const path = String(payload.path || tracking.path || "")

  if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
    return jsonResponse({ ok: true, skipped: true })
  }

  try {
    const event = {
      ...tracking,
      sessionId: payload.sessionId || tracking.sessionId || "",
      path,
      queryString: payload.queryString || tracking.queryString || "",
      referrer: payload.referrer || tracking.referrer || "",
      referrerHost: payload.referrerHost || tracking.referrerHost || "",
      utmSource: payload.utmSource || tracking.utmSource || "",
      utmMedium: payload.utmMedium || tracking.utmMedium || "",
      utmCampaign: payload.utmCampaign || tracking.utmCampaign || "",
      utmTerm: payload.utmTerm || tracking.utmTerm || "",
      utmContent: payload.utmContent || tracking.utmContent || "",
      userAgent: tracking.userAgent || "",
      ipHash: tracking.ipHash || "",
      country: tracking.country || "",
      region: tracking.region || "",
    }

    await createVisitEventInDb(db, event)
    if (event.sessionId) {
      await upsertSessionAttributionInDb(db, event)
    }
  } catch (error) {
    logDatabaseWarning("track-visit", error)
  }

  return jsonResponse({ ok: true })
}
