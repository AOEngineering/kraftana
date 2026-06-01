import { z } from "zod"

import { getTrackingContextFromRequest } from "@/lib/analytics/trackingContext"
import { createConversionEventInDb } from "@/lib/db/analytics"
import { createContactMessageInDb } from "@/lib/db/contactMessages"
import { getOptionalDb, logDatabaseWarning } from "@/lib/db/d1"
import { checkRateLimit } from "@/lib/security/rateLimit"

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  topic: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(3000),
  website: z.string().trim().max(255).optional().default(""),
  cookieConsent: z.enum(["accepted", "declined"]).optional().default(""),
})

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

function readProcessEnv() {
  return typeof process !== "undefined" && process.env ? process.env : {}
}

function getWebhookConfig(env = {}) {
  const processEnv = readProcessEnv()

  return {
    webhookUrl:
      env.CONTACT_FORM_WEBHOOK_URL ||
      processEnv.CONTACT_FORM_WEBHOOK_URL ||
      "",
    authHeader:
      env.CONTACT_FORM_WEBHOOK_AUTH_HEADER ||
      processEnv.CONTACT_FORM_WEBHOOK_AUTH_HEADER ||
      "",
  }
}

function formatWebhookPayload(submission) {
  return {
    source: "kraftana-contact-form",
    submittedAt: new Date().toISOString(),
    contact: submission,
  }
}

export async function handleContactRequest(request, env = {}) {
  const limit = checkRateLimit(request, "contact", { windowMs: 60_000, maxHits: 8 })
  if (!limit.allowed) {
    return jsonResponse(
      { ok: false, error: "Too many submissions. Please wait and try again." },
      429
    )
  }

  let body

  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON body." }, 400)
  }

  const parsed = ContactSchema.safeParse(body)

  if (!parsed.success) {
    return jsonResponse(
      {
        ok: false,
        error: "Contact message is invalid.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      400
    )
  }

  if (parsed.data.website) {
    return jsonResponse({ ok: true, stored: false, forwarded: false }, 200)
  }

  const db = getOptionalDb(env)
  const { webhookUrl, authHeader } = getWebhookConfig(env)

  if (!db && !webhookUrl) {
    return jsonResponse(
      {
        ok: false,
        error:
          "Contact form delivery is not configured yet. Please try again soon.",
      },
      503
    )
  }

  let storedMessage = null
  let webhookDelivered = false

  if (db) {
    try {
      storedMessage = await createContactMessageInDb(db, {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.topic,
        message: parsed.data.message,
        sourcePage: "/contact",
        status: "new",
      })
    } catch (error) {
      logDatabaseWarning("contact-store", error)
      if (!webhookUrl) {
        return jsonResponse(
          {
            ok: false,
            error:
              "Your message could not be saved right now. Please try again soon.",
          },
          503
        )
      }
    }
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Kraftana-Source": "contact-form",
  }

  if (authHeader) {
    headers.Authorization = authHeader
  }

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(formatWebhookPayload(parsed.data)),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        logDatabaseWarning(
          "contact-webhook",
          new Error(`Webhook ${response.status}: ${errorText.slice(0, 160)}`)
        )
      } else {
        webhookDelivered = true
      }
    } catch (error) {
      logDatabaseWarning("contact-webhook", error)
    }
  }

  if (storedMessage || webhookDelivered) {
    if (db) {
      if (parsed.data.cookieConsent === "accepted") {
        try {
          const tracking = getTrackingContextFromRequest(request, "/contact")
          await createConversionEventInDb(db, {
            ...tracking,
            conversionType: "contact_submitted",
            sourcePage: "/contact",
            path: "/contact",
            metadata: {
              stored: Boolean(storedMessage),
              forwarded: webhookDelivered,
              topic: parsed.data.topic,
            },
          })
        } catch (error) {
          logDatabaseWarning("contact-conversion", error)
        }
      }
    }

    return jsonResponse({
      ok: true,
      stored: Boolean(storedMessage),
      forwarded: webhookDelivered,
    })
  }

  return jsonResponse(
    {
      ok: false,
      error: "Your message could not be delivered right now. Please try again soon.",
    },
    503
  )
}
