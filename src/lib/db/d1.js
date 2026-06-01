import { getCloudflareContext } from "@opennextjs/cloudflare"

function readProcessEnv() {
  return typeof process !== "undefined" && process.env ? process.env : {}
}

export function getServerEnv() {
  try {
    return getCloudflareContext().env ?? {}
  } catch {
    return readProcessEnv()
  }
}

export function getOptionalDb(env = getServerEnv()) {
  return env?.DB ?? null
}

export function getOptionalMediaBucket(env = getServerEnv()) {
  return env?.MEDIA_BUCKET ?? null
}

export function getRequiredDb(env = getServerEnv()) {
  const db = getOptionalDb(env)

  if (!db) {
    throw new Error(
      "Cloudflare D1 binding `DB` is not configured. Public pages can fall back to static content, but admin features require D1."
    )
  }

  return db
}

export function getRequiredMediaBucket(env = getServerEnv()) {
  const bucket = getOptionalMediaBucket(env)

  if (!bucket) {
    throw new Error(
      "Cloudflare R2 binding `MEDIA_BUCKET` is not configured. Existing storefront images still work, but admin uploads require R2."
    )
  }

  return bucket
}

export function logDatabaseWarning(scope, error) {
  const isDev = readProcessEnv().NODE_ENV !== "production"
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown D1 error"

  if (isDev) {
    console.warn(`[kraftana:d1:${scope}] ${message}`)
  } else {
    console.error(`[kraftana:d1:${scope}] ${message}`)
  }
}

export async function all(db, sql, params = []) {
  const statement = db.prepare(sql).bind(...params)
  const result = await statement.all()
  return result?.results ?? []
}

export async function first(db, sql, params = []) {
  const statement = db.prepare(sql).bind(...params)
  const result = await statement.first()
  return result ?? null
}

export async function run(db, sql, params = []) {
  const statement = db.prepare(sql).bind(...params)
  return statement.run()
}

export async function batch(db, statements) {
  return db.batch(statements)
}

export function jsonValue(value, fallback = null) {
  if (!value) return fallback

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}
