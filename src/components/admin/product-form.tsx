'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/image-uploader';
import { toast } from 'sonner';

interface ProductFormProps {
  initial?: any;
  isEdit?: boolean;
}

export function ProductForm({ initial, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    shortDesc: initial?.shortDesc || '',
    price: initial?.price || 0,
    comparePrice: initial?.comparePrice || 0,
    cost: initial?.cost || 0,
    sku: initial?.sku || '',
    stock: initial?.stock || 0,
    categoryId: initial?.categoryId || '',
    images: initial?.images || [],
    tags: (initial?.tags || []).join(', '),
    featured: initial?.featured || false,
    isActive: initial?.isActive !== false,
    metaTitle: initial?.metaTitle || '',
    metaDesc: initial?.metaDesc || '',
  });

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((res) => res.success && setCategories(res.data));
  }, []);

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) return toast.error('Please select a category');
    if (form.images.length === 0) return toast.error('Add at least one image');

    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price.toString()),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice.toString()) : null,
      cost: form.cost ? parseFloat(form.cost.toString()) : null,
      stock: parseInt(form.stock.toString()),
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      thumbnail: form.images[0],
    };

    try {
      const url = isEdit ? `/api/admin/products/${initial.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Product ${isEdit ? 'updated' : 'created'}`);
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="font-display text-3xl font-bold">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
        </div>
        <Button type="submit" loading={saving}><Save className="h-4 w-4" /> Save</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Basic Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="shortDesc">Short Description</Label>
                <Input
                  id="shortDesc"
                  value={form.shortDesc}
                  onChange={(e) => update('shortDesc', e.target.value)}
                  placeholder="One-line summary (shown in cards)"
                />
              </div>
              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => update('tags', e.target.value)}
                  placeholder="bestseller, new, premium"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Images *</CardTitle></CardHeader>
            <CardContent>
              <ImageUploader
                images={form.images}
                onChange={(images) => update('images', images)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" value={form.metaTitle} onChange={(e) => update('metaTitle', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea id="metaDesc" rows={2} value={form.metaDesc} onChange={(e) => update('metaDesc', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Price &amp; Stock</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input id="price" type="number" step="0.01" required value={form.price} onChange={(e) => update('price', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare Price (original)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(e) => update('comparePrice', e.target.value)}
                  placeholder="For showing discount"
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost (private)</Label>
                <Input id="cost" type="number" step="0.01" value={form.cost} onChange={(e) => update('cost', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input id="stock" type="number" required value={form.stock} onChange={(e) => update('stock', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.sku} onChange={(e) => update('sku', e.target.value)} placeholder="Optional" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Organization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => update('categoryId', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => update('featured', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => update('isActive', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Active (visible on store)</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
