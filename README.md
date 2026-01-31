# 🍽️ Cloud Kitchen Website

A modern, full-stack cloud kitchen website with **Next.js 14**, **Supabase**, and **WhatsApp ordering integration**.

![Cloud Kitchen](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## ✨ Features

### 🎨 **Visual Excellence**
- Premium design with soft orange and green color scheme
- Smooth animations and micro-interactions
- Fully responsive (mobile, tablet, desktop)
- Card-based modern UI with glassmorphism effects

### 🏠 **Public Pages**
- **Home Page**: Weekly menu grid, today's special slider
- **Day Menu**: Filter by time slots (morning, snacks, evening, dinner)
- **Food Detail**: Full description, ingredients, pricing

### 🔐 **Admin Panel**
- Protected routes with authentication
- Dashboard with statistics
- Add/Edit/Delete food items
- Image upload with preview
- Site settings management

### 📱 **WhatsApp Integration**
- One-click ordering
- Auto-filled messages with food name, day, and price
- Sticky mobile button

### 🗄️ **Database**
- Supabase PostgreSQL backend
- Row-Level Security (RLS)
- Storage bucket for images
- Auto-updating timestamps

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier)

### Installation

```bash
# Clone or navigate to project
cd cloud-kitchen

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
cloud-kitchen/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── DayCard.js
│   │   ├── FoodCard.js
│   │   ├── WhatsAppButton.js
│   │   ├── AdminSidebar.js
│   │   └── ConfirmDialog.js
│   ├── lib/                 # Helper functions
│   │   ├── supabase.js      # Database client
│   │   └── utils.js         # Utilities
│   ├── day/[id]/           # Day menu page
│   ├── food/[id]/          # Food detail page
│   ├── admin/              # Admin panel
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── add-food/
│   │   ├── manage-menu/
│   │   └── settings/
│   ├── globals.css         # Design system
│   ├── layout.js           # Root layout
│   └── page.js             # Home page
├── supabase/
│   ├── schema.sql          # Database schema
│   └── README.md           # Setup guide
├── public/                 # Static assets
└── package.json
```

---

## 🗄️ Database Schema

### Tables
- **days**: Days of the week
- **foods**: Food items with details
- **site_settings**: Website configuration

### Storage
- **food-images**: Public bucket for food photos

See `supabase/README.md` for detailed setup instructions.

---

## 🎨 Design System

### Colors
- **Primary**: #FF8C42 (Soft Orange)
- **Secondary**: #4CAF50 (Light Green)
- **Background**: #FFFFFF
- **Text**: #2C3E50

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Animations
- Fade in/out
- Slide up
- Scale
- Hover lift
- Pulse (WhatsApp button)

---

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Demo Admin Login
```
Email: admin@cloudkitchen.com
Password: admin123
```

---

## 📱 Responsive Breakpoints

- **Mobile**: 0-640px (1 column)
- **Tablet**: 641-1024px (2 columns)
- **Desktop**: 1025px+ (3-4 columns)

---

## 🧩 Key Components

### DayCard
Displays day of the week with emoji icon and hover animation.

### FoodCard
Shows food with image, price, and availability badge.

### WhatsAppButton
Sticky button with auto-generated order message.

### AdminSidebar
Responsive navigation with logout functionality.

### ConfirmDialog
Modal for delete confirmations.

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms
Works on Netlify, Railway, or any Node.js hosting.

---

## 🔒 Security Features

✅ Row-Level Security (RLS) policies  
✅ Admin route protection  
✅ Authenticated-only mutations  
✅ Public read access for menu  
✅ Secure image uploads  

---

## 📝 To-Do / Roadmap

- [ ] Real-time order notifications
- [ ] Email order confirmations
- [ ] Customer reviews
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open pull request

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 💬 Support

For issues or questions:
- Check `supabase/README.md` for setup help
- Review troubleshooting section
- Open an issue on GitHub

---

## 🌟 Credits

Built with:
- [Next.js 14](https://nextjs.org)
- [Supabase](https://supabase.com)
- [React](https://react.dev)

---

**Made with ❤️ for cloud kitchens everywhere**
