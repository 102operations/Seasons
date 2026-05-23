import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return apiError('Code required', 400);

    const offer = await prisma.offer.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!offer || !offer.isActive) return apiError('Invalid code', 404);

    const now = new Date();
    if (offer.startsAt && offer.startsAt > now) return apiError('Code not active yet', 400);
    if (offer.expiresAt && offer.expiresAt < now) return apiError('Code expired', 400);
    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) return apiError('Code limit reached', 400);
    if (offer.minOrderAmount && subtotal < offer.minOrderAmount) {
      return apiError(`Minimum order: ${offer.minOrderAmount}`, 400);
    }

    let discount = 0;
    if (offer.discountType === 'PERCENTAGE') {
      discount = (subtotal * offer.discountValue) / 100;
      if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);
    } else {
      discount = offer.discountValue;
    }

    return apiSuccess({
      code: offer.code,
      title: offer.title,
      discount: Math.round(discount * 100) / 100,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
