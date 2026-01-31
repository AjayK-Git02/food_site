-- ================================================
-- CLOUD KITCHEN DATABASE SCHEMA
-- Supabase PostgreSQL Database Structure
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLE 1: DAYS
-- Stores the days of the week for menu organization
-- ================================================
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default daysnow 
INSERT INTO days (name, display_order) VALUES
  ('Monday', 1),
  ('Tuesday', 2),
  ('Wednesday', 3),
  ('Thursday', 4),
  ('Friday', 5),
  ('Saturday', 6),
  ('Sunday', 7);

-- ================================================
-- TABLE 2: FOODS
-- Stores all food items with details
-- ================================================
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id UUID REFERENCES days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  time_slot TEXT CHECK (time_slot IN ('morning', 'snacks', 'evening', 'dinner')),
  image_url TEXT,
  ingredients TEXT[],
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_foods_day_id ON foods(day_id);
CREATE INDEX idx_foods_time_slot ON foods(time_slot);
CREATE INDEX idx_foods_available ON foods(available);

-- ================================================
-- TABLE 3: SITE_SETTINGS
-- Stores site configuration and settings
-- ================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kitchen_name TEXT NOT NULL DEFAULT 'Cloud Kitchen',
  tagline TEXT DEFAULT 'Fresh Home-Cooked Meals',
  phone TEXT,
  whatsapp_number TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  address TEXT,
  copyright TEXT DEFAULT '© 2024 Cloud Kitchen. All rights reserved.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (kitchen_name, phone, whatsapp_number, address) VALUES
  ('Cloud Kitchen', '+91 8102110031', '918102110031', '123 Food Street, Bangalore, India');

-- ================================================
-- STORAGE BUCKET FOR FOOD IMAGES
-- ================================================
-- Run this in Supabase Storage UI or via API:
-- 1. Create a bucket named: food-images
-- 2. Set it to PUBLIC
-- 3. Add policy for uploads (authenticated users only)

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS (for all users)
CREATE POLICY "Allow public read access on days"
  ON days FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on foods"
  ON foods FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- ADMIN WRITE ACCESS (for authenticated users only)
CREATE POLICY "Allow authenticated users to insert foods"
  ON foods FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update foods"
  ON foods FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete foods"
  ON foods FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update settings"
  ON site_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for foods table
CREATE TRIGGER update_foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for site_settings table
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SAMPLE DATA (OPTIONAL)
-- Uncomment to add sample food items for testing
-- ================================================

/*
INSERT INTO foods (day_id, name, time_slot, description, ingredients, price, available) VALUES
  (
    (SELECT id FROM days WHERE name = 'Monday'),
    'Masala Dosa',
    'morning',
    'Crispy South Indian crepe filled with spiced potato filling, served with sambhar and coconut chutney.',
    ARRAY['Rice', 'Urad Dal', 'Potatoes', 'Onions', 'Green Chillies', 'Curry Leaves', 'Mustard Seeds'],
    80.00,
    true
  ),
  (
    (SELECT id FROM days WHERE name = 'Monday'),
    'Samosa',
    'snacks',
    'Deep-fried pastry with spiced potato and pea filling.',
    ARRAY['Flour', 'Potatoes', 'Peas', 'Spices'],
    30.00,
    true
  ),
  (
    (SELECT id FROM days WHERE name = 'Tuesday'),
    'Paneer Tikka',
    'evening',
    'Grilled cottage cheese marinated in spices and yogurt.',
    ARRAY['Paneer', 'Yogurt', 'Spices', 'Bell Peppers', 'Onions'],
    120.00,
    true
  ),
  (
    (SELECT id FROM days WHERE name = 'Wednesday'),
    'Dal Makhani',
    'dinner',
    'Creamy black lentils slow-cooked with butter and cream.',
    ARRAY['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes', 'Spices'],
    150.00,
    false
  );
*/

-- ================================================
-- DATABASE SETUP COMPLETE
-- ================================================
-- Next steps:
-- 1. Create a Supabase project at https://supabase.com
-- 2. Run this entire SQL script in the SQL Editor
-- 3. Create the 'food-images' storage bucket
-- 4. Copy your project URL and anon key to .env.local
-- 5. Start your Next.js app with: npm run dev
-- ================================================
