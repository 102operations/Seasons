import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { offerSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({ orderBy: { createdAt: 'desc' } });
    return apiSuccess(offers);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = offerSchema.safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400, parsed.error.flatten());

    const offer = await prisma.offer.create({
      data: {
        ...parsed.data,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });
    return apiSuccess(offer, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
