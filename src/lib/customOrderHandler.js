import { z } from "zod"

import { getTrackingContextFromRequest } from "@/lib/analytics/trackingContext"
import { createConversionEventInDb } from "@/lib/db/analytics"
import {
  createCustomRequestInDb,
  createCustomRequestYarnSelectionsInDb,
  buildYarnSelectionPayloadFromIds,
} from "@/lib/db/customRequests"
import { getOptionalDb, logDatabaseWarning } from "@/lib/db/d1"
import { checkRateLimit } from "@/lib/security/rateLimit"
import { HOBBII_YARN_CATALOG } from "@/lib/yarnCatalog"
import { getYarnRulesFromSelection } from "@/lib/customOrderYarnRules"

export const CustomOrderSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .default("")
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Please enter a valid email address.",
    }),
  phone: z.string().trim().max(80).optional().default(""),
  itemType: z.string().trim().min(1).max(160),
  size: z.string().trim().min(1).max(500),
  colors: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  category: z.string().trim().max(200).optional().default(""),
  guideProduct: z.string().trim().max(240).optional().default(""),
  customItemText: z.string().trim().max(400).optional().default(""),
  shippingAddressLine1: z.string().trim().min(1).max(255),
  shippingAddressLine2: z.string().trim().max(255).optional().default(""),
  shippingCity: z.string().trim().min(1).max(120),
  shippingState: z.string().trim().min(1).max(120),
  shippingPostalCode: z.string().trim().min(1).max(40),
  shippingCountry: z.string().trim().min(1).max(120).default("United States"),
  requested_product_slug: z.string().trim().max(160).optional().default(""),
  website: z.string().trim().max(255).optional().default(""),
  selectedYarnIds: z.array(z.string().trim().min(1)).default([]),
  cookieConsent: z.union([z.enum(["accepted", "declined"]), z.literal("")]).optional().default(""),
}).superRefine((values, context) => {
  if (!values.email.trim() && !values.phone.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Please enter an email or phone number so Kevonne can follow up.",
    })
  }

  const selectedYarnIds = values.selectedYarnIds ?? []
  const selectedSet = new Set(selectedYarnIds)
  const validIds = HOBBII_YARN_CATALOG.reduce((acc, yarn) => {
    acc.add(yarn.id)
    return acc
  }, new Set())

  if (!selectedYarnIds.every((id) => validIds.has(id))) {
    const badIds = [...selectedSet].filter((id) => !validIds.has(id))
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["selectedYarnIds"],
      message: `Unknown yarn ID${badIds.length > 1 ? "s" : ""}: ${badIds.join(", ")}`,
    })
  }

  const uniqueCount = selectedSet.size
  const rules = getYarnRulesFromSelection({
    category: values.category || "",
    itemType: values.itemType || "",
    guideProduct: values.guideProduct || "",
    customItemText: values.customItemText || "",
  })

  if (uniqueCount < rules.minColors) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["selectedYarnIds"],
      message: `Pick at least ${rules.minColors} yarn color${rules.minColors === 1 ? "" : "s"} for this request.`,
    })
  }

  if (uniqueCount > rules.maxColors) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["selectedYarnIds"],
      message: `You can only choose up to ${rules.maxColors} yarn color${rules.maxColors === 1 ? "" : "s"} for this request.`,
    })
  }

  if (!rules.allowDuplicateYarns && selectedSet.size !== selectedYarnIds.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["selectedYarnIds"],
      message: "Duplicate yarn selection is not supported for this request.",
    })
  }
})

export function jsonResponse(body, status = 200) {
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

export function getWebhookConfig(env = {}) {
  const processEnv = readProcessEnv()

  return {
    webhookUrl: env.CUSTOM_ORDER_WEBHOOK_URL || processEnv.CUSTOM_ORDER_WEBHOOK_URL || "",
    authHeader:
      env.CUSTOM_ORDER_WEBHOOK_AUTH_HEADER ||
      processEnv.CUSTOM_ORDER_WEBHOOK_AUTH_HEADER ||
      "",
  }
}

export function formatWebhookPayload(submission) {
  return {
    source: "kraftana-custom-order",
    submittedAt: new Date().toISOString(),
    customer: {
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
    },
    order: {
      category: submission.category,
      guideProduct: submission.guideProduct,
      customItemText: submission.customItemText,
      itemType: submission.itemType,
      size: submission.size,
      colors: submission.colors,
      message: submission.message,
      selectedYarns: submission.selectedYarns || [],
      requestedProductSlug: submission.requested_product_slug,
      shippingAddress: {
        line1: submission.shippingAddressLine1,
        line2: submission.shippingAddressLine2,
        city: submission.shippingCity,
        state: submission.shippingState,
        postalCode: submission.shippingPostalCode,
        country: submission.shippingCountry,
      },
    },
  }
}

function createRequestNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `KR-${stamp}-${random}`
}

