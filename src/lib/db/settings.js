import { all, jsonValue, run } from "@/lib/db/d1"

export async function fetchSiteSettingsFromDb(db) {
  const rows = await all(db, `SELECT * FROM site_settings ORDER BY key ASC`)
  const settings = {}

  for (const row of rows) {
    settings[row.key] = jsonValue(row.value_json, row.value_json)
  }

  return settings
}

export async function saveSiteSettingsToDb(db, settings) {
  for (const [key, value] of Object.entries(settings)) {
    await run(
      db,
      `
        INSERT INTO site_settings (key, value_json, updated_at)
        VALUES (?1, ?2, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE
        SET value_json = excluded.value_json,
            updated_at = CURRENT_TIMESTAMP
      `,
      [key, JSON.stringify(value)]
    )
  }
}
