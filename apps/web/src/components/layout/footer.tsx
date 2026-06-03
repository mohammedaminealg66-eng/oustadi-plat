'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { GraduationCap } from 'lucide-react';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="border-t border-gray-100 bg-white py-12 sm:py-20 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform group">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100 tracking-tighter uppercase">{t('appName')}</span>
            </Link>
            <p className="max-w-xs text-xs sm:text-sm font-medium text-gray-400 leading-relaxed uppercase tracking-widest">{t('tagline')}</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-gray-100">{t('navigation')}</h4>
            <nav className="flex flex-col gap-3 sm:gap-4">
              <Link href="/teachers" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('teachers')}</Link>
              <Link href="/login" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('login')}</Link>
              <Link href="/register" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('register')}</Link>
            </nav>
          </div>

          <div className="space-y-4 sm:space-y-6 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-gray-100">{t('support')}</h4>
            <nav className="flex flex-col gap-3 sm:gap-4">
              <a href="mailto:contact@oustadi.tech" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('contactSupport')}</a>
              <Link href="/terms" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('terms')}</Link>
              <Link href="/privacy" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('privacy')}</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-gray-50 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
