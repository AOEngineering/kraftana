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
- `npm run build` creates a production build in `dist/`.
- `npm run start` runs the production server on port `3000`.
- `npm run setup` copies this template into the sibling `projects/` directory and prompts for project-specific values.

## Git Hygiene

- Do not commit `dist/`, `node_modules/`, or local `.env*` files.
- Use `.env.example` to document required environment variables.
