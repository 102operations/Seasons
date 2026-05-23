import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';
import { slugify } from '@/lib/utils';

// GET /api/admin/products - list all (incl. inactive)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return apiSuccess({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return apiServerError(err);
  }
}

// POST /api/admin/products - create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('Invalid input', 400, parsed.error.flatten());
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        slug: uniqueSlug,
        thumbnail: data.thumbnail || data.images[0] || null,
        inStock: data.stock > 0,
      },
      include: { category: true },
    });

    return apiSuccess(product, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
