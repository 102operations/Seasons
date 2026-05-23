import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function apiUnauthorized() {
  return apiError('Unauthorized', 401);
}

export function apiNotFound(resource = 'Resource') {
  return apiError(`${resource} not found`, 404);
}

export function apiServerError(error: unknown) {
  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : 'Internal server error';
  return apiError(message, 500);
}
