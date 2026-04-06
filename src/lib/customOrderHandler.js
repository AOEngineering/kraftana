import { z } from "zod"

export const CustomOrderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  itemType: z.string().trim().min(1).max(80),
  size: z.string().trim().min(1).max(80),
  colors: z.string().trim().max(500).optional().default(""),
  personalization: z.string().trim().max(500).optional().default(""),
  deadline: z.string().trim().max(80).optional().default(""),
  budget: z.coerce.number().min(0).max(100000),
  message: z.string().trim().min(5).max(5000),
  deposit: z.boolean().default(false),
  contactOk: z.boolean().refine((value) => value === true),
  yarnLine: z.string().trim().min(1).max(120),
  colorIds: z.array(z.string().trim().min(1).max(80)).min(1).max(6),
  resolvedColors: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        code: z.string().trim().min(1).max(80),
        name: z.string().trim().min(1).max(160),
        brand: z.string().trim().min(1).max(160),
        line: z.string().trim().min(1).max(160),
      })
    )
    .default([]),
  inspiration_name: z.string().trim().max(255).nullable().optional().default(null),
  inspiration_type: z.string().trim().max(120).nullable().optional().default(null),
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
      contactOk: submission.contactOk,
      depositPreference: submission.deposit,
    },
    order: {
      itemType: submission.itemType,
      size: submission.size,
      yarnLine: submission.yarnLine,
      budget: submission.budget,
      deadline: submission.deadline,
      colors: submission.colors,
      personalization: submission.personalization,
      message: submission.message,
      colorIds: submission.colorIds,
      resolvedColors: submission.resolvedColors,
      inspiration: {
        fileName: submission.inspiration_name,
        mimeType: submission.inspiration_type,
      },
    },
  }
}

export async function handleCustomOrderRequest(request, env = {}) {
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

  const { webhookUrl, authHeader } = getWebhookConfig(env)
  if (!webhookUrl) {
    return jsonResponse(
      {
        ok: false,
        error:
          "Custom order delivery is not configured. Set CUSTOM_ORDER_WEBHOOK_URL before deploying this route.",
      },
      503
    )
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Kraftana-Source": "custom-order-form",
  }

  if (authHeader) {
    headers.Authorization = authHeader
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(formatWebhookPayload(parsed.data)),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")

      return jsonResponse(
        {
          ok: false,
          error: "Custom order delivery failed.",
          upstreamStatus: response.status,
          upstreamBody: errorText.slice(0, 500),
        },
        502
      )
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Custom order delivery failed.",
      },
      502
    )
  }
}
