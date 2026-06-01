import { all, first, run } from "@/lib/db/d1"
import { getDeviceType } from "@/lib/analytics/classify"

export async function createVisitEventInDb(db, event) {
  await run(
    db,
    `
      INSERT INTO visit_events (
        session_id, path, query_string, referrer, referrer_host, channel,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        user_agent, device_type, ip_hash, country, region, is_bot
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)
    `,
    [
      event.sessionId || "",
      event.path || "",
      event.queryString || "",
      event.referrer || "",
      event.referrerHost || "",
      event.channel || "direct",
      event.utmSource || "",
      event.utmMedium || "",
      event.utmCampaign || "",
      event.utmTerm || "",
      event.utmContent || "",
      event.userAgent || "",
      getDeviceType(event.userAgent || ""),
      event.ipHash || "",
      event.country || "",
      event.region || "",
      getDeviceType(event.userAgent || "") === "bot" ? 1 : 0,
    ]
  )
}

export async function createConversionEventInDb(db, event) {
  await run(
    db,
    `
      INSERT INTO conversion_events (
        session_id, conversion_type, source_page, path, referrer, referrer_host, channel,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content, metadata_json
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)
    `,
    [
      event.sessionId || "",
      event.conversionType,
      event.sourcePage || "",
      event.path || "",
      event.referrer || "",
      event.referrerHost || "",
      event.channel || "direct",
      event.utmSource || "",
      event.utmMedium || "",
      event.utmCampaign || "",
      event.utmTerm || "",
      event.utmContent || "",
      JSON.stringify(event.metadata || {}),
    ]
  )
}

export async function upsertSessionAttributionInDb(db, event) {
  await run(
    db,
    `
      INSERT INTO session_attribution (
        session_id, landing_path, first_referrer, first_referrer_host, first_channel,
        first_utm_source, first_utm_medium, first_utm_campaign, first_utm_term, first_utm_content,
        latest_referrer, latest_referrer_host, latest_channel,
        latest_utm_source, latest_utm_medium, latest_utm_campaign, latest_utm_term, latest_utm_content
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      ON CONFLICT(session_id) DO UPDATE SET
        last_seen_at = CURRENT_TIMESTAMP,
        latest_referrer = excluded.latest_referrer,
        latest_referrer_host = excluded.latest_referrer_host,
        latest_channel = excluded.latest_channel,
        latest_utm_source = excluded.latest_utm_source,
        latest_utm_medium = excluded.latest_utm_medium,
        latest_utm_campaign = excluded.latest_utm_campaign,
        latest_utm_term = excluded.latest_utm_term,
        latest_utm_content = excluded.latest_utm_content
    `,
    [
      event.sessionId || "",
      event.path || "",
      event.referrer || "",
      event.referrerHost || "",
      event.channel || "direct",
      event.utmSource || "",
      event.utmMedium || "",
      event.utmCampaign || "",
      event.utmTerm || "",
      event.utmContent || "",
    ]
  )
}

export async function fetchAnalyticsOverviewFromDb(db, days = 30) {
  const windowExpr = `-${Math.max(1, Number(days) || 30)} days`
  const [visitsRow, sessionsRow, conversionsRow] = await Promise.all([
    first(db, `SELECT COUNT(*) AS count FROM visit_events WHERE created_at >= datetime('now', ?1)`, [windowExpr]),
    first(db, `SELECT COUNT(DISTINCT session_id) AS count FROM visit_events WHERE created_at >= datetime('now', ?1)`, [windowExpr]),
    first(db, `SELECT COUNT(*) AS count FROM conversion_events WHERE created_at >= datetime('now', ?1)`, [windowExpr]),
  ])

  const topChannels = await all(
    db,
    `
      SELECT channel, COUNT(*) AS count
      FROM visit_events
      WHERE created_at >= datetime('now', ?1)
      GROUP BY channel
      ORDER BY count DESC
      LIMIT 8
    `,
    [windowExpr]
  )

  const topReferrers = await all(
    db,
    `
      SELECT referrer_host, COUNT(*) AS count
      FROM visit_events
      WHERE created_at >= datetime('now', ?1)
      AND referrer_host != ''
      GROUP BY referrer_host
      ORDER BY count DESC
      LIMIT 8
    `,
    [windowExpr]
  )

  const topPages = await all(
    db,
    `
      SELECT path, COUNT(*) AS count
      FROM visit_events
      WHERE created_at >= datetime('now', ?1)
      GROUP BY path
      ORDER BY count DESC
      LIMIT 8
    `,
    [windowExpr]
  )

  const recentConversions = await all(
    db,
    `
      SELECT conversion_type, source_page, channel, utm_source, created_at
      FROM conversion_events
      WHERE created_at >= datetime('now', ?1)
      ORDER BY created_at DESC
      LIMIT 12
    `,
    [windowExpr]
  )

  return {
    visits: Number(visitsRow?.count || 0),
    sessions: Number(sessionsRow?.count || 0),
    conversions: Number(conversionsRow?.count || 0),
    topChannels,
    topReferrers,
    topPages,
    recentConversions,
  }
}

export async function fetchAnalyticsTableStatusFromDb(db) {
  const required = ["visit_events", "conversion_events", "session_attribution"]
  const rows = await all(
    db,
    `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      AND name IN (${required.map((_, index) => `?${index + 1}`).join(", ")})
    `,
    required
  )

  const existing = new Set(rows.map((row) => row.name))
  const missing = required.filter((name) => !existing.has(name))

  return {
    ready: missing.length === 0,
    missing,
  }
}
