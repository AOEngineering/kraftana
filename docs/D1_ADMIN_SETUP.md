# Kraftana D1, Admin, And R2 Setup

## 1. What Was Added

Kraftana now has:

- Cloudflare `D1` for products, gallery items, testimonials, requests, messages, feedback, settings, audit logs, and uploaded media records
- Cloudflare `R2` for uploaded image files
- custom order guide tables for handwritten sizing and yarn notes
- a protected admin area at `/admin`
- a static fallback layer for the public site

The public site is still protected during setup:

- it tries `D1` first
- if `D1` is missing, empty, not migrated, or errors, it falls back to the static content files
- visitors should not see database setup failures

The admin works differently:

- admin requires `D1`
- image uploads require `R2` and a public media base URL
- admin never writes to static files

Image storage is split cleanly:

- `D1` stores product and gallery records
- `R2` stores the actual uploaded image files
- `product_images` stores image URLs used by products
- `media_assets` tracks uploaded files and their public URLs

Custom order content is split cleanly too:

- shop products are public storefront items with photos, prices, and product pages
- product guides are custom-order references that power the simple request form
- product guides do not need photos to appear in the custom order dropdown

## 2. Required Cloudflare Pieces

You need:

- a Cloudflare account
- Wrangler available through `npx`
- one `D1` database
- one `R2` bucket for images
- a `DB` binding in `wrangler.jsonc`
- a `MEDIA_BUCKET` binding in `wrangler.jsonc`
- local migrations applied for local development
- seeded starter data if you want the admin to show content immediately

## 3. Required Environment Variables

Required:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MEDIA_BASE_URL`

Optional:

- `CUSTOM_ORDER_WEBHOOK_URL`
- `CUSTOM_ORDER_WEBHOOK_AUTH_HEADER`
- `CONTACT_FORM_WEBHOOK_URL`
- `CONTACT_FORM_WEBHOOK_AUTH_HEADER`
- `NEXT_PUBLIC_BASE_URL`

Notes:

- `NEXT_PUBLIC_SITE_URL` should be the public site URL for metadata and canonical links.
- `NEXT_PUBLIC_MEDIA_BASE_URL` must be the public URL prefix where uploaded R2 images are served.
- `NEXT_PUBLIC_BASE_URL` is still supported as a compatibility fallback.
- webhook URLs are optional if you only want D1 storage, but they are still useful for notifications and automations.

## 4. Create The D1 Database

Create the D1 database:

```bash
npx wrangler d1 create kraftana
```

Cloudflare will return a `database_id`.

Paste that into `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "kraftana",
    "database_id": "replace-with-your-d1-database-id"
  }
]
```

## 5. Create The R2 Bucket

Create the R2 bucket:

```bash
npx wrangler r2 bucket create kraftana-media
```

Add the bucket binding to `wrangler.jsonc`:

```jsonc
"r2_buckets": [
  {
    "binding": "MEDIA_BUCKET",
    "bucket_name": "kraftana-media"
  }
]
```

Important:

- the bucket name above is only an example
- do not paste account-specific URLs into the repo
- use your own public media URL in environment variables instead

## 6. Wrangler Binding Example

This repo uses `wrangler.jsonc`, not `wrangler.toml`.

Example:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "kraftana",
      "database_id": "replace-with-your-d1-database-id"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "kraftana-media"
    }
  ]
}
```

## 7. Run Migrations Locally

Apply local migrations:

```bash
npm run db:migrate:local
```

Equivalent direct command:

```bash
npx wrangler d1 migrations apply kraftana --local
```

This now applies both:

- the original content/admin schema
- the `media_assets` migration for uploads
- the `product_guides` and `product_guide_sizes` migration for custom order guides

## 8. Run Migrations Remotely

Apply remote migrations:

```bash
npm run db:migrate:remote
```

Equivalent direct command:

```bash
npx wrangler d1 migrations apply kraftana --remote
```

## 9. Seed Starter Data

Seed starter content into D1:

Local:

```bash
npm run db:seed:local
```

Remote:

```bash
npm run db:seed:remote
```

The seed imports the current static:

- products
- product images
- categories
- gallery items
- testimonials
- starter site settings

Product guides are different:

- the handwritten guide data is seeded directly by `migrations/0003_product_guides.sql`
- that migration is the source of truth for the guide schema and starter guide rows
- rerunning migrations is enough to restore the starter guide set

The seed is idempotent enough for setup:

