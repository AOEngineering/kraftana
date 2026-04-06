export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req) {
  try {
    const body = await req.json()

    // Try to use your existing db util if present
    let insertedId = null
    try {
      let getDb = null
      try {
        // If you already have /lib/db.(js|ts)
        const mod = await import("@/lib/db").catch(() => null)
        getDb = mod?.getDb || null
      } catch {}

      if (!getDb) {
        // Fallback: open a local sqlite if better-sqlite3 is available
        const Database = (await import("better-sqlite3").catch(() => null))?.default
        if (Database) {
          const db = new Database(process.env.SQLITE_PATH || "data/kraftana.db")
          db.pragma("journal_mode = WAL")
          db.exec(`
            CREATE TABLE IF NOT EXISTS custom_orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              created_at TEXT,
              name TEXT,
              email TEXT,
              item_type TEXT,
              size TEXT,
              colors TEXT,
              personalization TEXT,
              deadline TEXT,
              budget_cents INTEGER,
              message TEXT,
              deposit INTEGER,
              contact_ok INTEGER,
              inspiration_name TEXT,
              inspiration_type TEXT
            );
          `)
          const stmt = db.prepare(`
            INSERT INTO custom_orders
            (created_at, name, email, item_type, size, colors, personalization, deadline, budget_cents, message, deposit, contact_ok, inspiration_name, inspiration_type)
            VALUES (@created_at, @name, @email, @item_type, @size, @colors, @personalization, @deadline, @budget_cents, @message, @deposit, @contact_ok, @inspiration_name, @inspiration_type)
          `)
          const info = stmt.run({
            created_at: new Date().toISOString(),
            name: body.name || "",
            email: body.email || "",
            item_type: body.itemType || "",
            size: body.size || "",
            colors: body.colors || "",
            personalization: body.personalization || "",
            deadline: body.deadline || "",
            budget_cents: Math.round(Number(body.budget || 0) * 100),
            message: body.message || "",
            deposit: body.deposit ? 1 : 0,
            contact_ok: body.contactOk ? 1 : 0,
            inspiration_name: body.inspiration_name || null,
            inspiration_type: body.inspiration_type || null,
          })
          insertedId = info?.lastInsertRowid ?? null
        }
      } else {
        // Use provided db util
        const db = await getDb()
        await db.run(`
          CREATE TABLE IF NOT EXISTS custom_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT,
            name TEXT,
            email TEXT,
            item_type TEXT,
            size TEXT,
            colors TEXT,
            personalization TEXT,
            deadline TEXT,
            budget_cents INTEGER,
            message TEXT,
            deposit INTEGER,
            contact_ok INTEGER,
            inspiration_name TEXT,
            inspiration_type TEXT
          )
        `)
        const info = await db.run(
          `INSERT INTO custom_orders
          (created_at, name, email, item_type, size, colors, personalization, deadline, budget_cents, message, deposit, contact_ok, inspiration_name, inspiration_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            new Date().toISOString(),
            body.name || "",
            body.email || "",
            body.itemType || "",
            body.size || "",
            body.colors || "",
            body.personalization || "",
            body.deadline || "",
            Math.round(Number(body.budget || 0) * 100),
            body.message || "",
            body.deposit ? 1 : 0,
            body.contactOk ? 1 : 0,
            body.inspiration_name || null,
            body.inspiration_type || null,
          ]
        )
        insertedId = info?.lastID ?? null
      }
    } catch (e) {
      // If db unavailable, we still succeed and you can wire it later
      console.warn("[custom] DB not available, skipping insert:", e?.message)
    }

    return new Response(JSON.stringify({ ok: true, id: insertedId }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "invalid_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    })
  }
}
