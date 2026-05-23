import Link from 'next/link';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export const metadata = { title: 'Offers & Discounts' };

export default async function OffersPage() {
  const now = new Date();

  const [offers, discounted] = await Promise.all([
    prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, comparePrice: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
  ]);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-widest text-red-500 mb-2">Limited Time</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">Offers &amp; Discounts</h1>
        <p className="text-muted-foreground text-lg">Save big on selected products</p>
      </div>

      {offers.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Promo Codes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="border-dashed border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg">{offer.title}</h3>
                      {offer.description && (
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-2xl font-bold tracking-wider bg-secondary py-3 text-center rounded-lg mb-3">
                    {offer.code}
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-primary">
                      {offer.discountType === 'PERCENTAGE'
                        ? `${offer.discountValue}% off`
                        : `$${offer.discountValue} off`}
                    </p>
                    {offer.minOrderAmount && (
                      <p className="text-xs text-muted-foreground">
                        Minimum order: ${offer.minOrderAmount}
                      </p>
                    )}
                    {offer.expiresAt && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Expires {formatDate(offer.expiresAt)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {discounted.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Discounted Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {discounted.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {offers.length === 0 && discounted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-6">No active offers right now. Check back soon!</p>
          <Button asChild>
            <Link href="/products">Browse Products <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      )}
    </div>
  );
}
