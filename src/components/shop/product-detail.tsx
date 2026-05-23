'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Star, MessageCircle, Plus, Minus } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/shop/product-card';
import { formatPrice, calculateDiscount, whatsappLink, cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductDetail({ product, related }: { product: any; related: any[] }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);

  const addItem = useCart((s) => s.addItem);
  const setCartOpen = useCart((s) => s.setOpen);
  const { toggle, has } = useWishlist();

  const images = product.images.length > 0 ? product.images : [product.thumbnail || '/placeholder.png'];
  const discount = calculateDiscount(product.price, product.comparePrice);
  const inWishlist = has(product.id);

  const handleAddToCart = () => {
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
      image: images[0],
      stock: product.stock,
    }, qty);
    toast.success(`Added ${qty} to cart`);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => { window.location.href = '/checkout'; }, 500);
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Image gallery */}
        <div>
          <motion.div
            key={selectedImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-4"
          >
            <Image
              src={images[selectedImg]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4 text-base px-3 py-1">
                -{discount}% OFF
              </Badge>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden bg-secondary border-2 transition-all',
                    selectedImg === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img} alt="" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {product.category.name}
          </Link>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'h-4 w-4',
                      s <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-bold text-4xl">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="success" className="text-sm">Save {discount}%</Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.shortDesc || product.description.slice(0, 200)}
          </p>

          {/* Stock indicator */}
          <div className="mb-6">
            {!product.inStock || product.stock === 0 ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge variant="warning">Only {product.stock} left in stock</Badge>
            ) : (
              <Badge variant="success">✓ In Stock</Badge>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-accent">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-3 hover:bg-accent"
                  disabled={qty >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Subtotal: <strong>{formatPrice(product.price * qty)}</strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              <ShoppingBag className="h-5 w-5" /> Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              size="lg"
              className="flex-1"
            >
              Buy Now (COD)
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="sm:w-12"
              onClick={() => {
                toggle(product.id);
                toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
              }}
            >
              <Heart className={cn('h-5 w-5', inWishlist && 'fill-red-500 text-red-500')} />
            </Button>
          </div>

          {/* WhatsApp */}
          <a
            href={whatsappLink(`Hi! I'm interested in: ${product.name} (${formatPrice(product.price)}). Is it available?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 border-2 border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-950 transition-colors mb-6"
          >
            <MessageCircle className="h-5 w-5" />
            Ask on WhatsApp
          </a>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-secondary/50 rounded-lg">
            {[
              { icon: Truck, text: 'COD Available' },
              { icon: ShieldCheck, text: 'Authentic' },
              { icon: RotateCcw, text: '7-Day Return' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <f.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mb-16">
        <h2 className="font-display text-2xl font-bold mb-4">Description</h2>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {product.description}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="max-w-4xl mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((r: any) => (
              <div key={r.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          'h-4 w-4',
                          s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm">{r.customerName}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-3xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
