import { getCloudflareContext } from "@opennextjs/cloudflare"

import { handleContactRequest } from "@/lib/contactHandler"

function getCloudflareEnv() {
  try {
    return getCloudflareContext().env ?? {}
  } catch {
    return {}
  }
}

export async function POST(req) {
  return handleContactRequest(req, getCloudflareEnv())
}
