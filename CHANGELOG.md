# Changelog

## [1.0.0] - Initial Release

### Customer Features
- 🏠 Animated homepage with hero banner carousel
- 🛒 Product catalog with filters, search, sort, pagination
- 📦 Product detail pages with image gallery and zoom
- ❤️ Wishlist (persisted in localStorage)
- 🛍️ Sliding cart drawer with quantity controls
- 💵 Cash on Delivery checkout flow
- 🎟️ Promo code validation
- 📱 Order tracking by order number
- 📲 Floating WhatsApp contact button
- 🌙 Dark/light mode toggle
- 📱 Fully responsive design (mobile-first)

### Admin Features
- 🔐 Secure JWT-based authentication
- 📊 Dashboard with revenue chart and top products
- 📦 Full product CRUD with multi-image upload
- 🏷️ Category management
- 🛒 Order management with status workflow (Pending → Confirmed → Shipping → Delivered)
- 🎫 Promo code management
- 🖼️ Homepage banner management
- 📈 Analytics: revenue, growth %, daily orders, top products

### Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Radix UI + Framer Motion
- PostgreSQL + Prisma ORM 5
- JWT auth with jose + bcrypt
- Zustand state management with persistence
- Zod input validation
- Cloudinary image hosting
- Recharts for analytics charts
- Sonner for toasts

### Security
- Server-side price calculation (prevents tampering)
- Stock decrement in atomic transactions
- HTTP-only auth cookies
- Middleware-protected admin routes
- Zod validation on all endpoints
- Bcrypt password hashing
