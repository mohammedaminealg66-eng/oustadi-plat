'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';

import { Button } from '@oustadi/ui';

export function CtaButtons() {
  const h = useTranslations('home');
  const c = useTranslations('common');
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      <Link href="/teachers" className="w-full sm:w-auto">
        <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary-500/20 active:scale-[0.98] transition-all">
          {h('browseTeachers')}
        </Button>
      </Link>
      {!isAuthenticated && (
        <Link href="/register" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl font-black text-lg border-2 bg-white/50 backdrop-blur-sm shadow-xl shadow-gray-900/5 active:scale-[0.98] transition-all">
            {c('freeRegister')}
          </Button>
        </Link>
      )}
    </div>
  );
}
