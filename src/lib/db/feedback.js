import { all, run } from "@/lib/db/d1"

function normalizeFeedback(row) {
  return {
    id: row.id,
    type: row.type,
    pagePath: row.page_path || "",
    productSlug: row.product_slug || "",
    email: row.email || "",
    rating: Number(row.rating || 0),
    message: row.message || "",
    status: row.status || "new",
    createdAt: row.created_at,
  }
}

export async function fetchFeedbackFromDb(db, { status = "all" } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM feedback
      WHERE (?1 = 'all' OR status = ?1)
      ORDER BY created_at DESC
    `,
    [status]
  )

  return rows.map(normalizeFeedback)
}

export async function createFeedbackInDb(db, payload) {
  await run(
    db,
    `
      INSERT INTO feedback (type, page_path, product_slug, email, rating, message, status)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
    `,
    [
      payload.type,
      payload.pagePath || "",
      payload.productSlug || "",
      payload.email || "",
      payload.rating || null,
      payload.message || "",
      payload.status || "new",
    ]
  )
}

export async function updateFeedbackStatusInDb(db, id, status) {
  await run(db, `UPDATE feedback SET status = ?2 WHERE id = ?1`, [id, status])
}
