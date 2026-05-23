import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bannerSchema } from '@/lib/validations';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = bannerSchema.partial().safeParse(body);
    if (!parsed.success) return apiError('Invalid input', 400);

    const updated = await prisma.banner.update({ where: { id }, data: parsed.data });
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
    await prisma.banner.delete({ where: { id } });
    return apiSuccess({ message: 'Banner deleted' });
  } catch (err) {
    return apiServerError(err);
  }
}
