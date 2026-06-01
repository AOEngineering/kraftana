import { all, first, jsonValue } from "@/lib/db/d1"

function normalizeGuideSize(row) {
  return {
    id: row.id,
    guideSlug: row.guide_slug,
    label: row.label,
    measurements: jsonValue(row.measurements_json, {}) || {},
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
  }
}

function normalizeGuide(row, sizes = []) {
  if (!row) return null

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    maxColors: row.max_colors === null || row.max_colors === undefined ? null : Number(row.max_colors),
    yarn: jsonValue(row.yarn_json, []) || [],
    colorNotes: row.color_notes || "",
    sizeNotes: row.size_notes || "",
    timingNotes: row.timing_notes || "",
    customerPrompt: row.customer_prompt || "",
    isActive: Boolean(row.is_active),
    sortOrder: Number(row.sort_order || 0),
    sizes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function fetchProductGuidesFromDb(db, { activeOnly = true } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM product_guides
      WHERE (?1 = 0 OR is_active = 1)
      ORDER BY sort_order ASC, title ASC
    `,
    [activeOnly ? 1 : 0]
  )

  if (!rows.length) return []

  const sizeRows = await all(
    db,
    `
      SELECT *
      FROM product_guide_sizes
      ORDER BY guide_slug ASC, sort_order ASC, id ASC
    `
  )

  const sizesBySlug = new Map()

  for (const sizeRow of sizeRows) {
    const size = normalizeGuideSize(sizeRow)
    const list = sizesBySlug.get(size.guideSlug) || []
    list.push(size)
    sizesBySlug.set(size.guideSlug, list)
  }

  return rows.map((row) => normalizeGuide(row, sizesBySlug.get(row.slug) || []))
}

export async function fetchProductGuideBySlugFromDb(db, slug) {
  const row = await first(
    db,
    `
      SELECT *
      FROM product_guides
      WHERE slug = ?1
      LIMIT 1
    `,
    [slug]
  )

  if (!row) return null

  const sizeRows = await all(
    db,
    `
      SELECT *
      FROM product_guide_sizes
      WHERE guide_slug = ?1
      ORDER BY sort_order ASC, id ASC
    `,
    [slug]
  )

  return normalizeGuide(row, sizeRows.map(normalizeGuideSize))
}

export async function fetchProductGuideSizesFromDb(db, slug) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM product_guide_sizes
      WHERE guide_slug = ?1
      ORDER BY sort_order ASC, id ASC
    `,
    [slug]
  )

  return rows.map(normalizeGuideSize)
}
