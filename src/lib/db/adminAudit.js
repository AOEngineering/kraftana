import { all, run } from "@/lib/db/d1"

export async function createAdminAuditLog(db, entry) {
  await run(
    db,
    `
      INSERT INTO admin_audit_log (actor_label, action, entity_type, entity_id, summary)
      VALUES (?1, ?2, ?3, ?4, ?5)
    `,
    [
      entry.actorLabel,
      entry.action,
      entry.entityType,
      String(entry.entityId ?? ""),
      entry.summary,
    ]
  )
}

export async function fetchRecentAdminAuditLogs(db, limit = 12) {
  return all(
    db,
    `
      SELECT *
      FROM admin_audit_log
      ORDER BY created_at DESC
      LIMIT ?1
    `,
    [limit]
  )
}
