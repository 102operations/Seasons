'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappLink } from '@/lib/utils';

function SuccessContent() {
  const sp = useSearchParams();
  const orderNumber = sp.get('order') || '';

  return (
    <div className="container py-16 max-w-2xl">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 mb-6">
          <CheckCircle2 className="h-14 w-14 text-green-600" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Order Confirmed!
        </h1>

        <p className="text-lg text-muted-foreground mb-2">
          Thank you for your order. We&apos;ll contact you shortly to confirm delivery.
        </p>

        {orderNumber && (
          <p className="text-sm mb-8">
            Order number: <span className="font-mono font-bold">{orderNumber}</span>
          </p>
        )}

        <div className="bg-secondary/50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h3 className="font-semibold text-center mb-4">What happens next?</h3>
          <div className="flex gap-3">
            <Phone className="h-5 w-5 mt-1 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">1. Order Confirmation Call</p>
              <p className="text-sm text-muted-foreground">Our team will call you within 24 hours to confirm your order details.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Package className="h-5 w-5 mt-1 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">2. Shipping &amp; Delivery</p>
              <p className="text-sm text-muted-foreground">Your order will be shipped and delivered within 2-5 business days.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 mt-1 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">3. Pay on Delivery</p>
              <p className="text-sm text-muted-foreground">Pay the courier with cash when you receive your order. Inspect before paying!</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderNumber && (
            <Button asChild>
              <Link href={`/track?order=${orderNumber}`}>Track My Order</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="border-green-500 text-green-600">
            <a
              href={whatsappLink(`Hi! I just placed order ${orderNumber}. Can you confirm?`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
