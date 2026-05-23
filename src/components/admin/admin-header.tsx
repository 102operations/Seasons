'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function AdminHeader({ user }: { user: { email: string; role: string } }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-background border-b flex items-center justify-end gap-3 px-4 lg:px-8 sticky top-0 z-30">
      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      )}
      <div className="hidden sm:block text-sm">
        <p className="font-medium">{user.email}</p>
        <p className="text-xs text-muted-foreground">{user.role}</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4" /> Logout
      </Button>
    </header>
  );
}
