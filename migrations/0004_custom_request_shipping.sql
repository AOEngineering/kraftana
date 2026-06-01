ALTER TABLE custom_requests ADD COLUMN shipping_address_line1 TEXT NOT NULL DEFAULT '';
ALTER TABLE custom_requests ADD COLUMN shipping_address_line2 TEXT NOT NULL DEFAULT '';
ALTER TABLE custom_requests ADD COLUMN shipping_city TEXT NOT NULL DEFAULT '';
ALTER TABLE custom_requests ADD COLUMN shipping_state TEXT NOT NULL DEFAULT '';
ALTER TABLE custom_requests ADD COLUMN shipping_postal_code TEXT NOT NULL DEFAULT '';
ALTER TABLE custom_requests ADD COLUMN shipping_country TEXT NOT NULL DEFAULT 'United States';
