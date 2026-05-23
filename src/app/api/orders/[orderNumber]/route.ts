import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiNotFound, apiServerError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) return apiNotFound('Order');

    // Public-safe view (no internal fields)
    return apiSuccess({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      items: order.items,
      createdAt: order.createdAt,
      confirmedAt: order.confirmedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
