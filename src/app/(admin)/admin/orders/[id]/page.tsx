'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Save, Trash2, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice, formatDateTime, whatsappLink } from '@/lib/utils';
import { toast } from 'sonner';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setOrder(res.data);
          setStatus(res.data.status);
          setNotes(res.data.trackingNotes || '');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNotes: notes, cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order updated');
        setOrder(data.data);
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this order? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      toast.success('Order deleted');
      router.push('/admin/orders');
    } else {
      toast.error(data.error || 'Failed to delete');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>
          <h1 className="font-display text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" /> {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-green-500 text-green-600">
            <a
              href={whatsappLink(
                `Hi ${order.customerName}, regarding your order ${order.orderNumber}...`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Customer
            </a>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b last:border-0">
                    {item.productImage && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary shrink-0">
                        <Image src={item.productImage} alt={item.productName} fill sizes="64px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.promoCode && `(${order.promoCode})`}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingFee)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span><span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="SHIPPING">Shipping</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {status === 'CANCELLED' && (
                <Textarea
                  placeholder="Reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              )}

              <Textarea
                placeholder="Internal notes / tracking info..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />

              <Button onClick={handleSave} loading={saving} className="w-full">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-semibold text-base">{order.customerName}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {order.customerPhone}</p>
              {order.customerEmail && (
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {order.customerEmail}</p>
              )}
              <div className="flex items-start gap-2 pt-2 border-t">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <div>
                  <p>{order.shippingAddress}</p>
                  <p className="text-muted-foreground">
                    {order.city}{order.region && `, ${order.region}`}{order.postalCode && ` ${order.postalCode}`}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Notes:</p>
                  <p className="text-muted-foreground italic">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <TimelineItem label="Placed" date={order.createdAt} />
              {order.confirmedAt && <TimelineItem label="Confirmed" date={order.confirmedAt} />}
              {order.shippedAt && <TimelineItem label="Shipped" date={order.shippedAt} />}
              {order.deliveredAt && <TimelineItem label="Delivered" date={order.deliveredAt} />}
              {order.cancelledAt && (
                <TimelineItem label="Cancelled" date={order.cancelledAt} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground text-xs">{formatDateTime(date)}</span>
    </div>
  );
}
