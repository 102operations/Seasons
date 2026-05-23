import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, apiNotFound, apiServerError } from '@/lib/api-response';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return apiNotFound('Order');
    return apiSuccess(order);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, trackingNotes, cancelReason } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return apiError('Invalid status', 400);
    }

    const updateData: any = { trackingNotes };

    if (status) {
      updateData.status = status;
      const now = new Date();
      if (status === 'CONFIRMED') updateData.confirmedAt = now;
      if (status === 'SHIPPING') updateData.shippedAt = now;
      if (status === 'DELIVERED') updateData.deliveredAt = now;
      if (status === 'CANCELLED') {
        updateData.cancelledAt = now;
        updateData.cancelReason = cancelReason;

        // Restore stock on cancellation
        const order = await prisma.order.findUnique({
          where: { id },
          include: { items: true },
        });
        if (order && order.status !== 'CANCELLED') {
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
                soldCount: { decrement: item.quantity },
              },
            }).catch(() => {});
          }
        }
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return apiSuccess(updated);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.order.delete({ where: { id } });
    return apiSuccess({ message: 'Order deleted' });
  } catch (err) {
    return apiServerError(err);
  }
}
