import { getCloudflareContext } from "@opennextjs/cloudflare"

import { handleCustomOrderRequest } from "@/lib/customOrderHandler"

function getCloudflareEnv() {
  try {
    return getCloudflareContext().env ?? {}
  } catch {
    return {}
  }
}

export async function POST(req) {
  return handleCustomOrderRequest(req, getCloudflareEnv())
}
