import { handleCustomOrderRequest, jsonResponse } from "../../src/lib/customOrderHandler.js"

export async function onRequest({ request, env }) {
  if (request.method === "POST") {
    return handleCustomOrderRequest(request, env)
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: "POST, OPTIONS",
        "Cache-Control": "no-store",
      },
    })
  }

  return jsonResponse({ ok: false, error: "Method not allowed." }, 405)
}
