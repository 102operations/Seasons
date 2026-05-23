'use client';

import { use, useEffect, useState } from 'react';
import { ProductForm } from '@/components/admin/product-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((res) => res.success && setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="space-y-4 max-w-5xl"><Skeleton className="h-10 w-64" /><Skeleton className="h-96" /></div>;
  if (!product) return <p>Product not found</p>;

  return <ProductForm initial={product} isEdit />;
}
