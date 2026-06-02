'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { getTokens } from '@/lib/api';
import { getSocket } from '@/lib/socket-client';
import { X, MessageSquare } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  body: string;
  link?: string;
}

export function LiveNotifier() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = getTokens().accessToken;
    if (!token) return;

    const s = getSocket(token);

    const handler = (data: any) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, title: data.title, body: data.body, link: data.link }]);
      window.dispatchEvent(new CustomEvent('refresh-notifications'));
    };

    s.on('notification:new', handler);
    return () => { s.off('notification:new', handler); };
  }, [isAuthenticated, user]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts((prev) => prev.slice(1)), 5000);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:top-24 md:bottom-auto md:right-8 z-[150] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => { if (toast.link) router.push(toast.link); dismiss(toast.id); }}
          className="flex w-full md:w-85 cursor-pointer pointer-events-auto items-start gap-4 rounded-3xl glass-dark text-white p-5 shadow-2xl border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] animate-slide-in group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black tracking-tight leading-none">{toast.title}</p>
            <p className="mt-1.5 truncate text-[11px] font-bold text-gray-400 uppercase tracking-widest">{toast.body}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); dismiss(toast.id); }} className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
