#!/bin/bash
# Quick setup script for first-time installation

set -e

echo "🛍️  Premium COD Store - Setup"
echo "================================"
echo ""

# Check Node version
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Install from https://nodejs.org"
  exit 1
fi
echo "✅ Node $(node -v)"

# Copy .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file — please edit it with your credentials!"
  echo ""
  echo "📝 Required values to set in .env:"
  echo "   - DATABASE_URL (PostgreSQL connection string)"
  echo "   - JWT_SECRET (run: openssl rand -base64 32)"
  echo "   - CLOUDINARY_* credentials"
  echo "   - ADMIN_EMAIL and ADMIN_PASSWORD"
  echo ""
  echo "Once .env is configured, run this script again."
  exit 0
else
  echo "✅ .env exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npm run db:push

echo ""
echo "🌱 Seeding initial data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "▶️  Run 'npm run dev' to start the development server"
echo "🛍️  Store: http://localhost:3000"
echo "🔐 Admin: http://localhost:3000/auth/login"
