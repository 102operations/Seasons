'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    thumbnail?: string | null;
    stock: number;
    inStock: boolean;
    featured?: boolean;
    rating?: number;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const setCartOpen = useCart((s) => s.setOpen);
  const { toggle, has } = useWishlist();

  const discount = calculateDiscount(product.price, product.comparePrice);
  const image = product.thumbnail || product.images[0] || '/placeholder.png';
  const inWishlist = has(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock || product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image,
      stock: product.stock,
    });
    toast.success('Added to cart');
    setCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge variant="destructive" className="font-bold">-{discount}%</Badge>
            )}
            {product.featured && <Badge variant="gold">Featured</Badge>}
            {!product.inStock && <Badge variant="secondary">Sold Out</Badge>}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className={cn(
                'h-9 w-9 rounded-full flex items-center justify-center shadow-md transition-colors',
                inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
              )}
            >
              <Heart className="h-4 w-4" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Quick add button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="sm"
              className="w-full shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="pt-3 space-y-1">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 group-hover:text-primary/70 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base sm:text-lg">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
