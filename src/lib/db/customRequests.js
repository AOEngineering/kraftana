import { all, first, run } from "@/lib/db/d1"

function parseSnapshot(value) {
  if (!value || typeof value !== "string") return {}
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

function formatText(value, fallback = "") {
  return typeof value === "string" ? value : fallback
}

async function hasCustomRequestColumn(db, name) {
  if (!db || !name) return false
  const rows = await all(db, `PRAGMA table_info(custom_requests)`)
  return rows.some((row) => String(row.name || "").toLowerCase() === String(name).toLowerCase())
}

function normalizeYarnSelection(row) {
  if (!row) return null

  return {
    id: row.id,
    orderId: Number(row.order_id || 0),
    yarnId: row.yarn_id || "",
    brand: row.yarn_brand || "",
    line: row.yarn_line || "",
    code: row.yarn_code || "",
    name: row.yarn_name || "",
    hex: row.yarn_hex || "#ffffff",
    image: row.yarn_image || "",
    qty: Number(row.qty || 1),
    createdAt: row.created_at,
    snapshot: parseSnapshot(row.snapshot_json),
  }
}

async function hasCustomRequestYarnTable(db) {
  try {
    const tableRow = await first(
      db,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='custom_request_yarns'`
    )
    return Boolean(tableRow?.name)
  } catch {
    return false
  }
}

async function loadYarnsForRequestIds(db, requestIds = []) {
  if (!requestIds.length) return new Map()

  const placeholders = requestIds.map((_, index) => `?${index + 1}`).join(",")
  const rows = await all(
    db,
    `SELECT * FROM custom_request_yarns WHERE order_id IN (${placeholders}) ORDER BY created_at DESC`,
    requestIds
  )

  return rows.reduce((acc, row) => {
    const normalized = normalizeYarnSelection(row)
    if (!normalized) return acc
    if (!acc.has(normalized.orderId)) acc.set(normalized.orderId, [])
    acc.get(normalized.orderId).push(normalized)
    return acc
  }, new Map())
}

function normalizeCustomRequest(row, selections = []) {
  if (!row) return null
  return {
    id: row.id,
    requestNumber: row.request_number,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    itemType: row.item_type || "",
    sizeText: row.size_text || "",
    budgetCents: Number(row.budget_cents || 0),
    deadline: row.deadline || "",
    paletteNotes: row.palette_notes || "",
    personalization: row.personalization || "",
    message: row.message || "",
    requestedProductSlug: row.requested_product_slug || "",
    status: row.status || "new",
    adminNotes: row.admin_notes || "",
    shippingAddress: {
      line1: row.shipping_address_line1 || "",
      line2: row.shipping_address_line2 || "",
      city: row.shipping_city || "",
      state: row.shipping_state || "",
      postalCode: row.shipping_postal_code || "",
      country: row.shipping_country || "",
    },
    category: row.category || "",
    guideProduct: row.guide_product_slug || "",
    customItemText: row.custom_item_text || "",
    selectedYarns: selections,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function sanitizeYarnSelection(selection) {
  return {
    yarn_id: String(selection.yarnId || ""),
    yarn_brand: String(selection.brand || ""),
    yarn_line: String(selection.line || ""),
    yarn_code: String(selection.code || ""),
    yarn_name: String(selection.name || ""),
    yarn_hex: String(selection.hex || "#ffffff"),
    yarn_image: String(selection.image || ""),
    qty: Number(selection.qty || 1),
    snapshot_json: JSON.stringify(
      selection.snapshot || {
        id: selection.yarnId || "",
        brand: selection.brand || "",
        line: selection.line || "",
        code: selection.code || "",
        name: selection.name || "",
        hex: selection.hex || "#ffffff",
      }
    ),
  }
}

export async function fetchCustomRequestsFromDb(db, { status = "all" } = {}) {
  const rows = await all(
    db,
    `
      SELECT *
      FROM custom_requests
      WHERE (?1 = 'all' OR status = ?1)
      ORDER BY created_at DESC
    `,
    [status]
  )

  const requests = rows.map((row) => normalizeCustomRequest(row, []))

  if (!(await hasCustomRequestYarnTable(db))) return requests

  const selectionsByRequest = await loadYarnsForRequestIds(
    db,
    requests.map((request) => request.id)
  )

  return requests.map((request) => ({
    ...request,
    selectedYarns: selectionsByRequest.get(request.id) || [],
  }))
}

export async function fetchCustomRequestByIdFromDb(db, id) {
  const row = await first(db, `SELECT * FROM custom_requests WHERE id = ?1`, [id])
  const request = normalizeCustomRequest(row, [])
  if (!request) return null

  if (!(await hasCustomRequestYarnTable(db))) return request

  const selectionsByRequest = await loadYarnsForRequestIds(db, [request.id])
  return {
    ...request,
    selectedYarns: selectionsByRequest.get(request.id) || [],
  }
}

export async function createCustomRequestInDb(db, payload) {
  const columns = [
    "request_number",
    "name",
    "email",
    "phone",
    "item_type",
    "size_text",
    "budget_cents",
    "deadline",
    "palette_notes",
    "personalization",
    "message",
    "requested_product_slug",
    "status",
    "shipping_address_line1",
    "shipping_address_line2",
    "shipping_city",
    "shipping_state",
    "shipping_postal_code",
    "shipping_country",
  ]
  const values = [
    payload.requestNumber,
    formatText(payload.name),
    formatText(payload.email),
    payload.phone || "",
    formatText(payload.itemType),
    payload.sizeText,
    payload.budgetCents,
    payload.deadline || "",
    payload.paletteNotes || "",
    payload.personalization || "",
    formatText(payload.message),
    payload.requestedProductSlug || "",
    payload.status || "new",
    payload.shippingAddressLine1 || "",
    payload.shippingAddressLine2 || "",
    payload.shippingCity || "",
    payload.shippingState || "",
    payload.shippingPostalCode || "",
    payload.shippingCountry || "United States",
  ]

  const hasCategoryColumn = await hasCustomRequestColumn(db, "category")
  const hasGuideColumn = await hasCustomRequestColumn(db, "guide_product_slug")
  const hasCustomItemColumn = await hasCustomRequestColumn(db, "custom_item_text")

  if (hasCategoryColumn && hasGuideColumn && hasCustomItemColumn) {
    columns.push("category", "guide_product_slug", "custom_item_text")
    values.push(
      formatText(payload.category),
      formatText(payload.guideProduct),
      formatText(payload.customItemText)
    )
  }

  const placeholders = columns.map((_, index) => `?${index + 1}`).join(", ")
  const result = await run(
    db,
    `
      INSERT INTO custom_requests (
        ${columns.join(", ")}
      )
      VALUES (${placeholders})
    `,
    values
  )

  return fetchCustomRequestByIdFromDb(db, Number(result.meta.last_row_id))
}

export async function createCustomRequestYarnSelectionsInDb(db, requestId, selections = []) {
  if (!requestId || !selections.length) return []

  const hasTable = await hasCustomRequestYarnTable(db)
  if (!hasTable) return []

  const insertedRows = []
  for (const selection of selections) {
    const item = sanitizeYarnSelection(selection)
    const result = await run(
      db,
      `
        INSERT INTO custom_request_yarns (
          order_id, yarn_id, yarn_brand, yarn_line, yarn_code,
          yarn_name, yarn_hex, yarn_image, qty, snapshot_json
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      `,
      [
        requestId,
        item.yarn_id,
        item.yarn_brand,
        item.yarn_line,
        item.yarn_code,
        item.yarn_name,
        item.yarn_hex,
        item.yarn_image,
        item.qty,
        item.snapshot_json,
      ]
    )
    insertedRows.push(result?.meta?.last_row_id || null)
  }

  return insertedRows.filter(Boolean)
}

export function buildYarnSelectionPayloadFromIds(
  yarnCatalog = [],
  selectedYarnIds = [],
  qty = 1,
  allowDuplicateYarns = false
) {
  const normalizedIds = Array.isArray(selectedYarnIds) ? selectedYarnIds.filter(Boolean) : []
  const seen = new Set()

  const list = []

  for (const yarnId of normalizedIds) {
    if (!yarnId) continue
    if (!allowDuplicateYarns && seen.has(yarnId)) continue
    seen.add(yarnId)

    const catalogItem = yarnCatalog.find((item) => item.id === yarnId)
    if (!catalogItem) continue

    list.push({
      yarnId: catalogItem.id,
      brand: catalogItem.brand || "Hobbii",
      line: catalogItem.line || "",
      code: catalogItem.code || "",
      name: catalogItem.name || "",
      hex: catalogItem.hex || "#ffffff",
      image: catalogItem.image || "",
      qty,
      snapshot: {
        id: catalogItem.id,
        brand: catalogItem.brand || "Hobbii",
        line: catalogItem.line || "",
        code: catalogItem.code || "",
        name: catalogItem.name || "",
        hex: catalogItem.hex || "#ffffff",
        rgb: catalogItem.rgb || null,
        color_family: catalogItem.color_family || "",
        undertone: catalogItem.undertone || "",
        fiber: catalogItem.fiber || "",
        weight: catalogItem.weight || "",
        texture: catalogItem.texture || "",
        washable: Boolean(catalogItem.washable),
        tags: catalogItem.tags || [],
      },
    })
  }

  return list
}

export async function updateCustomRequestInDb(db, id, { status, adminNotes }) {
  await run(
    db,
    `
      UPDATE custom_requests
      SET status = COALESCE(?2, status),
          admin_notes = COALESCE(?3, admin_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?1
    `,
    [id, status ?? null, adminNotes ?? null]
  )
}
