'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlist';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const ids = useWishlist((s) => s.items);
  const clear = useWishlist((s) => s.clear);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/products?limit=100')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setProducts(res.data.products.filter((p: any) => ids.includes(p.id)));
        }
      })
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" /> My Wishlist
          </h1>
          <p className="text-muted-foreground">{products.length} item{products.length !== 1 ? 's' : ''}</p>
        </div>
        {products.length > 0 && (
          <Button variant="outline" onClick={clear}>Clear All</Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love to find them easily later</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
