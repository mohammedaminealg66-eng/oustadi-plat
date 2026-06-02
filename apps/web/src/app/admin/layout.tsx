'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BarChart3, Users, FileText, BookOpen, AlertTriangle, MessageSquare, Settings, Menu, X, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ADMIN') router.replace('/' + user.role.toLowerCase());
  }, [user, loading, router]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center text-gray-500 dark:text-gray-400">{t('common.loading')}</div>;

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  const mainNav = [
    { href: '/admin', label: t('admin.dashboard'), icon: BarChart3 },
  ];

  const managementNav = [
    { href: '/admin/users', label: t('admin.users'), icon: Users },
    { href: '/admin/teachers', label: t('admin.manageTeachers'), icon: FileText },
    { href: '/admin/subjects', label: t('admin.subjects'), icon: BookOpen },
  ];

  const moderationNav = [
    { href: '/admin/documents', label: t('admin.documents'), icon: FileText },
    { href: '/admin/reports', label: t('admin.reports'), icon: FileText },
    { href: '/admin/disputes', label: t('admin.disputes'), icon: AlertTriangle },
  ];

  const otherNav = [
    { href: '/admin/chat', label: t('dashboard.messages'), icon: MessageSquare },
    { href: '/admin/settings', label: t('dashboard.settings'), icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {sidebarOpen && <div className="fixed inset-0 z-[55] bg-black/50 dark:bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-[60] w-64 border-l bg-white p-4 transition-transform lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-gray-900 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link href="/" className="mb-6 flex items-center gap-2 text-lg font-bold text-primary-600">
          <Shield className="h-5 w-5" />
          {t('common.appName')}
        </Link>

        <div className="space-y-6">
          <div>
            <nav className="space-y-1">
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Management</p>
            <nav className="space-y-1">
              {managementNav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Moderation</p>
            <nav className="space-y-1">
              {moderationNav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <nav className="space-y-1">
              {otherNav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex flex-col flex-1 min-w-0 overflow-auto bg-gray-50 dark:bg-gray-950">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white/80 backdrop-blur-sm px-4 py-3 lg:hidden dark:border-gray-800 dark:bg-gray-900/80">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 active:scale-95 transition-all dark:hover:bg-gray-800">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-primary-600">
            <Shield className="h-4 w-4" />
            {t('common.appName')}
          </Link>
        </div>
        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
