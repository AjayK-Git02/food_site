# 🚀 Cloud Kitchen - Supabase Setup Guide

This guide will help you set up the Supabase backend for your Cloud Kitchen website.

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- A Supabase account (free tier works perfectly)

---

## 🎯 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: Cloud Kitchen
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click **"Create new project"**
6. Wait for project initialization (2-3 minutes)

---

## 🗄️ Step 2: Create Database Tables

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **"Run"** button
6. You should see: **"Success. No rows returned"**

This creates:
- ✅ `days` table (7 days of the week)
- ✅ `foods` table (all food items)
- ✅ `site_settings` table (website configuration)
- ✅ Row Level Security policies
- ✅ Auto-update triggers

---

## 📁 Step 3: Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `food-images`
   - **Public bucket**: ✅ **YES** (toggle ON)
4. Click **"Create bucket"**

### Configure Bucket Policies

1. Click on the `food-images` bucket
2. Go to **"Policies"** tab
3. Add this policy for uploads:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'food-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
USING (bucket_id = 'food-images');
```

---

## 🔑 Step 4: Get API Credentials

1. Go to **Project Settings** (gear icon, bottom left)
2. Click **"API"** section
3. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc...your-key-here
```

---

## ⚙️ Step 5: Configure Next.js App

1. In your project root, create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace with your actual values from Step 4

---

## 👤 Step 6: Create Admin User

1. Go to **Authentication** > **Users** (in Supabase dashboard)
2. Click **"Add user"** > **"Create new user"**
3. Fill in:
   - **Email**: admin@cloudkitchen.com (or your email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ YES
4. Click **"Create user"**

---

## ▶️ Step 7: Run Your App

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Step 8: Test the Application

### Public Pages
1. **Home Page**: See weekly menu grid
2. **Click on a day**: View foods for that day
3. **Click on a food**: See details and WhatsApp button

### Admin Panel
1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. **Demo Login**:
   - Email: `admin@cloudkitchen.com`
   - Password: `admin123`
   
   **OR use Supabase Auth** (when configured):
   - Email: Your Supabase user email
   - Password: Your Supabase user password

3. Test admin features:
   - ➕ Add new food items
   - 📅 Manage menu (edit/delete)
   - ⚙️ Update site settings

---

## 📝 Optional: Add Sample Data

Uncomment the sample data section at the bottom of `schema.sql` and run it in SQL Editor to populate with test foods.

---

## 🐛 Troubleshooting

### "Invalid API key" error
- Check `.env.local` file has correct credentials
- Restart dev server: `npm run dev`

### Images not uploading
- Verify `food-images` bucket is PUBLIC
- Check storage policies are applied

### Can't login to admin
- Verify user exists in Authentication > Users
- Try demo login first (admin@cloudkitchen.com / admin123)

### Database connection issues
- Check Supabase project is active (not paused)
- Verify SQL schema was executed successfully

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production
Add these in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

## 🔒 Security Notes

1. **Never commit** `.env.local` to Git
2. Use Supabase **Row Level Security** (already configured)
3. For production, update RLS policies to be more restrictive
4. Consider adding admin role checking in RLS policies

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Ran schema.sql
- [ ] Created food-images bucket
- [ ] Configured .env.local
- [ ] Created admin user
- [ ] Tested app locally
- [ ] Added sample data (optional)

---

**🎉 You're all set! Your Cloud Kitchen is ready to serve!**
