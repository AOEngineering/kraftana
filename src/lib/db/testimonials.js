import { all, first, run } from "@/lib/db/d1"

function normalizeTestimonial(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location || "",
    quote: row.quote || "",
    productContext: row.product_context || "",
    rating: Number(row.rating || 0),
    isFeatured: Boolean(row.is_featured),
    isApproved: Boolean(row.is_approved),
    sortOrder: Number(row.sort_order || 0),
  }
}

export async function fetchTestimonialsFromDb(db, { approvedOnly = true } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM testimonials
      WHERE (?1 = 0 OR is_approved = 1)
      ORDER BY is_featured DESC, sort_order ASC, created_at DESC
    `,
    [approvedOnly ? 1 : 0]
  )

  return rows.map(normalizeTestimonial)
}

export async function saveTestimonialToDb(db, testimonial) {
  const existing = testimonial.id
    ? await first(db, `SELECT id FROM testimonials WHERE id = ?1`, [testimonial.id])
    : null

  let testimonialId = existing?.id ?? null

  if (testimonialId) {
    await run(
      db,
      `
        UPDATE testimonials
        SET name = ?2,
            location = ?3,
            quote = ?4,
            product_context = ?5,
            rating = ?6,
            is_featured = ?7,
            is_approved = ?8,
            sort_order = ?9,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?1
      `,
      [
        testimonialId,
        testimonial.name,
        testimonial.location,
        testimonial.quote,
        testimonial.productContext,
        testimonial.rating,
        testimonial.isFeatured ? 1 : 0,
        testimonial.isApproved ? 1 : 0,
        testimonial.sortOrder ?? 0,
      ]
    )
  } else {
    const result = await run(
      db,
      `
        INSERT INTO testimonials (
          name, location, quote, product_context, rating, is_featured, is_approved, sort_order
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      `,
      [
        testimonial.name,
        testimonial.location,
        testimonial.quote,
        testimonial.productContext,
        testimonial.rating,
        testimonial.isFeatured ? 1 : 0,
        testimonial.isApproved ? 1 : 0,
        testimonial.sortOrder ?? 0,
      ]
    )
    testimonialId = Number(result.meta.last_row_id)
  }

  return first(db, `SELECT * FROM testimonials WHERE id = ?1`, [testimonialId])
}
