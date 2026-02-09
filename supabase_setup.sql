-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create 'days' table
create table if not exists days (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  display_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create 'foods' table
create table if not exists foods (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  ingredients text[],
  day_id uuid references days(id) on delete set null,
  time_slot text not null,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create 'site_settings' table
create table if not exists site_settings (
  id uuid default uuid_generate_v4() primary key,
  kitchen_name text not null default 'Cloud Kitchen',
  tagline text,
  phone text,
  whatsapp_number text,
  address text,
  social_links jsonb default '{}'::jsonb,
  copyright text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table days enable row level security;
alter table foods enable row level security;
alter table site_settings enable row level security;

-- 5. Create Policies (Drop first to avoid errors if re-running)

-- Days Policies
drop policy if exists "Public read access for days" on days;
create policy "Public read access for days" 
  on days for select 
  using (true);

drop policy if exists "Admin full access for days" on days;
create policy "Admin full access for days" 
  on days for all 
  using (auth.role() = 'authenticated');

-- Foods Policies
drop policy if exists "Public read access for foods" on foods;
create policy "Public read access for foods" 
  on foods for select 
  using (true);

drop policy if exists "Admin full access for foods" on foods;
create policy "Admin full access for foods" 
  on foods for all 
  using (auth.role() = 'authenticated');

-- Site Settings Policies
drop policy if exists "Public read access for site_settings" on site_settings;
create policy "Public read access for site_settings" 
  on site_settings for select 
  using (true);

drop policy if exists "Admin full access for site_settings" on site_settings;
create policy "Admin full access for site_settings" 
  on site_settings for all 
  using (auth.role() = 'authenticated');


-- 6. Insert Initial Data

-- Insert Days
insert into days (name, display_order) values
('Monday', 1),
('Tuesday', 2),
('Wednesday', 3),
('Thursday', 4),
('Friday', 5),
('Saturday', 6),
('Sunday', 7)
on conflict do nothing;

-- Insert Default Site Settings
insert into site_settings (kitchen_name, tagline, phone, whatsapp_number, address, social_links, copyright)
select 
  'Cloud Kitchen',
  'Fresh Home-Cooked Meals',
  '+91 8102110031',
  '918102110031',
  '123 Food Street, Bangalore, India',
  '{"facebook": "", "instagram": "", "twitter": ""}'::jsonb,
  '© 2024 Cloud Kitchen. All rights reserved.'
where not exists (select 1 from site_settings);

-- 7. Storage Bucket Setup & Policies
-- Note: Manually create a public bucket named 'food-images' first if it doesn't exist.

drop policy if exists "Public read access for food-images" on storage.objects;
create policy "Public read access for food-images"
  on storage.objects for select
  using ( bucket_id = 'food-images' );

drop policy if exists "Admin upload access for food-images" on storage.objects;
create policy "Admin upload access for food-images"
  on storage.objects for insert
  with check ( bucket_id = 'food-images' and auth.role() = 'authenticated' );

drop policy if exists "Admin update access for food-images" on storage.objects;
create policy "Admin update access for food-images"
  on storage.objects for update
  using ( bucket_id = 'food-images' and auth.role() = 'authenticated' );

drop policy if exists "Admin delete access for food-images" on storage.objects;
create policy "Admin delete access for food-images"
  on storage.objects for delete
  using ( bucket_id = 'food-images' and auth.role() = 'authenticated' );
