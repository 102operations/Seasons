import { NextRequest } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { apiSuccess, apiError, apiServerError } from '@/lib/api-response';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) return apiError('No file provided', 400);
    if (file.size > 5 * 1024 * 1024) return apiError('File too large (max 5MB)', 400);
    if (!file.type.startsWith('image/')) return apiError('Only images allowed', 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await uploadImage(base64, folder);
    return apiSuccess(result);
  } catch (err) {
    return apiServerError(err);
  }
}
