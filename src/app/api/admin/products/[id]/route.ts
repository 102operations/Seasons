import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiNotFound, apiServerError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return apiNotFound('Product');
    return apiSuccess(product);
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
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400, parsed.error.flatten());

    const data = parsed.data;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(data.stock !== undefined && { inStock: data.stock > 0 }),
      },
      include: { category: true },
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
    // Check if product has orders
    const orderCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      // Soft delete to preserve order history
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return apiSuccess({ message: 'Product deactivated (has order history)' });
    }
    await prisma.product.delete({ where: { id } });
    return apiSuccess({ message: 'Product deleted' });
  } catch (err) {
    return apiServerError(err);
  }
}
