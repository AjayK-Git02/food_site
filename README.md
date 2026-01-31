# 🍽️ Cloud Kitchen - Food Ordering Platform

A modern, full-stack food ordering web application built with **Next.js** and **Supabase**. Features a customer-facing weekly menu and a complete admin panel for managing food items, settings, and orders.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## ✨ Features

### 🛍️ Customer Features
- **Weekly Menu Display** - Browse food items organized by day and time slot
- **Food Details** - View ingredients, descriptions, and pricing
- **WhatsApp Ordering** - One-click ordering via WhatsApp
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Modern UI** - Clean, professional design with smooth animations

### 🔐 Admin Panel
- **Secure Authentication** - Supabase-powered admin login
- **Dashboard** - Overview of menu statistics
- **Add Food Items** - Create new dishes with images and details
- **Manage Menu** - Edit or delete existing food items
- **Settings** - Update site information and social media links
- **Image Upload** - Direct upload to Supabase Storage

## 🚀 Tech Stack

- **Frontend**: Next.js 16.1 (App Router), React 19
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: CSS Modules, Custom Design System
- **Deployment**: Ready for Vercel deployment

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AjayK-Git02/food_site.git
   cd food_site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor
   - Create a `food-images` storage bucket (public)

4. **Configure environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cloud-kitchen/
├── app/
│   ├── admin/          # Admin panel pages
│   │   ├── dashboard/
│   │   ├── add-food/
│   │   ├── manage-menu/
│   │   ├── settings/
│   │   └── login/
│   ├── components/     # Reusable components
│   ├── day/           # Day menu pages
│   ├── food/          # Food detail pages
│   ├── lib/           # Utilities and Supabase client
│   └── globals.css    # Global styles
├── public/            # Static assets
├── supabase/         # Database schema and docs
└── package.json
```

## 🗄️ Database Schema

The application uses three main tables:

- **`days`** - Weekly day structure
- **`foods`** - Food items with details
- **`site_settings`** - Configurable site information

See `supabase/schema.sql` for the complete schema with RLS policies.

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for customer-facing data
- Authenticated write access for admin operations
- Secure image upload to Supabase Storage

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AjayK-Git02/food_site)

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**AjayK-Git02**
- GitHub: [@AjayK-Git02](https://github.com/AjayK-Git02)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- All contributors and users

---

**⭐ Star this repo if you find it helpful!**
