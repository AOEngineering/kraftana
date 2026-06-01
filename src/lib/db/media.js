import { all, first, run } from "@/lib/db/d1"

function normalizeMediaAsset(row) {
  if (!row) return null

  return {
    id: row.id,
    storageKey: row.storage_key,
    publicUrl: row.public_url,
    fileName: row.file_name,
    contentType: row.content_type,
    sizeBytes: Number(row.size_bytes || 0),
    width: row.width ? Number(row.width) : null,
    height: row.height ? Number(row.height) : null,
    altText: row.alt_text || "",
    uploadedBy: row.uploaded_by || "",
    usageType: row.usage_type || "general",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    usageSummary: row.usageSummary || [],
  }
}

async function buildUsageMap(db) {
  const [productRows, galleryRows] = await Promise.all([
    all(
      db,
      `
        SELECT pi.image_url, p.id AS product_id, p.title
        FROM product_images pi
        INNER JOIN products p ON p.id = pi.product_id
      `
    ),
    all(
      db,
      `
        SELECT image_url, id AS gallery_id, title
        FROM gallery_items
      `
    ),
  ])

  const usageMap = new Map()

  for (const row of productRows) {
    const list = usageMap.get(row.image_url) || []
    list.push({
      type: "product",
      label: row.title,
      href: `/admin/products/${row.product_id}`,
    })
    usageMap.set(row.image_url, list)
  }

  for (const row of galleryRows) {
    const list = usageMap.get(row.image_url) || []
    list.push({
      type: "gallery",
      label: row.title,
      href: "/admin/gallery",
    })
    usageMap.set(row.image_url, list)
  }

  return usageMap
}

export async function fetchMediaAssetsFromDb(db, { usageType = "all" } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM media_assets
      WHERE (?1 = 'all' OR usage_type = ?1)
      ORDER BY created_at DESC, id DESC
    `,
    [usageType]
  )

  const usageMap = await buildUsageMap(db)

  return rows.map((row) =>
    normalizeMediaAsset({
      ...row,
      usageSummary: usageMap.get(row.public_url) || [],
    })
  )
}

export async function fetchRecentMediaAssetsFromDb(db, limit = 6) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM media_assets
      ORDER BY created_at DESC, id DESC
      LIMIT ?1
    `,
    [limit]
  )

  return rows.map(normalizeMediaAsset)
}

export async function createMediaAssetInDb(db, asset) {
  const existing = await first(
    db,
    `SELECT * FROM media_assets WHERE storage_key = ?1 OR public_url = ?2 LIMIT 1`,
    [asset.storageKey, asset.publicUrl]
  )

  if (existing) {
    return normalizeMediaAsset(existing)
  }

  const result = await run(
    db,
    `
      INSERT INTO media_assets (
        storage_key, public_url, file_name, content_type, size_bytes, width, height,
        alt_text, uploaded_by, usage_type
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
    `,
    [
      asset.storageKey,
      asset.publicUrl,
      asset.fileName,
      asset.contentType,
      asset.sizeBytes,
      asset.width ?? null,
      asset.height ?? null,
      asset.altText || "",
      asset.uploadedBy || "",
      asset.usageType || "general",
    ]
  )

  return fetchMediaAssetByIdFromDb(db, Number(result.meta.last_row_id))
}

export async function fetchMediaAssetByIdFromDb(db, id) {
  const row = await first(db, `SELECT * FROM media_assets WHERE id = ?1 LIMIT 1`, [id])
  return normalizeMediaAsset(row)
}

export async function updateMediaAssetAltTextInDb(db, id, altText) {
  await run(
    db,
    `
      UPDATE media_assets
      SET alt_text = ?2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?1
    `,
    [id, altText]
  )

  return fetchMediaAssetByIdFromDb(db, id)
}

export async function deleteMediaAssetRecordInDb(db, id) {
  const asset = await fetchMediaAssetByIdFromDb(db, id)
  if (!asset) {
    return { deleted: false, reason: "not_found", asset: null }
  }

  const [productUsage, galleryUsage] = await Promise.all([
    first(
      db,
      `SELECT COUNT(*) AS count FROM product_images WHERE image_url = ?1`,
      [asset.publicUrl]
    ),
    first(
      db,
      `SELECT COUNT(*) AS count FROM gallery_items WHERE image_url = ?1`,
      [asset.publicUrl]
    ),
  ])

  const useCount =
    Number(productUsage?.count || 0) + Number(galleryUsage?.count || 0)

  if (useCount > 0) {
    return { deleted: false, reason: "in_use", asset }
  }

  await run(db, `DELETE FROM media_assets WHERE id = ?1`, [id])
  return { deleted: true, reason: "deleted", asset }
}
