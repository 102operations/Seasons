# 📡 API Reference

All API endpoints for the platform. Base URL: `/api`

---

## 🔓 Public Endpoints

### Authentication

```
POST   /api/auth/login         { email, password } → sets cookie
POST   /api/auth/logout        clears cookie
GET    /api/auth/me            returns current user
```

### Products

```
GET /api/products              List products
  ?category=slug
  ?search=keyword
  ?featured=true
  ?minPrice=10
  ?maxPrice=100
  ?sort=newest|price-asc|price-desc|popular|rating
  ?page=1
  ?limit=12

GET /api/products/[slug]       Get product details + related
```

### Categories

```
GET /api/categories            All active categories with product counts
```

### Orders (Customer)

```
POST /api/orders               Place a COD order
  Body: {
    customerName, customerPhone, customerEmail?,
    shippingAddress, city, region?, postalCode?,
    notes?, promoCode?,
    items: [{ productId, quantity }]
  }

GET /api/orders/[orderNumber]  Track order (public-safe data)
```

### Offers

```
POST /api/offers/validate      Validate promo code
  Body: { code, subtotal }
  Returns: { code, discount, type }
```

### Banners

```
GET /api/banners               Active banners (filterable by ?position=HERO)
```

---

## 🔒 Admin Endpoints (requires JWT)

All routes under `/api/admin/*` require a valid admin JWT cookie. The middleware auto-protects them.

### Products

```
GET    /api/admin/products              List all (incl. inactive)
POST   /api/admin/products              Create product
GET    /api/admin/products/[id]         Get one
PUT    /api/admin/products/[id]         Update
DELETE /api/admin/products/[id]         Delete (or soft-delete if has orders)
```

### Categories

```
GET    /api/admin/categories            All categories with counts
POST   /api/admin/categories            Create
PUT    /api/admin/categories/[id]       Update
DELETE /api/admin/categories/[id]       Delete (blocked if has products)
```

### Orders

```
GET  /api/admin/orders                  List all
  ?status=PENDING|CONFIRMED|SHIPPING|DELIVERED|CANCELLED
  ?search=ord-number-or-name
  ?page=1&limit=20

GET  /api/admin/orders/[id]             Get full order with items
PUT  /api/admin/orders/[id]             Update status / notes
  Body: { status, trackingNotes?, cancelReason? }
DELETE /api/admin/orders/[id]           Permanently delete
```

### Offers (Promo Codes)

```
GET    /api/admin/offers                List all
POST   /api/admin/offers                Create
PUT    /api/admin/offers/[id]           Update
DELETE /api/admin/offers/[id]           Delete
```

### Banners

```
GET    /api/admin/banners               List all
POST   /api/admin/banners               Create
PUT    /api/admin/banners/[id]          Update
DELETE /api/admin/banners/[id]          Delete
```

### Uploads

```
POST /api/admin/upload                  Upload image to Cloudinary
  Body: FormData { file, folder? }
  Returns: { url, publicId, width, height }
  Max: 5MB, images only
```

### Analytics

```
GET /api/admin/analytics                Dashboard data
  Returns: {
    stats: { totalOrders, pendingOrders, monthRevenue, revenueGrowth, ... },
    recentOrders: [...],
    topProducts: [...],
    dailyOrders: [{ day, count, revenue }]
  }
```

---

## 📦 Response Format

All endpoints return JSON with this structure:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Human-readable message",
  "details": { ... }  // optional validation errors
}
```

**HTTP Status Codes:**
- `200` OK
- `201` Created
- `400` Bad Request (validation error)
- `401` Unauthorized (no/invalid auth)
- `403` Forbidden (logged in but no permission)
- `404` Not Found
- `500` Server Error

---

## 🧪 Testing with curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@store.com","password":"YourPassword"}' \
  -c cookies.txt

# Use saved cookie for admin requests
curl http://localhost:3000/api/admin/products -b cookies.txt

# Create an order (public)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerPhone": "+96170123456",
    "shippingAddress": "Hamra Street, Building 5",
    "city": "Beirut",
    "items": [{ "productId": "<product-id>", "quantity": 2 }]
  }'

# Track order
curl http://localhost:3000/api/orders/ORD-2026-000123
```

---

## 🔐 Security Notes

- **Server-side price calculation**: clients send `productId` + `quantity`; server fetches actual price from DB → impossible to manipulate
- **Stock validation**: every order checks current stock before creation
- **Stock transaction**: stock decrement happens inside a Prisma `$transaction` → atomic
- **JWT cookies**: HTTP-only + secure + SameSite=Lax → safe from XSS
- **Zod validation**: every endpoint validates input → prevents injection
- **Prisma ORM**: parameterized queries → SQL injection-proof
