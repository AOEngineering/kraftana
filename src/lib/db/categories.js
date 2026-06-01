import { all } from "@/lib/db/d1"

export async function fetchCategoriesFromDb(db) {
  return all(
    db,
    `
      SELECT *
      FROM categories
      WHERE is_active = 1
      ORDER BY sort_order ASC, name ASC
    `
  )
}
