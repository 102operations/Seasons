import { prisma } from '@/lib/prisma';
import { apiSuccess, apiServerError } from '@/lib/api-response';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    return apiSuccess(categories);
  } catch (err) {
    return apiServerError(err);
  }
}
