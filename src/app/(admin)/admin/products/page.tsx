'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '100' });
    if (search) params.set('search', search);
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((res) => res.success && setProducts(res.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      toast.success(data.data.message);
      fetchProducts();
    } else {
      toast.error(data.error);
    }
  };

  const toggleStock = async (id: string, currentInStock: boolean) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !currentInStock }),
    });
    if ((await res.json()).success) {
      toast.success('Stock updated');
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new"><Plus className="h-4 w-4" /> Add Product</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No products yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-3 px-2">Product</th>
                    <th className="py-3 px-2 hidden md:table-cell">Category</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">Stock</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-accent/30">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          {p.thumbnail && (
                            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary shrink-0">
                              <Image src={p.thumbnail} alt={p.name} fill sizes="48px" className="object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium line-clamp-1">{p.name}</p>
                            {p.sku && <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-muted-foreground">
                        {p.category?.name}
                      </td>
                      <td className="py-3 px-2 font-semibold">{formatPrice(p.price)}</td>
                      <td className="py-3 px-2">
                        <button onClick={() => toggleStock(p.id, p.inStock)}>
                          <Badge variant={p.stock > 5 ? 'success' : p.stock > 0 ? 'warning' : 'destructive'}>
                            {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        {!p.isActive ? (
                          <Badge variant="secondary">Hidden</Badge>
                        ) : p.featured ? (
                          <Badge variant="gold">Featured</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Link href={`/admin/products/${p.id}`}>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id, p.name)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
