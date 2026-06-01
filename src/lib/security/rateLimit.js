const buckets = new Map()

function nowMs() {
  return Date.now()
}

function getClientIp(request) {
  const direct = request.headers.get("cf-connecting-ip")
  if (direct) return direct.trim()

  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}

export function checkRateLimit(request, key, options = {}) {
  const windowMs = Math.max(1000, Number(options.windowMs || 60_000))
  const maxHits = Math.max(1, Number(options.maxHits || 20))
  const ip = getClientIp(request)
  const bucketKey = `${key}:${ip}`
  const currentTime = nowMs()
  const hitTimes = buckets.get(bucketKey) || []
  const validHits = hitTimes.filter((timestamp) => currentTime - timestamp < windowMs)

  if (validHits.length >= maxHits) {
    buckets.set(bucketKey, validHits)
    const retryAfter = Math.ceil((windowMs - (currentTime - validHits[0])) / 1000)
    return { allowed: false, retryAfter }
  }

  validHits.push(currentTime)
  buckets.set(bucketKey, validHits)
  return { allowed: true, retryAfter: 0 }
}

