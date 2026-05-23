import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@store.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      name: 'Store Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✅ Admin: ${adminEmail} / ${adminPassword}`);

  // Categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Latest tech & gadgets', featured: true, order: 1 },
    { name: 'Fashion', slug: 'fashion', description: 'Trending apparel', featured: true, order: 2 },
    { name: 'Home & Living', slug: 'home-living', description: 'Make your home beautiful', featured: true, order: 3 },
    { name: 'Beauty', slug: 'beauty', description: 'Premium beauty products', featured: true, order: 4 },
    { name: 'Sports', slug: 'sports', description: 'Gear for active lifestyles', featured: false, order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories`);

  // Sample products
  const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const fashion = await prisma.category.findUnique({ where: { slug: 'fashion' } });

  if (electronics && fashion) {
    const sampleProducts = [
      {
        name: 'Wireless Pro Earbuds',
        slug: 'wireless-pro-earbuds',
        description: 'Premium noise-cancelling wireless earbuds with 30hr battery life and crystal-clear audio.',
        shortDesc: 'Premium ANC earbuds with 30hr battery',
        price: 79.99,
        comparePrice: 129.99,
        stock: 50,
        featured: true,
        categoryId: electronics.id,
        images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',
        tags: ['wireless', 'audio', 'bestseller'],
      },
      {
        name: 'Smart Watch Series X',
        slug: 'smart-watch-series-x',
        description: 'Advanced fitness tracking, heart rate monitor, GPS, and 7-day battery life.',
        shortDesc: 'Premium fitness smartwatch',
        price: 149.99,
        comparePrice: 199.99,
        stock: 30,
        featured: true,
        categoryId: electronics.id,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        tags: ['smartwatch', 'fitness'],
      },
      {
        name: 'Premium Leather Jacket',
        slug: 'premium-leather-jacket',
        description: 'Genuine leather jacket with classic design. Perfect for any season.',
        shortDesc: 'Genuine leather, timeless design',
        price: 199.99,
        comparePrice: 299.99,
        stock: 20,
        featured: true,
        categoryId: fashion.id,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        tags: ['leather', 'jacket', 'premium'],
      },
    ];

    for (const p of sampleProducts) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      });
    }
    console.log(`✅ ${sampleProducts.length} sample products`);
  }

  // Sample banner
  await prisma.banner.create({
    data: {
      title: 'Premium Quality. Delivered to Your Door.',
      subtitle: 'Cash on Delivery available nationwide',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600',
      buttonText: 'Shop Now',
      link: '/products',
      position: 'HERO',
      isActive: true,
    },
  });
  console.log('✅ Banner');

  // Sample promo code
  await prisma.offer.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      title: '10% Off Your First Order',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 50,
      isActive: true,
    },
  });
  console.log('✅ Promo code: WELCOME10');

  console.log('\n🎉 Done! Login at /auth/login');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