export async function handleCustomOrderRequest(request, env = {}) {
  const limit = checkRateLimit(request, "custom-order", { windowMs: 60_000, maxHits: 6 })
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

  const parsed = CustomOrderSchema.safeParse(body)
  if (!parsed.success) {
    return jsonResponse(
      {
        ok: false,
        error: "Custom order request is invalid.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      400
    )
  }

  if (parsed.data.website) {
    return jsonResponse({ ok: true, requestNumber: "", stored: false, forwarded: false }, 200)
  }

  const db = getOptionalDb(env)
  const { webhookUrl, authHeader } = getWebhookConfig(env)

  if (!db && !webhookUrl) {
    return jsonResponse(
      {
        ok: false,
        error:
          "Custom request delivery is not configured yet. Please try again soon or reach out through the contact page.",
      },
      503
    )
  }

  const requestNumber = createRequestNumber()
  let storedRequest = null
  let webhookDelivered = false
  const selectedYarns = buildYarnSelectionPayloadFromIds(
    HOBBII_YARN_CATALOG,
    parsed.data.selectedYarnIds,
    1,
    getYarnRulesFromSelection({
      category: parsed.data.category || "",
      itemType: parsed.data.itemType || "",
      guideProduct: parsed.data.guideProduct || "",
      customItemText: parsed.data.customItemText || "",
    }).allowDuplicateYarns
  )

  if (db) {
    try {
      storedRequest = await createCustomRequestInDb(db, {
        requestNumber,
        name: parsed.data.name,
        email: parsed.data.email || "",
        phone: parsed.data.phone || "",
        category: parsed.data.category || "",
        guideProduct: parsed.data.guideProduct || "",
        customItemText: parsed.data.customItemText || "",
        itemType: parsed.data.itemType,
        sizeText: parsed.data.size,
        budgetCents: 0,
        deadline: "",
        paletteNotes: parsed.data.colors,
        personalization: "",
        message: parsed.data.message || "",
        requestedProductSlug: parsed.data.requested_product_slug,
        status: "new",
        shippingAddressLine1: parsed.data.shippingAddressLine1,
        shippingAddressLine2: parsed.data.shippingAddressLine2 || "",
        shippingCity: parsed.data.shippingCity,
        shippingState: parsed.data.shippingState,
        shippingPostalCode: parsed.data.shippingPostalCode,
        shippingCountry: parsed.data.shippingCountry || "United States",
      })

      await createCustomRequestYarnSelectionsInDb(db, storedRequest.id, selectedYarns)
    } catch (error) {
      logDatabaseWarning("custom-request-store", error)
      if (!webhookUrl) {
        return jsonResponse(
          {
            ok: false,
            error:
              "Your request could not be saved right now. Please try again soon.",
          },
          503
        )
      }
    }
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Kraftana-Source": "custom-order-form",
  }

  if (authHeader) {
    headers.Authorization = authHeader
  }

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(
          formatWebhookPayload({
            ...parsed.data,
            selectedYarns,
            request_number: requestNumber,
          })
        ),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        logDatabaseWarning(
          "custom-request-webhook",
          new Error(`Webhook ${response.status}: ${errorText.slice(0, 160)}`)
        )
      } else {
        webhookDelivered = true
      }
    } catch (error) {
      logDatabaseWarning("custom-request-webhook", error)
    }
  }

  if (storedRequest || webhookDelivered) {
    if (db) {
      if (parsed.data.cookieConsent === "accepted") {
        try {
          const tracking = getTrackingContextFromRequest(request, "/custom")
          await createConversionEventInDb(db, {
            ...tracking,
            conversionType: "custom_request_submitted",
            sourcePage: "/custom",
            path: "/custom",
            metadata: {
              requestNumber,
              itemType: parsed.data.itemType,
              yarnCount: selectedYarns.length,
              selectedYarnIds: parsed.data.selectedYarnIds,
              stored: Boolean(storedRequest),
              forwarded: webhookDelivered,
            },
          })
        } catch (error) {
          logDatabaseWarning("custom-conversion", error)
        }
      }
    }

    return jsonResponse({
      ok: true,
      requestNumber,
      stored: Boolean(storedRequest),
      forwarded: webhookDelivered,
    })
  }

  return jsonResponse(
    {
      ok: false,
      error:
        "Your request could not be delivered right now. Please try again soon.",
    },
    503
  )
}
