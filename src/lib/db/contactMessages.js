import { all, first, run } from "@/lib/db/d1"

function normalizeContactMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject || "",
    message: row.message || "",
    sourcePage: row.source_page || "",
    status: row.status || "new",
    createdAt: row.created_at,
  }
}

export async function fetchContactMessagesFromDb(db, { status = "all" } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM contact_messages
      WHERE (?1 = 'all' OR status = ?1)
      ORDER BY created_at DESC
    `,
    [status]
  )

  return rows.map(normalizeContactMessage)
}

export async function createContactMessageInDb(db, payload) {
  const result = await run(
    db,
    `
      INSERT INTO contact_messages (name, email, subject, message, source_page, status)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6)
    `,
    [
      payload.name,
      payload.email,
      payload.subject,
      payload.message,
      payload.sourcePage || "",
      payload.status || "new",
    ]
  )

  return first(db, `SELECT * FROM contact_messages WHERE id = ?1`, [
    Number(result.meta.last_row_id),
  ])
}

export async function updateContactMessageStatusInDb(db, id, status) {
  await run(
    db,
    `UPDATE contact_messages SET status = ?2 WHERE id = ?1`,
    [id, status]
  )
}
