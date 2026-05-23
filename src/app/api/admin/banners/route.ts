import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bannerSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
    return apiSuccess(banners);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400, parsed.error.flatten());

    const banner = await prisma.banner.create({ data: parsed.data });
    return apiSuccess(banner, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
