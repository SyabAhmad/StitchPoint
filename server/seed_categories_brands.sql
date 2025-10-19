-- Seed Data for Categories and Brands
-- Run this after migrations are executed

-- Insert Categories
INSERT INTO categories (id, name, description, image_url, is_active, created_at) 
VALUES 
  ('cat-001', 'Women', 'Women fashion and clothing', NULL, true, NOW()),
  ('cat-002', 'Men', 'Men fashion and clothing', NULL, true, NOW()),
  ('cat-003', 'Accessories', 'Fashion accessories and jewels', NULL, true, NOW()),
  ('cat-004', 'Shoes', 'Footwear and shoes', NULL, true, NOW()),
  ('cat-005', 'Bags', 'Handbags and luggage', NULL, true, NOW()),
  ('cat-006', 'Traditional', 'Traditional and ethnic wear', NULL, true, NOW());

-- Insert Brands
INSERT INTO brands (id, name, description, logo_url, website, is_active, created_at)
VALUES
  ('brand-001', 'Naqosh Couture', 'Premium luxury couture brand', NULL, 'https://naqosh.com', true, NOW()),
  ('brand-002', 'Elite Collection', 'Exclusive designer collection', NULL, 'https://elitecollection.com', true, NOW()),
  ('brand-003', 'Luxury Line', 'High-end fashion line', NULL, 'https://luxuryline.com', true, NOW()),
  ('brand-004', 'Premium Essentials', 'Premium everyday wear', NULL, 'https://premiumessentials.com', true, NOW()),
  ('brand-005', 'Designer Plus', 'Contemporary designer wear', NULL, 'https://designerplus.com', true, NOW()),
  ('brand-006', 'Couture Palace', 'Royal couture designs', NULL, 'https://couturepalace.com', true, NOW());

-- Verify inserts
SELECT 'Categories:' as type, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Brands:' as type, COUNT(*) as count FROM brands;
