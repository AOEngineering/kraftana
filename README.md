# Kraftana

Next.js 15 application template for the Kraftana storefront project.

## Requirements

- Node.js 20+
- npm

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the example:

   ```bash
   Copy-Item .env.example .env.local
   ```

3. Fill in the values in `.env.local`.

4. Start the development server:

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` starts the Next.js development server.
- `npm run build` creates the OpenNext Cloudflare Worker output in `.open-next/`.
- `npm run build:next` creates a standard Next.js production build in `.next/`.
- `npm run start` runs the production server on port `3000`.
- `npm run preview` builds the app with OpenNext and previews it in the Cloudflare Workers runtime.
- `npm run deploy` builds the app with OpenNext and deploys it to Cloudflare Workers.
- `npm run upload` builds the app with OpenNext and uploads a new Cloudflare Workers version.
- `npm run cf-typegen` generates Worker binding types from `wrangler.jsonc`.
- `npm run db:migrate:local` applies local D1 migrations.
- `npm run db:migrate:remote` applies remote D1 migrations.
- `npm run db:seed:local` seeds local D1 from the current static Kraftana content.
- `npm run db:seed:remote` seeds remote D1 from the current static Kraftana content.
- `npm run setup` copies this template into the sibling `projects/` directory and prompts for project-specific values.

## Git Hygiene

- Do not commit `.next/`, `.open-next/`, `.wrangler/`, `node_modules/`, or local `.env*` files.
- Use `.env.example` to document required environment variables.

## Cloudflare Workers

This app is configured for OpenNext on Cloudflare Workers.

- `src/app/api/custom/route.js` forwards custom order submissions to `CUSTOM_ORDER_WEBHOOK_URL`.
- Public pages now use a D1-first, static-fallback data layer so the storefront keeps working during D1 setup.
- Admin routes require the `DB` D1 binding and never write to static files.
- `src/lib/customOrderHandler.js` contains the shared validation and webhook delivery logic used by the OpenNext route.
- The webhook can be any HTTPS endpoint that accepts JSON, such as a lightweight email bridge or automation workflow.
- Local SQLite storage is intentionally not used because it is not compatible with the Cloudflare Workers runtime.
- Set `CUSTOM_ORDER_WEBHOOK_URL` before deploying, and optionally `CUSTOM_ORDER_WEBHOOK_AUTH_HEADER` if the upstream endpoint expects a bearer token or other Authorization header value.
- Inspiration uploads are preview-only in the browser. The form sends the file name and MIME type, not the image bytes, so the request stays small for the Worker runtime.

## D1 And Admin Setup

The complete D1, admin, migration, seed, and fallback guide lives here:

- [docs/D1_ADMIN_SETUP.md](docs/D1_ADMIN_SETUP.md)

That guide now also includes the R2 image upload setup for the tablet-friendly admin workflow.

Typical local D1 flow:

```bash
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Typical local D1 + R2 prep:

```bash
npx wrangler d1 migrations apply kraftana --local
npx wrangler r2 bucket create kraftana-media
```
