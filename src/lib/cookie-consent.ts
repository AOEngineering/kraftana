export const COOKIE_CONSENT_KEY = "kraftana_cookie_consent"

export type CookieConsentChoice = "accepted" | "declined"

export type CookieConsentValue = {
  choice: CookieConsentChoice
  savedAt: string
}

function parseStoredConsent(raw: string | null): CookieConsentValue | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentValue>

    if (
      (parsed?.choice === "accepted" || parsed?.choice === "declined") &&
      typeof parsed.savedAt === "string" &&
      parsed.savedAt.length > 0
    ) {
      return {
        choice: parsed.choice,
        savedAt: parsed.savedAt,
      }
    }
  } catch {
    return null
  }

  return null
}

export function getCookieConsentChoice(): CookieConsentValue | null {
  if (typeof window === "undefined" || !window.localStorage) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    return parseStoredConsent(raw)
  } catch {
    return null
  }
}

export function hasAcceptedCookies(): boolean {
  return getCookieConsentChoice()?.choice === "accepted"
}
