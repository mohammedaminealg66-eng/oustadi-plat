'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { apiRequest } from '@/lib/api';
import { getAvatarUrl } from '@/lib/asset';
import { Button, cn } from '@oustadi/ui';
import { Bell, LogOut, ChevronDown, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';

const languages = [
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
];

function switchLocale(code: string) {
  document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
}

export function GlobalHeader() {
  const t = useTranslations();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const currentLang = languages.find((l) => l.code === (typeof window !== 'undefined' ? document.documentElement.lang : 'ar')) || languages[0];
  const isRtl = currentLang.code === 'ar';

  function fetchNotifications() {
    if (!isAuthenticated) return;
    apiRequest('/notifications').then((res) => {
      if (res.success && res.data) setNotifications(res.data);
    });
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    window.addEventListener('refresh-notifications', fetchNotifications);
    return () => { clearInterval(interval); window.removeEventListener('refresh-notifications', fetchNotifications); };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!profileOpen && !langOpen && !notifOpen && !mobileMenuOpen) return;
    const handler = () => { setLangOpen(false); setNotifOpen(false); setProfileOpen(false); setMobileMenuOpen(false); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [profileOpen, langOpen, notifOpen, mobileMenuOpen]);

  async function markAllRead() {
    await apiRequest('/notifications/read-all', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const dashboardHref = user?.role === 'ADMIN' ? '/admin' : user?.role === 'TEACHER' ? '/teacher' : '/student';

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-gray-100/50 dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 active:scale-95 transition-all md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform">
            <img src="/logo.png" alt="Oustadi" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 drop-shadow-sm" />
            <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tighter whitespace-nowrap shrink-0 hidden min-[360px]:inline dark:text-white">{t('common.appName')}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/teachers" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-all">
            {t('common.teachers')}
          </Link>
          {isAuthenticated && (
            <Link href={dashboardHref} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-all">
              {t('dashboard.overview')}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button onClick={toggleTheme} className="flex items-center justify-center rounded-xl p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600 transition-all dark:hover:bg-gray-800" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }} className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black tracking-widest text-gray-400 hover:text-primary-600 hover:bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-gray-100 transition-all uppercase">{currentLang.label} <ChevronDown className="hidden sm:inline-block h-3 w-3" /></button>
            {langOpen && (
              <div className="absolute end-0 mt-3 w-40 rounded-2xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => { setLangOpen(false); switchLocale(lang.code); window.location.reload(); }} className="flex w-full px-4 py-3 text-sm text-right font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">{t(lang.code === 'ar' ? 'dashboard.languageArabic' : 'dashboard.languageFrench')}</button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }} className="relative p-1.5 sm:p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-all active:scale-90">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 sm:top-2 sm:right-2 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[7px] sm:text-[9px] text-white font-black ring-2 ring-white shadow-sm">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute end-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 rounded-3xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 px-5 py-4">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-wider">{t('common.notifications')}</span>
                      <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700">{t('common.markAllRead')}</button>
                    </div>
                    <div className="max-h-[24rem] overflow-y-auto scrollbar-hide">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                          <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                            <Bell className="h-6 w-6 text-gray-200" />
                          </div>
                          <p className="text-sm font-bold text-gray-400">{t('common.noNotifications')}</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <Link key={n.id} href={n.link || '#'} onClick={() => setNotifOpen(false)} className={`block border-b border-gray-50 px-5 py-5 text-sm transition-colors hover:bg-gray-50/80 ${n.isRead ? 'bg-white' : 'bg-primary-50/30'}`}>
                            <p className="font-bold text-gray-900 leading-snug">{n.title}</p>
                            <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">{n.body}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }} className="flex items-center gap-1 sm:gap-2 rounded-2xl border border-transparent p-0.5 sm:p-1 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all active:scale-95">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-sm overflow-hidden">
                    {user?.avatarKey ? <Image src={getAvatarUrl(user.avatarKey)} alt="" width={32} height={32} className="object-cover" /> : user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
                </button>
                {profileOpen && (
                  <div className="absolute end-0 mt-3 w-[calc(100vw-2rem)] sm:w-64 rounded-3xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-50">
                      <p className="text-sm font-black text-gray-900 truncate tracking-tight">{user?.fullName}</p>
                      <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5 tracking-wider uppercase">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href={user?.role === 'TEACHER' ? '/teacher/settings' : user?.role === 'ADMIN' ? '/admin/settings' : '/student/settings'} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-700 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all">
                        {t('dashboard.settings')}
                      </Link>
                      <div className="my-1 border-t border-gray-50 mx-2" />
                      <button onClick={() => { setProfileOpen(false); logout(); }} className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-black text-red-600 rounded-2xl hover:bg-red-50 transition-all">
                        <LogOut className="h-4 w-4" /> {t('common.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/login" className="hidden sm:block"><Button variant="ghost" size="sm" className="font-black tracking-tight text-gray-600">{t('common.login')}</Button></Link>
              <Link href="/register"><Button size="sm" className="font-black px-3 sm:px-6 tracking-tight shadow-lg shadow-primary-500/20">{t('common.register')}</Button></Link>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Mobile Menu Drawer */}
      <div className={cn("fixed inset-0 z-[100] md:hidden pointer-events-none transition-all duration-300", mobileMenuOpen && "pointer-events-auto")}>
        <div className={cn("fixed inset-0 bg-gray-900/0 backdrop-blur-0 transition-all duration-300", mobileMenuOpen && "bg-gray-900/40 backdrop-blur-md")} onClick={() => setMobileMenuOpen(false)} />
        <nav className={cn(
          "fixed inset-y-0 w-[280px] sm:w-[300px] bg-white shadow-2xl flex flex-col p-6 sm:p-8 transition-transform duration-300 ease-out",
          "start-0 rounded-e-[2.5rem]",
          mobileMenuOpen ? "translate-x-0" : (isRtl ? "translate-x-full" : "-translate-x-full")
        )}>
          <div className="flex items-center justify-between mb-10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 active:scale-95 transition-transform shrink-0">
              <img src="/logo.png" alt="Oustadi" className="h-8 w-8 drop-shadow-sm shrink-0" />
              <span className="font-black text-gray-900 text-xl tracking-tighter whitespace-nowrap shrink-0 dark:text-white">{t('common.appName')}</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/teachers" onClick={() => setMobileMenuOpen(false)} className="px-5 py-4 text-base font-black text-gray-700 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent active:scale-[0.98]">
              {t('common.teachers')}
            </Link>
            {isAuthenticated && (
              <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} className="px-5 py-4 text-base font-black text-gray-700 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent active:scale-[0.98]">
                {t('dashboard.overview')}
              </Link>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-black h-13 rounded-2xl tracking-tight">{t('common.login')}</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full font-black h-13 rounded-2xl tracking-tight shadow-xl shadow-primary-500/20">{t('common.register')}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                  <div className="h-12 w-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-black shadow-sm">
                    {user?.fullName?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 truncate tracking-tight">{user?.fullName}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate tracking-widest uppercase">{user?.email}</p>
                  </div>
                </div>
                <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex w-full items-center justify-center gap-3 px-5 py-4 font-black text-red-600 bg-red-50 rounded-2xl active:scale-[0.98] transition-all">
                  <LogOut className="h-5 w-5" /> {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
