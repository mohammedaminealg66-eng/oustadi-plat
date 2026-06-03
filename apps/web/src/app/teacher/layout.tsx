'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, MessageSquare, Settings, Users, FileText, Menu, X, GraduationCap } from 'lucide-react';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'TEACHER') router.replace('/' + user.role.toLowerCase());
  }, [user, loading, router]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-gray-500 dark:text-gray-400">{t('common.loading')}</div>;

  function isActive(href: string) {
    if (href === '/teacher') return pathname === '/teacher';
    return pathname.startsWith(href);
  }

  const nav = [
    { href: '/teacher', label: t('dashboard.overview'), icon: LayoutDashboard },
    { href: '/teacher/profile', label: t('dashboard.myProfile'), icon: FileText },
    { href: '/teacher/requests', label: t('dashboard.requests'), icon: Users },
    { href: '/teacher/chat', label: t('dashboard.messages'), icon: MessageSquare },
    { href: '/teacher/settings', label: t('dashboard.settings'), icon: Settings },
  ];

  const isRtl = locale === 'ar';
  const sidebarPosition = isRtl ? 'right-0 border-l' : 'left-0 border-r';
  const sidebarTransform = sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-950">
      {sidebarOpen && <div className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm dark:bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 ${sidebarPosition} z-[70] w-72 border-gray-100 bg-white p-6 transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-gray-900 ${sidebarTransform}`}>
        <div className="flex flex-col h-full">
          <div className="mb-10 px-2">
            <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
              <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter uppercase dark:text-gray-100">{t('common.appName')}</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1.5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2 dark:text-gray-500">{t('dashboard.menu')}</h3>
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 group ${
                    active 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 active:scale-[0.98] dark:bg-primary-500' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}>
                   <item.icon className={`h-5 w-5 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary-500 dark:text-gray-500 dark:group-hover:text-primary-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 dark:text-gray-500">{t('common.needHelp')}</p>
              <Link href="/help" className="text-xs font-bold text-primary-600 hover:underline">
                {t('common.contactSupport')}
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-col flex-1 min-w-0 overflow-auto dark:bg-gray-950">
        <div className="sticky top-14 z-30 flex items-center gap-3 border-b border-gray-100 bg-white/85 backdrop-blur-sm px-4 py-2.5 lg:hidden dark:border-gray-800 dark:bg-gray-900/80">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-black text-gray-600 hover:bg-gray-100 active:scale-95 transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span>{t('dashboard.menu')}</span>
          </button>
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
