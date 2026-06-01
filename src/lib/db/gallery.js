import { all, first, run } from "@/lib/db/d1"

function normalizeGalleryItem(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || "",
    image: row.image_url,
    alt: row.alt_text || row.title,
    tag: row.tag || "",
    relatedProductSlug: row.related_product_slug || "",
    isFeatured: Boolean(row.is_featured),
    sortOrder: Number(row.sort_order || 0),
    status: row.status || "active",
  }
}

export async function fetchGalleryItemsFromDb(db, { status = "active" } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM gallery_items
      WHERE (?1 = 'all' OR status = ?1)
      ORDER BY is_featured DESC, sort_order ASC, updated_at DESC, title ASC
    `,
    [status]
  )

  return rows.map(normalizeGalleryItem)
}

export async function saveGalleryItemToDb(db, item) {
  const existing = item.id
    ? await first(db, `SELECT id FROM gallery_items WHERE id = ?1`, [item.id])
    : await first(db, `SELECT id FROM gallery_items WHERE slug = ?1`, [item.slug])

  let itemId = existing?.id ?? null

  if (itemId) {
    await run(
      db,
      `
        UPDATE gallery_items
        SET title = ?2,
            slug = ?3,
            description = ?4,
            image_url = ?5,
            alt_text = ?6,
            tag = ?7,
            related_product_slug = ?8,
            is_featured = ?9,
            sort_order = ?10,
            status = ?11,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?1
      `,
      [
        itemId,
        item.title,
        item.slug,
        item.description,
        item.image,
        item.alt,
        item.tag,
        item.relatedProductSlug,
        item.isFeatured ? 1 : 0,
        item.sortOrder ?? 0,
        item.status,
      ]
    )
  } else {
    const result = await run(
      db,
      `
        INSERT INTO gallery_items (
          title, slug, description, image_url, alt_text, tag, related_product_slug, is_featured,
          sort_order, status
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      `,
      [
        item.title,
        item.slug,
        item.description,
        item.image,
        item.alt,
        item.tag,
        item.relatedProductSlug,
        item.isFeatured ? 1 : 0,
        item.sortOrder ?? 0,
        item.status,
      ]
    )
    itemId = Number(result.meta.last_row_id)
  }

  return first(db, `SELECT * FROM gallery_items WHERE id = ?1`, [itemId])
}
