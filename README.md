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
- `npm run build` creates a standard Next.js production build in `.next/`.
- `npm run start` runs the production server on port `3000`.
- `npm run preview` builds the app with OpenNext and previews it in the Cloudflare Workers runtime.
- `npm run deploy` builds the app with OpenNext and deploys it to Cloudflare Workers.
- `npm run upload` builds the app with OpenNext and uploads a new Cloudflare Workers version.
- `npm run cf-typegen` generates Worker binding types from `wrangler.jsonc`.
- `npm run setup` copies this template into the sibling `projects/` directory and prompts for project-specific values.

## Git Hygiene

- Do not commit `.next/`, `.open-next/`, `.wrangler/`, `node_modules/`, or local `.env*` files.
- Use `.env.example` to document required environment variables.

## Cloudflare Workers

This app is configured for OpenNext on Cloudflare Workers.

- `src/app/api/custom/route.js` forwards custom order submissions to `CUSTOM_ORDER_WEBHOOK_URL`.
- `functions/api/custom.js` is a Cloudflare Pages Functions fallback for the same `/api/custom` path.
- `src/lib/customOrderHandler.js` contains the shared validation and webhook delivery logic used by both runtimes.
- The webhook can be any HTTPS endpoint that accepts JSON, such as a lightweight email bridge or automation workflow.
- Local SQLite storage is intentionally not used because it is not compatible with the Cloudflare Workers runtime.
- Set `CUSTOM_ORDER_WEBHOOK_URL` before deploying, and optionally `CUSTOM_ORDER_WEBHOOK_AUTH_HEADER` if the upstream endpoint expects a bearer token or other Authorization header value.
- Inspiration uploads are preview-only in the browser. The form sends the file name and MIME type, not the image bytes, so the request stays small for Cloudflare Functions.
