import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('Invalid order data', 400, parsed.error.flatten());
    }

    const data = parsed.data;

    // Validate products and calculate totals from DB (don't trust client prices)
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return apiError('Some products are unavailable', 400);
    }

    let subtotal = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (!product.inStock || product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: product.id,
        productName: product.name,
        productImage: product.thumbnail || product.images[0],
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal,
      };
    });

    // Apply promo code
    let discount = 0;
    if (data.promoCode) {
      const offer = await prisma.offer.findUnique({
        where: { code: data.promoCode.toUpperCase() },
      });

      if (offer && offer.isActive) {
        const now = new Date();
        const validTime = (!offer.startsAt || offer.startsAt <= now) &&
                          (!offer.expiresAt || offer.expiresAt >= now);
        const validUsage = !offer.usageLimit || offer.usedCount < offer.usageLimit;
        const validMin = !offer.minOrderAmount || subtotal >= offer.minOrderAmount;

        if (validTime && validUsage && validMin) {
          if (offer.discountType === 'PERCENTAGE') {
            discount = (subtotal * offer.discountValue) / 100;
            if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);
          } else {
            discount = offer.discountValue;
          }

          // Increment usage
          await prisma.offer.update({
            where: { id: offer.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    // Shipping (configurable - free over a threshold)
    const shippingFee = subtotal >= 50 ? 0 : 5;
    const total = subtotal - discount + shippingFee;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          shippingAddress: data.shippingAddress,
          city: data.city,
          region: data.region,
          postalCode: data.postalCode,
          notes: data.notes,
          subtotal,
          discount,
          shippingFee,
          total,
          promoCode: data.promoCode,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      // Decrement stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      return created;
    });

    return apiSuccess(order, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
