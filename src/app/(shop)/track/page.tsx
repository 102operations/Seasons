'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, formatDateTime, cn } from '@/lib/utils';

const STATUSES = [
  { key: 'PENDING', label: 'Pending', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'SHIPPING', label: 'Shipping', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Package },
];

function TrackContent() {
  const sp = useSearchParams();
  const initial = sp.get('order') || '';
  const [orderNumber, setOrderNumber] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (num: string = orderNumber) => {
    if (!num.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${num}`);
      const data = await res.json();
      if (data.success) setOrder(data.data);
      else { setError(data.error || 'Order not found'); setOrder(null); }
    } catch {
      setError('Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initial) handleTrack(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const currentStatusIndex = order ? STATUSES.findIndex((s) => s.key === order.status) : -1;
  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 text-center">Track Your Order</h1>
      <p className="text-center text-muted-foreground mb-8">Enter your order number to see status</p>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="ORD-2025-XXXXXX"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
            <Button onClick={() => handleTrack()} loading={loading}>Track</Button>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {order && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <CardTitle>Order {order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>
              </div>
              <p className="text-xl font-bold">{formatPrice(order.total)}</p>
            </div>
          </CardHeader>
          <CardContent>
            {isCancelled ? (
              <div className="bg-destructive/10 text-destructive rounded-lg p-6 flex items-center gap-3 mb-6">
                <XCircle className="h-8 w-8" />
                <div>
                  <p className="font-bold">Order Cancelled</p>
                  <p className="text-sm">If this is a mistake, please contact us via WhatsApp.</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="relative flex justify-between mb-2">
                  {STATUSES.map((s, i) => {
                    const Icon = s.icon;
                    const reached = i <= currentStatusIndex;
                    const current = i === currentStatusIndex;
                    return (
                      <div key={s.key} className="flex flex-col items-center text-center relative z-10 flex-1">
                        <div
                          className={cn(
                            'h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-colors',
                            reached ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
                            current && 'ring-4 ring-primary/20 animate-pulse'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={cn('text-xs font-medium', !reached && 'text-muted-foreground')}>{s.label}</p>
                      </div>
                    );
                  })}
                  <div className="absolute top-6 left-6 right-6 h-0.5 bg-secondary -z-0">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(currentStatusIndex / (STATUSES.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <h4 className="font-semibold mb-3">Items</h4>
            <div className="space-y-2 mb-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
