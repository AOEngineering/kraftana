import { first, getRequiredDb, getServerEnv } from "@/lib/db/d1"

export async function getAdminSetupError() {
  try {
    const db = getRequiredDb(getServerEnv())
    const [productsTable, mediaTable] = await Promise.all([
      first(db, `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'products'`),
      first(db, `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'media_assets'`),
    ])

    if (!productsTable || !mediaTable) {
      return "D1 is connected, but migrations have not been applied yet."
    }

    return null
  } catch (error) {
    return error instanceof Error ? error.message : "D1 is not configured."
  }
}
