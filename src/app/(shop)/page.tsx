import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, RotateCcw, HeadphonesIcon, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { HeroBanner } from '@/components/shop/hero-banner';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';

export const revalidate = 60; // ISR: revalidate every minute

async function getHomeData() {
  const now = new Date();
  const [banners, featured, newest, categories] = await Promise.all([
    prisma.banner.findMany({
      where: {
        isActive: true,
        position: 'HERO',
        OR: [
          { startsAt: null, endsAt: null },
          { startsAt: { lte: now }, endsAt: null },
          { startsAt: null, endsAt: { gte: now } },
          { startsAt: { lte: now }, endsAt: { gte: now } },
        ],
      },
      orderBy: { order: 'asc' },
    }),
    prisma.product.findMany({
      where: { featured: true, isActive: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      take: 4,
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    }),
  ]);

  return { banners, featured, newest, categories };
}

export default async function HomePage() {
  const { banners, featured, newest, categories } = await getHomeData();

  return (
    <>
      <HeroBanner banners={banners} />

      {/* Trust badges */}
      <section className="border-b">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Cash on Delivery', desc: 'Pay when you receive' },
              { icon: ShieldCheck, title: 'Quality Guaranteed', desc: '100% authentic products' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'WhatsApp anytime' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-16">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Browse</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-display text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/80">{cat._count.products} products</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container py-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Handpicked</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Products</h2>
            </div>
            <Link href="/products?featured=true" className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Promo banner */}
      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20 my-16">
        <div className="container text-center">
          <p className="text-gold-400 text-sm uppercase tracking-widest mb-3">Limited Time</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 text-balance">
            Get 10% Off Your First Order
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Use code <span className="font-mono bg-white/10 px-3 py-1 rounded">WELCOME10</span> at checkout
          </p>
          <Button asChild size="xl" variant="gold">
            <Link href="/products">Shop Now <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* New arrivals */}
      {newest.length > 0 && (
        <section className="container py-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Just In</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">New Arrivals</h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newest.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
