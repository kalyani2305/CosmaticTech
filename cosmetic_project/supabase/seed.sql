-- Seed categories
INSERT INTO categories (id, name, description) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Makeup', 'Lipsticks, foundations, eyeshadows, and more'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Skincare', 'Serums, moisturizers, toners, and cleansers'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Haircare', 'Shampoos, conditioners, serums, and treatments'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Fragrance', 'Perfumes and body mists')
ON CONFLICT (id) DO NOTHING;

-- Seed products (run after schema; category IDs must exist)
INSERT INTO products (name, description, ingredients, brand, price, category_id, images, stock, rating) VALUES
(
  'Hydrating Face Serum',
  'A lightweight, fast-absorbing serum with hyaluronic acid to lock in moisture and plump skin. Suitable for all skin types.',
  'Aqua, Hyaluronic Acid, Glycerin, Niacinamide, Vitamin E, Allantoin, Phenoxyethanol',
  'GlowLab',
  24.99,
  'a1b2c3d4-0002-4000-8000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1611930022073-7d27a3590bb3?w=400', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400'],
  150,
  4.6
),
(
  'Matte Liquid Lipstick',
  'Long-lasting matte liquid lipstick with rich pigment. Does not feather or transfer. Comfortable wear for up to 8 hours.',
  'Dimethicone, Bis-Diglyceryl Polyacyladipate-2, Diisostearyl Malate, Tocopherol, Caprylic/Capric Triglyceride',
  'Bella Rouge',
  16.50,
  'a1b2c3d4-0001-4000-8000-000000000001',
  ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'],
  200,
  4.4
),
(
  'Vitamin C Brightening Cream',
  'Daily moisturizer infused with 10% Vitamin C to brighten dull skin, reduce dark spots, and improve radiance.',
  'Water, Ascorbic Acid, Glycerin, Cetyl Alcohol, Shea Butter, Alpha Arbutin, Ferulic Acid',
  'PureGlow',
  34.99,
  'a1b2c3d4-0002-4000-8000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
  120,
  4.7
),
(
  'Rose Water Toner',
  'Soothing toner with natural rose water to balance pH, minimize pores, and refresh skin. Alcohol-free.',
  'Rosa Damascena Flower Water, Glycerin, Aloe Barbadensis Leaf Juice, Citric Acid, Sodium Benzoate',
  'Botanic Soul',
  14.99,
  'a1b2c3d4-0002-4000-8000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'],
  180,
  4.5
),
(
  'Luxury Floral Perfume',
  'Elegant floral fragrance with notes of jasmine, rose, and sandalwood. Long-lasting and perfect for daily wear.',
  'Alcohol Denat., Parfum, Aqua, Benzyl Benzoate, Citronellol, Geraniol, Linalool',
  'Luxe Scents',
  89.00,
  'a1b2c3d4-0004-4000-8000-000000000004',
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
  80,
  4.8
),
(
  'Argan Oil Hair Serum',
  'Nourishing hair serum with argan oil to tame frizz, add shine, and protect from heat. For all hair types.',
  'Cyclopentasiloxane, Argania Spinosa Kernel Oil, Dimethicone, Tocopherol, Sunflower Seed Extract',
  'HairLove',
  22.99,
  'a1b2c3d4-0003-4000-8000-000000000003',
  ARRAY['https://images.unsplash.com/photo-1522338243402-2f8c2e075b59?w=400'],
  140,
  4.6
),
(
  'Silk Finish Foundation',
  'Buildable medium-to-full coverage foundation with a natural silk finish. SPF 15. 24 shades available.',
  'Water, Dimethicone, Titanium Dioxide, Glycerin, Cyclopentasiloxane, Octinoxate',
  'Bella Rouge',
  42.00,
  'a1b2c3d4-0001-4000-8000-000000000001',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
  95,
  4.5
),
(
  'Overnight Repair Mask',
  'Intensive overnight mask with ceramides and peptides to repair and restore skin barrier while you sleep.',
  'Aqua, Glycerin, Ceramide NP, Palmitoyl Pentapeptide-4, Shea Butter, Squalane',
  'PureGlow',
  38.99,
  'a1b2c3d4-0002-4000-8000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1570194065650-d99fb2b2c736?w=400'],
  100,
  4.7
),
(
  'Volumizing Shampoo',
  'Sulfate-free shampoo that adds volume and body without weighing hair down. Enriched with biotin.',
  'Water, Cocamidopropyl Betaine, Glycerin, Biotin, Hydrolyzed Wheat Protein, Rosemary Extract',
  'HairLove',
  18.99,
  'a1b2c3d4-0003-4000-8000-000000000003',
  ARRAY['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400'],
  160,
  4.4
),
(
  'Fresh Citrus Eau de Toilette',
  'Light, refreshing unisex fragrance with bergamot, lemon, and white tea. Ideal for daytime.',
  'Alcohol Denat., Aqua, Parfum, Limonene, Citral, Linalool',
  'Luxe Scents',
  55.00,
  'a1b2c3d4-0004-4000-8000-000000000004',
  ARRAY['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'],
  90,
  4.5
);
