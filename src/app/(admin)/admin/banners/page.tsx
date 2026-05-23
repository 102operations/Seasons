'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUploader } from '@/components/admin/image-uploader';
import { toast } from 'sonner';

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', subtitle: '', image: '', link: '', buttonText: '',
    position: 'HERO' as const, order: 0, isActive: true,
  });

  const load = () => fetch('/api/admin/banners').then((r) => r.json()).then((res) => res.success && setBanners(res.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', subtitle: '', image: '', link: '', buttonText: '', position: 'HERO', order: 0, isActive: true });
    setOpen(true);
  };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({
      title: b.title, subtitle: b.subtitle || '', image: b.image,
      link: b.link || '', buttonText: b.buttonText || '',
      position: b.position, order: b.order, isActive: b.isActive,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.image) return toast.error('Image required');
    setSaving(true);
    try {
      const url = editing ? `/api/admin/banners/${editing.id}` : '/api/admin/banners';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: parseInt(form.order.toString()) }),
      });
      if ((await res.json()).success) {
        toast.success('Saved');
        setOpen(false);
        load();
      }
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete banner?')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground">{banners.length} banners</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Add Banner</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <Card key={b.id}>
            <CardContent className="pt-6 space-y-3">
              <div className="relative aspect-[2/1] rounded-lg overflow-hidden bg-secondary">
                <Image src={b.image} alt={b.title} fill className="object-cover" sizes="400px" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{b.title}</h3>
                  {b.subtitle && <p className="text-sm text-muted-foreground">{b.subtitle}</p>}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{b.position}</Badge>
                    {b.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(b)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(b.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Banner' : 'New Banner'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div>
              <Label>Image *</Label>
              <ImageUploader
                images={form.image ? [form.image] : []}
                onChange={(imgs) => setForm({ ...form, image: imgs[0] || '' })}
                max={1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Button Text</Label>
                <Input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Shop Now" />
              </div>
              <div>
                <Label>Link</Label>
                <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/products" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Position</Label>
                <Select value={form.position} onValueChange={(v: any) => setForm({ ...form, position: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HERO">Hero (top)</SelectItem>
                    <SelectItem value="MIDDLE">Middle</SelectItem>
                    <SelectItem value="FOOTER">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <span className="text-sm">Active</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
