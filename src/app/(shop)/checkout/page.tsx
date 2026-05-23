'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, Banknote, Tag } from 'lucide-react';
import { useCart } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [validating, setValidating] = useState(false);

  const subtotal = getTotal();
  const discount = appliedPromo?.discount || 0;
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal - discount + shipping;

  if (items.length === 0 && typeof window !== 'undefined') {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setValidating(true);
    try {
      const res = await fetch('/api/offers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedPromo({ code: data.data.code, discount: data.data.discount });
        toast.success(`Code applied! -${formatPrice(data.data.discount)}`);
      } else {
        toast.error(data.error || 'Invalid code');
      }
    } catch {
      toast.error('Failed to apply code');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customerName: formData.get('customerName') as string,
      customerPhone: formData.get('customerPhone') as string,
      customerEmail: (formData.get('customerEmail') as string) || '',
      shippingAddress: formData.get('shippingAddress') as string,
      city: formData.get('city') as string,
      region: (formData.get('region') as string) || '',
      postalCode: (formData.get('postalCode') as string) || '',
      notes: (formData.get('notes') as string) || '',
      promoCode: appliedPromo?.code,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (data.success) {
        clearCart();
        // Track conversion
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', { value: total, currency: 'USD' });
        }
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'purchase', {
            transaction_id: data.data.orderNumber,
            value: total,
            currency: 'USD',
          });
        }
        router.push(`/order-success?order=${data.data.orderNumber}`);
      } else {
        toast.error(data.error || 'Order failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">Complete your order — pay cash on delivery</p>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input id="customerName" name="customerName" required placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input id="customerPhone" name="customerPhone" type="tel" required placeholder="+961 70 123 456" />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email (optional)</Label>
                <Input id="customerEmail" name="customerEmail" type="email" placeholder="you@example.com" />
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingAddress">Street Address *</Label>
                <Textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  required
                  rows={2}
                  placeholder="Building, street, area..."
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" required placeholder="Beirut" />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" name="region" placeholder="Mount Lebanon" />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" name="postalCode" placeholder="0000" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <Textarea id="notes" name="notes" rows={2} placeholder="Delivery instructions, landmarks..." />
              </div>
            </CardContent>
          </Card>

          {/* Payment method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-primary rounded-lg p-4 flex items-center gap-3 bg-primary/5">
                <Banknote className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay with cash when your order arrives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={!!appliedPromo}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={appliedPromo ? () => { setAppliedPromo(null); setPromoCode(''); } : applyPromo}
                      loading={validating}
                    >
                      {appliedPromo ? 'Remove' : 'Apply'}
                    </Button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {appliedPromo.code} applied
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Place Order
                </Button>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Your information is secure</p>
                  <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> Estimated delivery: 2-5 business days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
