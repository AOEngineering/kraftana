-- Kraftana product guides and custom order sizing data
-- Suggested filename: migrations/0003_product_guides.sql
-- Purpose:
--   Adds custom order guide tables and seeds Kevonne's handwritten guide data.
--   These guides power the simplified custom order form:
--   item, size, colors, contact.
--
-- Notes:
--   Shop products are still separate from product guides.
--   Product guides do not require photos.
--   This file is safe to run more than once.

CREATE TABLE IF NOT EXISTS product_guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  max_colors INTEGER,
  yarn_json TEXT,
  color_notes TEXT,
  size_notes TEXT,
  timing_notes TEXT,
  customer_prompt TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_guide_sizes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_slug TEXT NOT NULL,
  label TEXT NOT NULL,
  measurements_json TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_slug) REFERENCES product_guides(slug)
);

CREATE INDEX IF NOT EXISTS idx_product_guides_active_sort
ON product_guides(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_product_guide_sizes_guide_sort
ON product_guide_sizes(guide_slug, sort_order);

INSERT INTO product_guides (
  slug,
  title,
  category,
  max_colors,
  yarn_json,
  color_notes,
  size_notes,
  timing_notes,
  customer_prompt,
  is_active,
  sort_order
)
VALUES
(
  'cat-ear-beanie',
  'Cat Ear Beanie',
  'Beanies',
  2,
  '["Hobbii Amigo"]',
  'Up to 2 colors.',
  'Choose child or adult sizing by head measurement.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What colors would you like for your cat ear beanie?',
  1,
  10
),
(
  'scarf',
  'Scarf',
  'Accessories',
  3,
  '["Hobbii Baby Cotton Organic Mercerized"]',
  'Up to 3 colors.',
  'Choose toddler, child, or adult sizing.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What colors would you like for your scarf?',
  1,
  20
),
(
  'granny-square-skirt',
  'Granny Square Skirt',
  'Skirts',
  4,
  '["Hobbii Rainbow Cotton 8/8"]',
  'Long skirt, up to 4 colors plus main color. Short skirt, up to 3 colors plus main color.',
  'Choose size by waist and preferred length.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'Would you like a long or short skirt, and what colors do you want?',
  1,
  30
),
(
  'high-neck-granny-halter',
  'High Neck Granny Halter',
  'Tops',
  5,
  '["Hobbii Twister Solid"]',
  'Up to 5 colors.',
  'Choose size by cup guide. Contact if a larger cup size is needed.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What colors would you like for your halter?',
  1,
  40
),
(
  'granny-square-crop-sweater-vest',
  'Granny Square Crop Sweater Vest',
  'Tops',
  4,
  '["Hobbii Twister Solid"]',
  'Up to 4 colors.',
  'Choose size by cup guide.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What colors would you like for your crop sweater vest?',
  1,
  50
),
(
  'blanket',
  'Blanket',
  'Home',
  NULL,
  '[]',
  'Color count depends on design.',
  'Choose blanket size by dimensions.',
  'Blankets may take longer depending on size and color count.',
  'What size blanket and colors would you like?',
  1,
  60
),
(
  'granny-twister-cardigan',
  'Granny Twister Cardigan',
  'Cardigans',
  NULL,
  '["Hobbii Sunbird, main color","Hobbii Twister Solid, border"]',
  'Main color plus border color.',
  'One size.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What main color and border color would you like?',
  1,
  70
),
(
  'granny-hexagon-cardigan',
  'Granny Hexagon Cardigan',
  'Cardigans',
  4,
  '["Hobbii Twister Solid","Hobbii Horizon, main color","Hobbii Kind Feather, border"]',
  'Up to 4 colors. Buttons optional. Hood optional.',
  'Choose size by torso and arm circumference. Arm length values after size S need confirmation.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What colors would you like, and do you want buttons or a hood?',
  1,
  80
),
(
  'granny-stitch-shorts',
  'Granny Stitch Shorts',
  'Shorts',
  4,
  '["Hobbii Twister Solid"]',
  'Up to 4 colors.',
  'Choose size by waist, hip, and length guide.',
  'Please allow 2 weeks for yarn shipment and an additional 1 to 2 weeks for creation.',
  'What colors would you like for your shorts?',
  1,
  90
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  category = excluded.category,
  max_colors = excluded.max_colors,
  yarn_json = excluded.yarn_json,
  color_notes = excluded.color_notes,
  size_notes = excluded.size_notes,
  timing_notes = excluded.timing_notes,
  customer_prompt = excluded.customer_prompt,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = CURRENT_TIMESTAMP;

DELETE FROM product_guide_sizes
WHERE guide_slug IN (
  'cat-ear-beanie',
  'scarf',
  'granny-square-skirt',
  'high-neck-granny-halter',
  'granny-square-crop-sweater-vest',
  'blanket',
  'granny-twister-cardigan',
  'granny-hexagon-cardigan',
  'granny-stitch-shorts'
);

INSERT INTO product_guide_sizes (
  guide_slug,
  label,
  measurements_json,
  sort_order
)
VALUES
('cat-ear-beanie', 'Child Small', '{"head":"19 in"}', 10),
('cat-ear-beanie', 'Child Medium', '{"head":"20 in"}', 20),
('cat-ear-beanie', 'Child Large', '{"head":"21 in"}', 30),
('cat-ear-beanie', 'Adult Small', '{"head":"22 in"}', 40),
('cat-ear-beanie', 'Adult Medium', '{"head":"23 in"}', 50),
('cat-ear-beanie', 'Adult Large', '{"head":"24 in"}', 60),
('cat-ear-beanie', 'Adult Extra Large', '{"head":"25 in"}', 70),

('scarf', 'Toddler', '{}', 10),
('scarf', 'Child', '{}', 20),
('scarf', 'Adult', '{}', 30),

('granny-square-skirt', 'XS', '{"waist":"22 to 23 in","longLength":"36 to 38 in","shortLength":"18 to 20 in"}', 10),
('granny-square-skirt', 'S', '{"waist":"24 to 25 in","longLength":"37 to 39 in","shortLength":"19 to 21 in"}', 20),
('granny-square-skirt', 'M', '{"waist":"26 to 28 in","longLength":"38 to 40 in","shortLength":"20 to 22 in"}', 30),
('granny-square-skirt', 'L', '{"waist":"29 to 31 in","longLength":"39 to 41 in","shortLength":"21 to 23 in"}', 40),
('granny-square-skirt', 'XL', '{"waist":"32 to 34 in","longLength":"40 to 42 in","shortLength":"22 to 24 in"}', 50),
('granny-square-skirt', 'XXL', '{"waist":"35 to 38 in","longLength":"41 to 43 in","shortLength":"23 to 25 in"}', 60),

('high-neck-granny-halter', 'XS', '{"cup":"A"}', 10),
('high-neck-granny-halter', 'S', '{"cup":"B"}', 20),
('high-neck-granny-halter', 'M', '{"cup":"C"}', 30),
('high-neck-granny-halter', 'L', '{"cup":"D"}', 40),
('high-neck-granny-halter', 'XL', '{"cup":"E"}', 50),
('high-neck-granny-halter', 'Larger cup needed', '{"note":"Contact if a larger cup size is needed"}', 60),

('granny-square-crop-sweater-vest', 'S', '{"cup":"A"}', 10),
('granny-square-crop-sweater-vest', 'M', '{"cup":"B"}', 20),
('granny-square-crop-sweater-vest', 'L', '{"cup":"C"}', 30),
('granny-square-crop-sweater-vest', 'XL', '{"cup":"D plus"}', 40),

('blanket', 'Lap', '{"dimensions":"36 x 49 in"}', 10),
('blanket', 'Small Throw', '{"dimensions":"48 x 60 in"}', 20),
('blanket', 'Standard Throw', '{"dimensions":"52 x 60 in"}', 30),
('blanket', 'Large Throw', '{"dimensions":"60 x 72 in"}', 40),
('blanket', 'Single or Twin', '{"dimensions":"66 x 96 in"}', 50),
('blanket', 'Double', '{"dimensions":"80 x 90 in"}', 60),
('blanket', 'Queen', '{"dimensions":"90 x 100 in"}', 70),
('blanket', 'King', '{"dimensions":"108 x 100 in"}', 80),

('granny-twister-cardigan', 'One Size', '{}', 10),

('granny-hexagon-cardigan', 'S', '{"armLength":"20 in","torsoCircumference":"20 in","armCircumference":"8 in"}', 10),
('granny-hexagon-cardigan', 'M', '{"torsoCircumference":"22 in","armCircumference":"9 in"}', 20),
('granny-hexagon-cardigan', 'L', '{"torsoCircumference":"24 in","armCircumference":"10 in"}', 30),
('granny-hexagon-cardigan', 'XL', '{"torsoCircumference":"26 in","armCircumference":"11 in"}', 40),
('granny-hexagon-cardigan', 'XXL', '{"torsoCircumference":"28 in","armCircumference":"12 in"}', 50),
('granny-hexagon-cardigan', 'XXXL', '{"torsoCircumference":"30 in","armCircumference":"13 in"}', 60),

('granny-stitch-shorts', 'XS', '{"waistCircumference":"25 in","hipCircumference":"32 in","length":"13 in"}', 10),
('granny-stitch-shorts', 'S', '{"waistCircumference":"27 in","hipCircumference":"34 in","length":"14 in"}', 20),
('granny-stitch-shorts', 'M', '{"waistCircumference":"28 in","hipCircumference":"37 in","length":"14 in"}', 30),
('granny-stitch-shorts', 'L', '{"waistCircumference":"30 in","hipCircumference":"39 in","length":"14 in"}', 40),
('granny-stitch-shorts', 'XL', '{"waistCircumference":"32 in","hipCircumference":"42 in","length":"16 in"}', 50),
('granny-stitch-shorts', 'XXL', '{"waistCircumference":"34 in","hipCircumference":"44 in","length":"16 in"}', 60);
