import { all, first, run } from "@/lib/db/d1"

function normalizeProduct(row, images = []) {
  if (!row) return null

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    categoryLabel: row.category_label || row.categoryLabel || row.category,
    price: Number(row.price_cents || 0) / 100,
    priceCents: Number(row.price_cents || 0),
    currency: row.currency || "USD",
    leadDays: Number(row.lead_time_days || 0),
    availability: row.availability_label || "",
    shortDescription: row.short_description || "",
    description: row.description || "",
    careNotes: row.care_notes || "",
    fitNotes: row.sizing_notes || "",
    customizationNotes: row.customization_notes || "",
    isFeatured: Boolean(row.is_featured),
    isCustomizable: Boolean(row.is_customizable),
    status: row.status || "draft",
    alt: images.find((image) => image.isPrimary)?.alt || images[0]?.alt || row.title,
    images: images.map((image) => ({
      id: image.id,
      src: image.imageUrl,
      alt: image.alt,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
    })),
  }
}

function normalizeImage(row) {
  return {
    id: row.id,
    productId: row.product_id,
    imageUrl: row.image_url,
    alt: row.alt_text || "",
    sortOrder: Number(row.sort_order || 0),
    isPrimary: Boolean(row.is_primary),
  }
}

function categoryLabel(category) {
  switch (category) {
    case "tops":
      return "Handmade top"
    case "skirts":
      return "Handmade skirt"
    case "cardigans":
      return "Handmade cardigan"
    case "accessories":
      return "Handmade accessory"
    default:
      return "Handmade piece"
  }
}

export async function fetchProductsFromDb(db, { status = "active" } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM products
      WHERE (?1 = 'all' OR status = ?1)
      ORDER BY is_featured DESC, updated_at DESC, title ASC
    `,
    [status]
  )

  if (!rows.length) return []

  const images = await all(
    db,
    `
      SELECT *
      FROM product_images
      ORDER BY product_id ASC, is_primary DESC, sort_order ASC, id ASC
    `
  )

  const imageMap = new Map()

  for (const imageRow of images) {
    const image = normalizeImage(imageRow)
    const list = imageMap.get(image.productId) || []
    list.push(image)
    imageMap.set(image.productId, list)
  }

  return rows.map((row) =>
    normalizeProduct(
      { ...row, category_label: categoryLabel(row.category) },
      imageMap.get(row.id) || []
    )
  )
}

export async function fetchProductBySlugFromDb(db, slug) {
  const row = await first(
    db,
    `
      SELECT *
      FROM products
      WHERE slug = ?1
      LIMIT 1
    `,
    [slug]
  )

  if (!row) return null

  const images = await all(
    db,
    `
      SELECT *
      FROM product_images
      WHERE product_id = ?1
      ORDER BY is_primary DESC, sort_order ASC, id ASC
    `,
    [row.id]
  )

  return normalizeProduct(
    { ...row, category_label: categoryLabel(row.category) },
    images.map(normalizeImage)
  )
}

export async function fetchProductByIdFromDb(db, id) {
  const row = await first(
    db,
    `
      SELECT *
      FROM products
      WHERE id = ?1
      LIMIT 1
    `,
    [id]
  )

  if (!row) return null

  const images = await all(
    db,
    `
      SELECT *
      FROM product_images
      WHERE product_id = ?1
      ORDER BY is_primary DESC, sort_order ASC, id ASC
    `,
    [row.id]
  )

  return normalizeProduct(
    { ...row, category_label: categoryLabel(row.category) },
    images.map(normalizeImage)
  )
}

export async function saveProductToDb(db, product) {
  const existing = product.id
    ? await first(db, `SELECT id FROM products WHERE id = ?1`, [product.id])
    : await first(db, `SELECT id FROM products WHERE slug = ?1`, [product.slug])

  let productId = existing?.id ?? null

  if (productId) {
    await run(
      db,
      `
        UPDATE products
        SET slug = ?2,
            title = ?3,
            category = ?4,
            short_description = ?5,
            description = ?6,
            price_cents = ?7,
            currency = ?8,
            lead_time_days = ?9,
            care_notes = ?10,
            sizing_notes = ?11,
            customization_notes = ?12,
            availability_label = ?13,
            is_featured = ?14,
            is_customizable = ?15,
            status = ?16,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?1
      `,
      [
        productId,
        product.slug,
        product.title,
        product.category,
        product.shortDescription,
        product.description,
        product.priceCents,
        product.currency || "USD",
        product.leadDays,
        product.careNotes,
        product.fitNotes,
        product.customizationNotes,
        product.availability,
        product.isFeatured ? 1 : 0,
        product.isCustomizable ? 1 : 0,
        product.status,
      ]
    )
  } else {
    const result = await run(
      db,
      `
        INSERT INTO products (
          slug, title, category, short_description, description, price_cents, currency,
          lead_time_days, care_notes, sizing_notes, customization_notes, availability_label,
          is_featured, is_customizable, status
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
      `,
      [
        product.slug,
        product.title,
        product.category,
        product.shortDescription,
        product.description,
        product.priceCents,
        product.currency || "USD",
        product.leadDays,
        product.careNotes,
        product.fitNotes,
        product.customizationNotes,
        product.availability,
        product.isFeatured ? 1 : 0,
        product.isCustomizable ? 1 : 0,
        product.status,
      ]
    )
    productId = Number(result.meta.last_row_id)
  }

  await run(db, `DELETE FROM product_images WHERE product_id = ?1`, [productId])

  for (const [index, image] of (product.images || []).entries()) {
    await run(
      db,
      `
        INSERT INTO product_images (
          product_id, image_url, alt_text, sort_order, is_primary
        )
        VALUES (?1, ?2, ?3, ?4, ?5)
      `,
      [productId, image.src, image.alt, image.sortOrder ?? index, image.isPrimary ? 1 : 0]
    )
  }

  return fetchProductByIdFromDb(db, productId)
}

export async function updateProductStatus(db, id, status) {
  await run(
    db,
    `UPDATE products SET status = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?1`,
    [id, status]
  )
}

export async function toggleProductFeatured(db, id, isFeatured) {
  await run(
    db,
    `UPDATE products SET is_featured = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?1`,
    [id, isFeatured ? 1 : 0]
  )
}
