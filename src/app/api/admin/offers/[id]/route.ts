import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { offerSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = offerSchema.partial().safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400);

    const data = parsed.data;
    const updated = await prisma.offer.update({
      where: { id },
      data: {
        ...data,
        ...(data.startsAt && { startsAt: new Date(data.startsAt) }),
        ...(data.expiresAt && { expiresAt: new Date(data.expiresAt) }),
      },
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
    await prisma.offer.delete({ where: { id } });
    return apiSuccess({ message: 'Offer deleted' });
  } catch (err) {
    return apiServerError(err);
  }
}
