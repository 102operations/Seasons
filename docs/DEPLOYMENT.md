# 🚀 Deployment Guide

Complete step-by-step guide to deploy your e-commerce platform to production.

**Stack**: Vercel (hosting) + Supabase or Neon (database) + Cloudinary (images)

**Total cost**: $0/month on free tiers (handles thousands of orders)

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:
- [x] GitHub account
- [x] Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] Supabase or Neon account (database)
- [x] Cloudinary account (images)
- [x] Domain name (optional)

---

## Step 1: Set Up Production Database

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) → **Start your project**
2. Create a new project:
   - **Name**: `your-store-prod`
   - **Database Password**: Generate a strong password — **save it!**
   - **Region**: Pick closest to your customers (e.g. `Frankfurt` for Lebanon/Europe)
3. Wait ~2 minutes for provisioning
4. Go to **Settings → Database → Connection string → URI**
5. Copy the connection string. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual password
7. **Save this** — you'll need it in Step 4

### Option B: Neon (Alternative)

1. Go to [neon.tech](https://neon.tech) → **Sign up**
2. Create a project:
   - **Name**: `your-store`
   - **Region**: closest to customers
3. Copy the connection string from the dashboard
4. Save it for Step 4

---

## Step 2: Set Up Cloudinary (Image Hosting)

1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. Go to **Dashboard**
3. Copy these three values:
   - **Cloud Name** (e.g. `dxabc123`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (click "Reveal" to see it)
4. Save these for Step 4

---

## Step 3: Push Your Code to GitHub

```bash
# Inside the project folder
cd ecom-platform

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR-USERNAME/ecom-platform.git
git branch -M main
git push -u origin main
```

⚠️ Make sure `.env` is in `.gitignore` (it already is) — never commit secrets!

---

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Click **Import** next to your GitHub repo
3. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
4. **Don't deploy yet** — first add env vars below

### 4.2 Add Environment Variables

Click **Environment Variables** and add these one by one (or paste them all):

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://...` | From Supabase/Neon Step 1 |
| `JWT_SECRET` | Run `openssl rand -base64 32` in terminal | Must be random & secret |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | From Step 2 |
| `CLOUDINARY_API_KEY` | Your API key | From Step 2 |
| `CLOUDINARY_API_SECRET` | Your API secret | From Step 2 |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as above | Must duplicate for client |
| `NEXT_PUBLIC_STORE_NAME` | `Your Store Name` | Shown in navbar |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `96170123456` | No `+`, no spaces |
| `NEXT_PUBLIC_STORE_EMAIL` | `contact@yourstore.com` | Customer contact |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | `$` | Or `LBP`, `€`, etc. |
| `ADMIN_EMAIL` | `admin@yourstore.com` | For first login |
| `ADMIN_PASSWORD` | Strong password | **Change after first login!** |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXX` | Optional, Google Analytics |
| `NEXT_PUBLIC_META_PIXEL_ID` | `123456789` | Optional, Facebook Pixel |

### 4.3 Deploy

Click **Deploy**. First build takes 2-3 minutes.

When done, you get a URL like `https://your-store-xxx.vercel.app`

---

## Step 5: Initialize Production Database

Your DB exists but is empty. You need to push the schema and seed data.

### Option A: From Your Local Machine

```bash
# Pull production env vars
vercel env pull .env.production.local

# Push schema to production DB
DATABASE_URL="<your-production-url>" npm run db:push

# Seed initial data (admin user, categories, sample products)
DATABASE_URL="<your-production-url>" npm run db:seed
```

### Option B: Using Vercel CLI

```bash
npm i -g vercel
vercel link
vercel env pull
npx prisma db push
npm run db:seed
```

✅ Now visit `https://your-vercel-url.vercel.app/auth/login` and log in with the admin credentials you set.

---

## Step 6: Add a Custom Domain (Optional)

1. Buy a domain ([Namecheap](https://namecheap.com), [Cloudflare](https://cloudflare.com), Google Domains, etc.)
2. In Vercel → **Project → Settings → Domains**
3. Add your domain (e.g. `yourstore.com`)
4. Vercel shows you DNS records to add:
   - **Apex** (`yourstore.com`): A record → `76.76.21.21`
   - **www**: CNAME → `cname.vercel-dns.com`
5. Add these records at your registrar
6. Wait 5-30 minutes for DNS propagation
7. Vercel auto-provisions SSL ✅

---

## Step 7: Post-Deployment Tasks

### 🔐 Change Admin Password
1. Currently uses `ADMIN_PASSWORD` from env
2. To change: connect to Prisma Studio
   ```bash
   DATABASE_URL="<prod-url>" npx prisma studio
   ```
3. Edit the user → set new bcrypt-hashed password OR delete and re-seed

### 📦 Add Real Products
1. Login at `/auth/login`
2. **Admin → Products → Add Product**
3. Upload real product images
4. Set prices, stock, descriptions

### 🎨 Customize Homepage
1. **Admin → Banners → Add Banner**
2. Upload a high-quality hero image (recommended: 1920×1080)
3. Set title, subtitle, CTA button

### 🏷️ Create Promo Codes
1. **Admin → Promo Codes → Add Code**
2. Example: `LAUNCH20` for 20% off

### 📊 Set Up Analytics (Recommended)

#### Google Analytics
1. Create property at [analytics.google.com](https://analytics.google.com)
2. Get the **Measurement ID** (looks like `G-XXXXXXXXXX`)
3. Add to Vercel env: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
4. Redeploy

#### Meta (Facebook) Pixel
1. Create pixel at [business.facebook.com/events_manager](https://business.facebook.com/events_manager)
2. Copy the **Pixel ID**
3. Add to Vercel env: `NEXT_PUBLIC_META_PIXEL_ID=123456789`
4. Redeploy

---

## 🔄 Updating Your Live Store

Every time you push to GitHub `main`, Vercel auto-deploys.

```bash
git add .
git commit -m "Update product page styling"
git push
```

Live in ~90 seconds. ✨

### Database Schema Changes

If you change `prisma/schema.prisma`:

```bash
# For small changes (no production data risk)
DATABASE_URL="<prod-url>" npm run db:push

# For changes with existing data (safer)
DATABASE_URL="<prod-url>" npx prisma migrate deploy
```

---

## 🩺 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is correct in Vercel env
- Supabase: ensure database is not paused (free tier pauses after 7 days of inactivity)
- Test connection: `npx prisma db push` locally with prod URL

### "Cloudinary upload fails"
- Check both `CLOUDINARY_*` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` are set
- Verify API secret in Cloudinary dashboard

### "Admin login doesn't work"
- Confirm `db:seed` ran successfully (creates admin user)
- Check `ADMIN_EMAIL` / `ADMIN_PASSWORD` match what you set
- Verify `JWT_SECRET` is set (any 32+ char random string)

### "Images don't display"
- Add Cloudinary domain to `next.config.js` (already configured)
- Check the image URL starts with `https://res.cloudinary.com/...`

### "Build fails: Prisma Client not generated"
- Add to `package.json` scripts:
  ```json
  "postinstall": "prisma generate"
  ```
  (already configured)

### "Orders don't decrement stock"
- Check the order creation route logs in Vercel → **Functions → Logs**

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Limit | Sufficient For |
|---------|-----------|----------------|
| **Vercel** | 100 GB bandwidth / month | ~50,000 monthly visitors |
| **Supabase** | 500 MB DB + 2 GB transfer | ~10,000 orders |
| **Cloudinary** | 25 GB storage + 25 GB bandwidth | ~5,000 product images |
| **Domain** | $10-15/year | One year |

**Total to launch**: $0-15 (just the domain)

When you scale up, upgrade to paid tiers (still under $50/month for moderate stores).

---

## 🔒 Security Best Practices

1. ✅ Change `ADMIN_PASSWORD` immediately after first login
2. ✅ Use a strong `JWT_SECRET` (64+ random chars)
3. ✅ Enable 2FA on Vercel, Supabase, Cloudinary
4. ✅ Never commit `.env` to git
5. ✅ Rotate API keys every 6 months
6. ✅ Add rate limiting (Vercel has built-in basic protection)
7. ✅ Regularly backup database (Supabase auto-backs up daily on free tier)

---

## 📈 Going to the Next Level

Once you have orders flowing:

1. **Custom email notifications**: Add [Resend](https://resend.com) for order confirmation emails
2. **SMS notifications**: Twilio for order status SMS
3. **Better search**: Algolia or Meilisearch for instant search
4. **Reviews moderation**: Build admin review approval flow
5. **Multi-language**: Add `next-intl` for Arabic/French support
6. **Inventory automation**: Webhooks to update stock from suppliers
7. **Customer accounts**: Add user signup/login (currently guest-checkout only)

---

## 🆘 Need Help?

If something breaks:
1. Check Vercel **Function Logs** (Project → Deployments → View Function Logs)
2. Check Supabase **Logs** (Project → Logs)
3. Test locally first with prod env vars to isolate the issue

---

**You're now live! 🎉**

Share your store URL and start taking orders.
