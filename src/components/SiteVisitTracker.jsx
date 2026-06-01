"use client"

import { useEffect } from "react"

import { hasAcceptedCookies } from "@/lib/cookie-consent"
import { SESSION_COOKIE_NAME, UTM_COOKIE_NAME } from "@/lib/analytics/session"
import { parseReferrerHost } from "@/lib/analytics/classify"

function readCookie(name) {
  const encoded = `${name}=`
  const parts = document.cookie.split(";")
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.startsWith(encoded)) {
      return decodeURIComponent(trimmed.slice(encoded.length))
    }
  }
  return ""
}

function writeCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`
}

function getOrCreateSessionId() {
  const existing = readCookie(SESSION_COOKIE_NAME)
  if (existing) return existing
  const created = crypto.randomUUID()
  writeCookie(SESSION_COOKIE_NAME, created, 60 * 60 * 24 * 365)
  return created
}

function persistUtmFromLocation(url) {
  const utmPayload = {
    utm_source: url.searchParams.get("utm_source") || "",
    utm_medium: url.searchParams.get("utm_medium") || "",
    utm_campaign: url.searchParams.get("utm_campaign") || "",
    utm_term: url.searchParams.get("utm_term") || "",
    utm_content: url.searchParams.get("utm_content") || "",
  }

  if (Object.values(utmPayload).some(Boolean)) {
    writeCookie(UTM_COOKIE_NAME, JSON.stringify(utmPayload), 60 * 60 * 24 * 30)
  }

  return utmPayload
}

export default function SiteVisitTracker() {
  useEffect(() => {
    const path = new URL(window.location.href).pathname

    if (!path || path.startsWith("/admin") || path.startsWith("/api")) return

    const sendVisitEvent = () => {
      if (!hasAcceptedCookies()) return

      const url = new URL(window.location.href)
      const path = url.pathname
      const sessionId = getOrCreateSessionId()
      const utm = persistUtmFromLocation(url)
      const referrer = document.referrer || ""
      const payload = {
        sessionId,
        path,
        queryString: url.search || "",
        referrer,
        referrerHost: parseReferrerHost(referrer),
        utmSource: utm.utm_source || "",
        utmMedium: utm.utm_medium || "",
        utmCampaign: utm.utm_campaign || "",
        utmTerm: utm.utm_term || "",
        utmContent: utm.utm_content || "",
      }

      fetch("/api/track/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kraftana-Cookie-Consent": "accepted",
        },
        body: JSON.stringify({
          ...payload,
          cookieConsent: "accepted",
        }),
        keepalive: true,
      }).catch(() => {})
    }

    const onConsentChange = (event) => {
      if (event?.detail?.choice === "accepted") {
        sendVisitEvent()
      }
    }

    const timer = window.setTimeout(sendVisitEvent, 250)
    window.addEventListener("kraftana-cookie-consent", onConsentChange)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("kraftana-cookie-consent", onConsentChange)
    }
  }, [])

  return null
}
