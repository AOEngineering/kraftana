"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
  COOKIE_CONSENT_KEY,
  type CookieConsentChoice,
  getCookieConsentChoice,
} from "@/lib/cookie-consent"

type CookieConsentState = {
  choice: CookieConsentChoice
  savedAt: string
}

export default function CookieConsent() {
  const [storedConsent, setStoredConsent] = useState<CookieConsentState | null>(null)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    let existing = null

    try {
      existing = getCookieConsentChoice()
    } catch {
      existing = null
    }

    setStoredConsent(existing)

    if (existing) return

    const timer = window.setTimeout(() => setShouldShow(true), 650)
    return () => window.clearTimeout(timer)
  }, [])

  function onChoice(choice: CookieConsentChoice) {
    const saved = {
      choice,
      savedAt: new Date().toISOString(),
    }
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(saved))
    } catch {
      // Keep UX unchanged even if localStorage is unavailable (private mode edge cases).
    }
    setStoredConsent(saved)
    setShouldShow(false)

    window.dispatchEvent(
      new CustomEvent("kraftana-cookie-consent", {
        detail: { choice },
      })
    )
  }

  if (storedConsent || !shouldShow) {
    return null
  }

  return (
    <div
      className="
        fixed inset-x-3 bottom-4 z-50 mx-auto flex w-[min(95vw,38rem)] flex-col gap-3 rounded-[1.5rem]
        border border-[#ead8c8]/80 bg-[#fffaf4]/95 p-5
        shadow-[0_20px_60px_rgba(97,66,48,0.14)] backdrop-blur-md
        md:inset-auto md:right-4 md:left-auto md:mx-0 md:w-[calc(22rem+1vw)]
      "
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-[#6f554b]">Privacy note</p>
      <h2 className="font-display text-xl leading-tight text-[color:var(--foreground)]">
        Cookies and little stitches
      </h2>
      <p className="text-sm leading-6 text-foreground/75">
        We use cookies and basic site data to understand what visitors love, improve the shop, and
        keep Kraftana feeling thoughtful. You can accept cookies or decline non essential tracking.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => onChoice("declined")}
          className="h-10 rounded-full border border-[#ead8c8] bg-[#fffaf4]/70 px-5 text-sm font-medium text-[#6f554b] hover:bg-[#f8eee6]"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => onChoice("accepted")}
          className="h-10 rounded-full bg-[#ad6f63] px-5 text-sm font-medium text-white transition hover:bg-[#9d6258]"
        >
          Accept cookies
        </button>
      </div>
      <Link
        href="/policies"
        className="mt-1 inline-block text-sm text-[#6f554b] underline decoration-[#ead8c8] underline-offset-4 transition hover:text-[#5f4a42]"
      >
        Read our policies
      </Link>
    </div>
  )
}
