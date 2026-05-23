# 🛍️ Premium COD E-Commerce Platform

A complete, production-ready dropshipping e-commerce platform with **Cash on Delivery** payment, built with Next.js 14, TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

## ✨ Features

### Customer Side
- 🏠 Premium animated homepage with rotating banners
- 🛒 Product browsing with filters, search, sort, pagination
- 📦 Product detail pages with image galleries and reviews
- ❤️ Wishlist (localStorage)
- 🛍️ Cart with sliding drawer (Zustand state)
- 💵 Cash on Delivery checkout
- 🎟️ Promo code support
- 📱 Fully responsive (mobile-first)
- 🌙 Dark/light mode
- 📲 Floating WhatsApp contact
- 🔍 Order tracking by order number
- ⚡ ISR for fast loads

### Admin Side
- 🔐 Secure JWT authentication
- 📊 Analytics dashboard with charts
- 📦 Full product CRUD with Cloudinary uploads
- 🏷️ Category management
- 🛒 Order management with status updates (Pending → Confirmed → Shipping → Delivered)
- 🎫 Promo code management
- 🖼️ Homepage banner management
- 📈 Top products & revenue tracking

### Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Radix UI + Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (jose) + bcrypt
- **State**: Zustand with persistence
- **Validation**: Zod
- **Forms**: react-hook-form
- **Images**: Cloudinary
- **Notifications**: Sonner
- **Charts**: Recharts

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a free PostgreSQL database. Recommended providers:
- [Supabase](https://supabase.com) (free 500MB)
- [Neon](https://neon.tech) (free 3GB)
- [Railway](https://railway.app) (free trial)

Copy the connection string.

### 3. Set Up Cloudinary

Sign up free at [cloudinary.com](https://cloudinary.com) and grab your credentials from the dashboard.

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="run: openssl rand -base64 32"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_STORE_NAME="Your Store Name"
NEXT_PUBLIC_WHATSAPP_NUMBER="96170123456"
NEXT_PUBLIC_STORE_EMAIL="contact@yourstore.com"
ADMIN_EMAIL="admin@yourstore.com"
ADMIN_PASSWORD="ChangeMe123!"
```

### 5. Initialize Database

```bash
# Push schema to DB
npm run db:push

# Seed initial data (creates admin, categories, sample products)
npm run db:seed
```

### 6. Run Development Server

```bash
npm run dev
```

Open:
- 🛍️ Store: [http://localhost:3000](http://localhost:3000)
- 🔐 Admin: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

Login with the admin credentials you set in `.env`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (shop)/              # Customer pages (group route)
│   │   ├── layout.tsx       # Navbar + footer + cart drawer
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Product listing & details
│   │   ├── checkout/        # COD checkout
│   │   ├── order-success/   # Confirmation
│   │   ├── track/           # Order tracking
│   │   ├── wishlist/        # Wishlist
│   │   ├── offers/          # Discounts
│   │   └── contact/         # Contact page
│   ├── (admin)/
│   │   └── admin/           # Admin dashboard (protected)
│   ├── auth/login/          # Admin login
│   ├── api/                 # All API routes
│   │   ├── auth/            # Login/logout/me
│   │   ├── products/        # Public products
│   │   ├── categories/      # Public categories
│   │   ├── orders/          # Order creation & tracking
│   │   ├── offers/validate/ # Promo validation
│   │   ├── banners/         # Public banners
│   │   └── admin/           # Protected admin APIs
│   ├── layout.tsx           # Root layout (theme, analytics)
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn-style primitives
│   ├── layout/              # Navbar, footer, whatsapp
│   ├── shop/                # Product card, cart drawer, hero
│   └── admin/               # Admin sidebar, forms, uploader
├── lib/                     # auth, prisma, cloudinary, utils, validations
├── store/                   # Zustand stores (cart, wishlist)
└── middleware.ts            # Protects /admin routes
prisma/
├── schema.prisma
└── seed.ts
```

---

## 🚢 Production Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full deployment guide. Quick summary:

1. **Deploy to Vercel** (frontend + API):
   - Push code to GitHub
   - Import project on [vercel.com](https://vercel.com)
   - Add all env vars from `.env.example`
   - Deploy

2. **Database** stays on Supabase/Neon (production-ready PostgreSQL)

3. **Custom domain**: Add it in Vercel project settings → Domains

---

## 📖 Daily Usage Guide

### Add a product
1. Login at `/auth/login`
2. Go to **Admin → Products → Add Product**
3. Upload images, fill details, save

### Process orders
1. **Admin → Orders**: see pending orders
2. Click an order → call customer to confirm
3. Update status to **Confirmed → Shipping → Delivered**

### Mark out of stock
- Admin → Products → click the stock badge to toggle in/out

### Create a promo code
- Admin → Promo Codes → Add Code (e.g. SAVE20 for 20% off)

### Update homepage banner
- Admin → Banners → Add or edit

---

## 🛠️ Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Run production build
npm run db:push      # Sync schema → DB (no migration history)
npm run db:migrate   # Create migration
npm run db:studio    # Visual DB editor
npm run db:seed      # Seed initial data
```

---

## 🔒 Security Notes

- All admin routes protected by JWT middleware
- Passwords hashed with bcrypt (10 rounds)
- HTTP-only cookies for tokens (XSS-safe)
- Server-side price calculation (clients can't manipulate)
- Stock validation on every order
- Input validation with Zod on every endpoint
- SQL injection protected by Prisma

---

## 📞 Support

For issues or customization, contact the developer or reach out via the WhatsApp button on the store.

---

**License**: MIT — free to use commercially.
