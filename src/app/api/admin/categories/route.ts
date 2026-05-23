import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return apiSuccess(categories);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400, parsed.error.flatten());

    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    const category = await prisma.category.create({
      data: { ...data, slug },
    });
    return apiSuccess(category, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
