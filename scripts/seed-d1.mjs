import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

import { PRODUCTS } from "../src/lib/products.js"
import {
  galleryItems,
  staticSiteSettings,
  testimonials,
} from "../src/lib/site.js"

const args = new Set(process.argv.slice(2))
const mode = args.has("--remote") ? "--remote" : "--local"
const databaseName =
  process.env.KRAFTANA_D1_DATABASE_NAME || "kraftana"
const tempDir = path.resolve(".tmp")
const tempFile = path.join(tempDir, `kraftana-seed${mode === "--remote" ? "-remote" : "-local"}.sql`)

function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''")
}

function boolSql(value) {
  return value ? 1 : 0
}

function buildSql() {
  const lines = ["BEGIN TRANSACTION;"]

  const categories = Array.from(
    new Set(PRODUCTS.map((product) => product.category))
  ).map((slug, index) => ({
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug,
    description: "",
    sortOrder: index,
  }))

  for (const category of categories) {
    lines.push(`
INSERT INTO categories (name, slug, description, sort_order, is_active)
SELECT '${escapeSql(category.name)}', '${escapeSql(category.slug)}', '${escapeSql(category.description)}', ${category.sortOrder}, 1
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = '${escapeSql(category.slug)}'
);`)
  }

  for (const product of PRODUCTS) {
    lines.push(`
INSERT INTO products (
  slug, title, category, short_description, description, price_cents, currency,
  lead_time_days, care_notes, sizing_notes, customization_notes, availability_label,
  is_featured, is_customizable, status
)
SELECT
  '${escapeSql(product.slug)}',
  '${escapeSql(product.title)}',
  '${escapeSql(product.category)}',
  '${escapeSql(product.shortDescription)}',
  '${escapeSql(product.description)}',
  ${Math.round(product.price * 100)},
  '${escapeSql(product.currency || "USD")}',
  ${product.leadDays},
  '${escapeSql(product.careNotes)}',
  '${escapeSql(product.fitNotes)}',
  '${escapeSql(product.customizationNotes)}',
  '${escapeSql(product.availability)}',
  ${boolSql(product.isFeatured)},
  ${boolSql(product.isCustomizable ?? true)},
  '${escapeSql(product.status || "active")}'
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE slug = '${escapeSql(product.slug)}'
);`)

    for (const [index, image] of product.images.entries()) {
      lines.push(`
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT p.id, '${escapeSql(image.src)}', '${escapeSql(image.alt)}', ${index}, ${boolSql(
        image.isPrimary ?? index === 0
      )}
FROM products p
WHERE p.slug = '${escapeSql(product.slug)}'
  AND NOT EXISTS (
    SELECT 1 FROM product_images pi
    WHERE pi.product_id = p.id AND pi.image_url = '${escapeSql(image.src)}'
  );`)
    }
  }

  for (const item of galleryItems) {
    lines.push(`
INSERT INTO gallery_items (
  title, slug, description, image_url, alt_text, tag, related_product_slug, is_featured,
  sort_order, status
)
SELECT
  '${escapeSql(item.title)}',
  '${escapeSql(item.slug)}',
  '${escapeSql(item.description)}',
  '${escapeSql(item.image)}',
  '${escapeSql(item.alt)}',
  '${escapeSql(item.tag)}',
  '${escapeSql(item.relatedProductSlug || "")}',
  ${boolSql(item.isFeatured)},
  ${item.sortOrder ?? 0},
  '${escapeSql(item.status || "active")}'
WHERE NOT EXISTS (
  SELECT 1 FROM gallery_items WHERE slug = '${escapeSql(item.slug)}'
);`)
  }

  for (const item of testimonials) {
    lines.push(`
INSERT INTO testimonials (
  name, location, quote, product_context, rating, is_featured, is_approved, sort_order
)
SELECT
  '${escapeSql(item.name)}',
  '${escapeSql(item.location || "")}',
  '${escapeSql(item.quote)}',
  '${escapeSql(item.productContext || "")}',
  ${item.rating || 5},
  ${boolSql(item.isFeatured)},
  ${boolSql(item.isApproved)},
  ${item.sortOrder ?? 0}
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials
  WHERE name = '${escapeSql(item.name)}' AND quote = '${escapeSql(item.quote)}'
);`)
  }

  for (const [key, value] of Object.entries(staticSiteSettings)) {
    lines.push(`
INSERT INTO site_settings (key, value_json, updated_at)
SELECT '${escapeSql(key)}', '${escapeSql(JSON.stringify(value))}', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE key = '${escapeSql(key)}'
);`)
  }

  lines.push("COMMIT;")
  return lines.join("\n")
}

fs.mkdirSync(tempDir, { recursive: true })
fs.writeFileSync(tempFile, buildSql(), "utf8")

const seedCommand = `npx wrangler d1 execute ${databaseName} ${mode} --file="${tempFile}"`
execSync(seedCommand, { stdio: "inherit" })

console.log("")
console.log("Seed complete.")
console.log(`Products attempted: ${PRODUCTS.length}`)
console.log(`Gallery items attempted: ${galleryItems.length}`)
console.log(`Testimonials attempted: ${testimonials.length}`)
console.log(`Site settings attempted: ${Object.keys(staticSiteSettings).length}`)
