import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiServerError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');

    const now = new Date();
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        ...(position && { position: position as any }),
        OR: [
          { startsAt: null, endsAt: null },
          { startsAt: { lte: now }, endsAt: null },
          { startsAt: null, endsAt: { gte: now } },
          { startsAt: { lte: now }, endsAt: { gte: now } },
        ],
      },
      orderBy: { order: 'asc' },
    });
    return apiSuccess(banners);
  } catch (err) {
    return apiServerError(err);
  }
}