- it avoids duplicate products by slug
- it avoids duplicate gallery items by slug
- it avoids duplicate settings by key
- it avoids duplicate product image rows for the same product image URL
- it preserves existing rows when it detects a matching starter record

After the seed runs, it prints a summary report.

## 10. Local Development Flow

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
Copy-Item .env.example .env.local
```

3. Set at minimum:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MEDIA_BASE_URL=https://replace-with-your-public-media-url/
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-me
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

4. Create D1 if needed:

```bash
npx wrangler d1 create kraftana
```

5. Create R2 if needed:

```bash
npx wrangler r2 bucket create kraftana-media
```

6. Confirm both bindings are in `wrangler.jsonc`.

7. Apply migrations:

```bash
npm run db:migrate:local
```

8. Seed D1:

```bash
npm run db:seed:local
```

9. Start the app:

```bash
npm run dev
```

10. Log in:

```text
http://localhost:3000/admin/login
```

11. Test the tablet flow:

- tap `Add new product`
- upload a photo
- enter title, category, price, lead time, and short description
- publish
- open `/shop`
- confirm the new product appears

12. Confirm fallback still works:

- temporarily remove or break the `DB` binding
- restart local dev
- confirm public pages still load from static fallback
- confirm `/admin` shows a setup warning instead of silently writing to files

## 11. Production Deployment Flow

1. Create the production D1 database:

```bash
npx wrangler d1 create kraftana
```

2. Create the production R2 bucket:

```bash
npx wrangler r2 bucket create kraftana-media
```

3. Update `wrangler.jsonc` with the real D1 `database_id`.

4. Confirm the R2 binding exists in `wrangler.jsonc`.

5. Set Cloudflare environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MEDIA_BASE_URL`
- optionally `CUSTOM_ORDER_WEBHOOK_URL`
- optionally `CUSTOM_ORDER_WEBHOOK_AUTH_HEADER`
- optionally `CONTACT_FORM_WEBHOOK_URL`
- optionally `CONTACT_FORM_WEBHOOK_AUTH_HEADER`

6. Apply remote migrations:

```bash
npm run db:migrate:remote
```

7. Seed production D1:

```bash
npm run db:seed:remote
```

8. Deploy:

```bash
npm run deploy
```

9. Test:

- `/shop`
- one product detail page
- `/gallery`
- `/custom`
- `/contact`
- `/admin/login`
- upload a photo from admin
- create a product and publish it
- create a gallery item

## 12. R2 Image Upload Setup

The admin image flow expects two things:

- the `MEDIA_BUCKET` R2 binding
- a public base URL in `NEXT_PUBLIC_MEDIA_BASE_URL`

Examples of what `NEXT_PUBLIC_MEDIA_BASE_URL` can point to:

- a custom R2 public domain
- a Cloudflare public bucket URL
- a future CDN/media domain

Behavior:

- uploaded image bytes go into `R2`
- upload metadata goes into `media_assets`
- product and gallery forms then save image URLs into `product_images` or `gallery_items`

If `MEDIA_BUCKET` is missing:

- the public site still works
- existing `/images/...` paths still work
- upload UI returns a setup error instead of pretending the upload worked

If `NEXT_PUBLIC_MEDIA_BASE_URL` is missing:

- upload UI returns a setup error
- the public site still works with existing static or already-saved URLs

## 13. Static Fallback Explanation

Public site behavior:

- public data helpers live in `src/lib/publicData.js`
- they try `D1` first
- if `D1` returns usable rows, the UI uses them
- if `D1` is missing, empty, or errors, the UI falls back to static content

Current public helpers:

- `getPublicProducts()`
- `getPublicProductBySlug(slug)`
- `getPublicGalleryItems()`
- `getPublicTestimonials()`
- `getPublicSiteSettings()`
- `getPublicProductGuides()`
- `getPublicProductGuideBySlug(slug)`
- `getProductGuideSizes(slug)`
- `getPublicFaqContent()`
- `getPublicPolicyContent()`

Admin behavior:

- admin requires `D1`
- image upload requires `R2`
- admin never writes to static files

Submission behavior:

- custom requests store in `D1` first when available
- contact messages store in `D1` first when available
- webhook forwarding is optional
- if neither `D1` nor webhook is available, the request fails honestly

Custom request simplification:

- the public custom order page is now intentionally short
- customers only answer:
  - what item they want
  - what size they want
  - what colors they want
  - how Kevonne should contact them
