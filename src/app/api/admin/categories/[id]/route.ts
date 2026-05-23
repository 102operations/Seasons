import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400);

    const updated = await prisma.category.update({
      where: { id },
      data: parsed.data,
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
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return apiError(`Cannot delete: ${productCount} products use this category`, 400);
    }
    await prisma.category.delete({ where: { id } });
    return apiSuccess({ message: 'Category deleted' });
  } catch (err) {
    return apiServerError(err);
  }
}
