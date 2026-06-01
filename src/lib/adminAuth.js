import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const COOKIE_NAME = "kraftana_admin_session"
const SESSION_TTL_SECONDS = 60 * 60 * 12
const DEFAULT_ADMIN_PATH = "/admin/start"

function readProcessEnv() {
  return typeof process !== "undefined" && process.env ? process.env : {}
}

function getSecret() {
  return readProcessEnv().ADMIN_SESSION_SECRET || ""
}

function getCredentials() {
  const env = readProcessEnv()
  return {
    username: env.ADMIN_USERNAME || "",
    password: env.ADMIN_PASSWORD || "",
  }
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8")
}

async function signValue(value) {
  const secret = getSecret()

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.")
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  )

  return Buffer.from(signature).toString("base64url")
}

async function verifyValue(value, signature) {
  return (await signValue(value)) === signature
}

export function normalizeAdminNextPath(value) {
  const raw = String(value || "").trim()

  if (!raw.startsWith("/admin")) {
    return DEFAULT_ADMIN_PATH
  }

  if (raw.startsWith("//") || raw.includes("://") || raw.includes("\\")) {
    return DEFAULT_ADMIN_PATH
  }

  return raw
}

export async function createAdminSession(username) {
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = await signValue(encodedPayload)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, `${encodedPayload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: readProcessEnv().NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: readProcessEnv().NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value
  if (!sessionCookie) return null

  const [encodedPayload, signature] = sessionCookie.split(".")
  if (!encodedPayload || !signature) return null

  try {
    const isValid = await verifyValue(encodedPayload, signature)
    if (!isValid) return null

    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    if (!payload?.username || !payload?.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

export async function requireAdminSession(nextPath = DEFAULT_ADMIN_PATH) {
  const session = await getAdminSession()
  if (!session) redirect(`/admin/login?next=${encodeURIComponent(normalizeAdminNextPath(nextPath))}`)
  return session
}

export async function validateAdminCredentials(username, password) {
  const credentials = getCredentials()

  if (!credentials.username || !credentials.password || !getSecret()) {
    throw new Error(
      "Admin credentials are not fully configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET."
    )
  }

  return username === credentials.username && password === credentials.password
}