- extra notes are optional and collapsed
- budget, deadline, uploads, and longer intake questions are handled later if needed
- shipping address is collected up front so Kevonne can estimate shipping, handling, and taxes more accurately when she replies with a quote

## 14. How To Test Image Upload From A Tablet

1. Open `/admin/login` on the tablet.
2. Log in with the admin credentials.
3. Tap `Add new product`.
4. In the `Photos` section, tap `Choose photos`.
5. Pick a camera or photo-library image.
6. Tap `Upload to studio library`.
7. Confirm the preview card appears in the editor.
8. Fill out the quick-add fields.
9. Tap `Publish now`.
10. Open `/shop` and confirm the product appears with the uploaded image.

## 15. Troubleshooting

### D1 binding missing

Symptoms:

- public pages still work from static fallback
- admin shows a setup warning

Fix:

- add the `DB` binding to `wrangler.jsonc`
- confirm the `database_id` is correct

### R2 binding missing

Symptoms:

- admin login works
- uploads fail immediately
- existing public images still render

Fix:

- add the `MEDIA_BUCKET` binding to `wrangler.jsonc`
- create the R2 bucket if it does not exist

### Migrations not applied

Symptoms:

- admin pages show setup issues
- uploads fail when `media_assets` does not exist

Fix:

```bash
npm run db:migrate:local
```

or

```bash
npm run db:migrate:remote
```

### Admin login fails

Fix:

- confirm `ADMIN_USERNAME`
- confirm `ADMIN_PASSWORD`
- confirm `ADMIN_SESSION_SECRET`
- restart dev after changing env vars

### Seed creates no products

Fix:

- run migrations first
- confirm the `DB` binding is present
- rerun:

```bash
npm run db:seed:local
```

### Public site still showing static products

Possible reasons:

- `D1` binding is missing
- tables exist but there are no rows
- a query failed and fallback activated

Fix:

- run migrations
- run the seed
- confirm products exist in `D1`
- restart local dev

### Contact form not storing messages

Fix:

- confirm `D1` is configured and migrated
- if `D1` is unavailable, confirm `CONTACT_FORM_WEBHOOK_URL` is configured
- if both are missing, the form will return a friendly setup error

### Custom request webhook missing

Fix:

- `D1` alone is enough for storage
- webhook is optional
- if `D1` is missing too, the request cannot be accepted

### Product guide tables missing

Symptoms:

- `/custom` falls back to static guide data
- admin still works, but the public guide content is not reading from D1 yet

Fix:

```bash
npm run db:migrate:local
```

or

```bash
npm run db:migrate:remote
```

This applies `migrations/0003_product_guides.sql`, which creates the guide tables and seeds the handwritten data.

### Product guide data needs updating

Right now the starter guide set comes from `migrations/0003_product_guides.sql` and the static fallback file at `src/lib/productGuides.js`.

If Brandon updates Kevonne's handwritten guide notes:

1. update `migrations/0003_product_guides.sql`
2. update `src/lib/productGuides.js`
3. rerun migrations locally or remotely

This keeps D1 and the public fallback layer aligned.

### Uploads fail with a public URL error

Fix:

- set `NEXT_PUBLIC_MEDIA_BASE_URL`
- use a real public media URL prefix ending with `/` or a domain that can serve R2 files

### Cloudflare build succeeds but admin database or uploads fail

This usually means:

- the build itself is fine
- but the Worker environment is missing `DB`, `MEDIA_BUCKET`, or the required env vars

Check:

- `wrangler.jsonc`
- Cloudflare dashboard environment variables
- remote migration status
- whether the R2 bucket is public through your chosen media URL

### Local Windows or WSL Wrangler weirdness

OpenNext already warns about Windows runtime differences.

If local behavior feels inconsistent:

- prefer WSL for Cloudflare and OpenNext tooling
- rerun migrations in WSL
- rerun the seed in WSL
- confirm the bucket and env vars are visible in the same shell environment you use for `npm run dev`

## 16. Phase 3 Preview

Next should focus on workflow depth rather than more CMS breadth:

- improve custom request follow-up flow
- add email or admin notifications if helpful
- add richer request history and quoting notes
- optionally add safer R2 object deletion later
- keep Stripe for a later phase after the custom workflow feels solid

## 17. Product Guide Notes That Still Need Confirmation

Known handwritten data that still needs confirmation:

- Granny Hexagon Cardigan arm length values for `M` through `XXXL` are missing or unclear in the handwritten notes
- these custom order guides do not include product photos yet
- yarn availability may change over time and should become editable later in admin
