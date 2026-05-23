'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Store configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Most store configuration is managed through environment variables. Edit your{' '}
            <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">.env</code> file or your hosting platform&apos;s env settings.
          </p>

          <div className="space-y-2 mt-4">
            <SettingRow label="Store Name" value={process.env.NEXT_PUBLIC_STORE_NAME || '(not set)'} env="NEXT_PUBLIC_STORE_NAME" />
            <SettingRow label="WhatsApp Number" value={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '(not set)'} env="NEXT_PUBLIC_WHATSAPP_NUMBER" />
            <SettingRow label="Contact Email" value={process.env.NEXT_PUBLIC_STORE_EMAIL || '(not set)'} env="NEXT_PUBLIC_STORE_EMAIL" />
            <SettingRow label="Currency Symbol" value={process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'} env="NEXT_PUBLIC_CURRENCY_SYMBOL" />
            <SettingRow label="Google Analytics" value={process.env.NEXT_PUBLIC_GA_ID ? 'Connected' : '(not set)'} env="NEXT_PUBLIC_GA_ID" />
            <SettingRow label="Meta Pixel" value={process.env.NEXT_PUBLIC_META_PIXEL_ID ? 'Connected' : '(not set)'} env="NEXT_PUBLIC_META_PIXEL_ID" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href="https://cloudinary.com/console"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
          >
            <span className="text-sm">Cloudinary Console (manage images)</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
          >
            <span className="text-sm">Vercel Dashboard (hosting)</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({ label, value, env }: { label: string; value: string; env: string }) {
  const isSet = !value.startsWith('(not');
  return (
    <div className="flex justify-between items-center p-3 rounded-lg border">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{env}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">{value}</p>
        {isSet ? <Badge variant="success" className="text-xs">Set</Badge> : <Badge variant="warning" className="text-xs">Missing</Badge>}
      </div>
    </div>
  );
}
