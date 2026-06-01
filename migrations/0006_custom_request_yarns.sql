ALTER TABLE custom_requests
ADD COLUMN category TEXT NOT NULL DEFAULT '';

ALTER TABLE custom_requests
ADD COLUMN guide_product_slug TEXT NOT NULL DEFAULT '';

ALTER TABLE custom_requests
ADD COLUMN custom_item_text TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS custom_request_yarns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  yarn_id TEXT NOT NULL,
  yarn_brand TEXT NOT NULL,
  yarn_line TEXT NOT NULL,
  yarn_code TEXT NOT NULL,
  yarn_name TEXT NOT NULL,
  yarn_hex TEXT NOT NULL,
  yarn_image TEXT NOT NULL DEFAULT '',
  qty INTEGER NOT NULL DEFAULT 1,
  snapshot_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES custom_requests(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_custom_request_yarns_order_id
ON custom_request_yarns (order_id);
