'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function OffersAdminPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', title: '', description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 10, minOrderAmount: '', maxDiscount: '',
    usageLimit: '', isActive: true, expiresAt: '',
  });

  const load = () => {
    setLoading(true);
    fetch('/api/admin/offers')
      .then((r) => r.json())
      .then((res) => res.success && setOffers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      code: '', title: '', description: '',
      discountType: 'PERCENTAGE', discountValue: 10,
      minOrderAmount: '', maxDiscount: '', usageLimit: '',
      isActive: true, expiresAt: '',
    });
    setOpen(true);
  };

  const openEdit = (o: any) => {
    setEditing(o);
    setForm({
      code: o.code, title: o.title, description: o.description || '',
      discountType: o.discountType, discountValue: o.discountValue,
      minOrderAmount: o.minOrderAmount || '', maxDiscount: o.maxDiscount || '',
      usageLimit: o.usageLimit || '', isActive: o.isActive,
      expiresAt: o.expiresAt ? new Date(o.expiresAt).toISOString().slice(0, 10) : '',
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const payload: any = {
      code: form.code.toUpperCase(),
      title: form.title,
      description: form.description || null,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue.toString()),
      isActive: form.isActive,
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount.toString()) : null,
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount.toString()) : null,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit.toString()) : null,
      expiresAt: form.expiresAt || null,
    };

    try {
      const url = editing ? `/api/admin/offers/${editing.id}` : '/api/admin/offers';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) { toast.success('Saved'); setOpen(false); load(); }
      else toast.error(data.error || 'Failed');
    } finally { setSaving(false); }
  };

  const remove = async (id: string, code: string) => {
    if (!confirm(`Delete "${code}"?`)) return;
    const res = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' });
    if ((await res.json()).success) { toast.success('Deleted'); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Promo Codes</h1>
          <p className="text-muted-foreground">{offers.length} codes</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Add Code</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : offers.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No promo codes yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-3 px-2">Code</th>
                  <th className="py-3 px-2 hidden md:table-cell">Title</th>
                  <th className="py-3 px-2">Discount</th>
                  <th className="py-3 px-2 hidden md:table-cell">Used</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-accent/30">
                    <td className="py-3 px-2 font-mono font-bold">{o.code}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{o.title}</td>
                    <td className="py-3 px-2">
                      {o.discountType === 'PERCENTAGE' ? `${o.discountValue}%` : `$${o.discountValue}`}
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell text-muted-foreground">
                      {o.usedCount}{o.usageLimit ? ` / ${o.usageLimit}` : ''}
                    </td>
                    <td className="py-3 px-2">
                      {o.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(o)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(o.id, o.code)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Code' : 'New Promo Code'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Code *</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
            </div>
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={form.discountType} onValueChange={(v: any) => setForm({ ...form, discountType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value *</Label>
                <Input type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Min Order</Label>
                <Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
              </div>
              <div>
                <Label>Max Discount</Label>
                <Input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Usage Limit</Label>
                <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
              </div>
              <div>
                <Label>Expires At</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
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
