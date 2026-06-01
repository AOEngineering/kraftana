CREATE TABLE IF NOT EXISTS session_attribution (
  session_id TEXT PRIMARY KEY,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  landing_path TEXT NOT NULL DEFAULT '',
  first_referrer TEXT NOT NULL DEFAULT '',
  first_referrer_host TEXT NOT NULL DEFAULT '',
  first_channel TEXT NOT NULL DEFAULT 'direct',
  first_utm_source TEXT NOT NULL DEFAULT '',
  first_utm_medium TEXT NOT NULL DEFAULT '',
  first_utm_campaign TEXT NOT NULL DEFAULT '',
  first_utm_term TEXT NOT NULL DEFAULT '',
  first_utm_content TEXT NOT NULL DEFAULT '',
  latest_referrer TEXT NOT NULL DEFAULT '',
  latest_referrer_host TEXT NOT NULL DEFAULT '',
  latest_channel TEXT NOT NULL DEFAULT 'direct',
  latest_utm_source TEXT NOT NULL DEFAULT '',
  latest_utm_medium TEXT NOT NULL DEFAULT '',
  latest_utm_campaign TEXT NOT NULL DEFAULT '',
  latest_utm_term TEXT NOT NULL DEFAULT '',
  latest_utm_content TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS visit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  query_string TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  referrer_host TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'direct',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_term TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  device_type TEXT NOT NULL DEFAULT 'unknown',
  ip_hash TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  is_bot INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversion_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL DEFAULT '',
  conversion_type TEXT NOT NULL,
  source_page TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  referrer_host TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'direct',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_term TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_analytics_rollups (
  day TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  metric_value INTEGER NOT NULL DEFAULT 0,
  breakdown_key TEXT NOT NULL DEFAULT '',
  breakdown_value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, metric_key, breakdown_key, breakdown_value)
);

CREATE INDEX IF NOT EXISTS idx_visit_events_created_at ON visit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visit_events_path ON visit_events(path);
CREATE INDEX IF NOT EXISTS idx_visit_events_channel ON visit_events(channel);
CREATE INDEX IF NOT EXISTS idx_visit_events_referrer_host ON visit_events(referrer_host);
CREATE INDEX IF NOT EXISTS idx_visit_events_session_id ON visit_events(session_id);

CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_channel ON conversion_events(channel);
CREATE INDEX IF NOT EXISTS idx_conversion_events_session_id ON conversion_events(session_id);

