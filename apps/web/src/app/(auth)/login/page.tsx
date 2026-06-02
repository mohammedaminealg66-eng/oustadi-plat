'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { Button, Input, Card, CardContent, CardHeader } from '@oustadi/ui';

import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations('auth');
  const c = useTranslations('common');
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || c('error'));
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 py-12 dark:bg-gray-900/50">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px] -z-10 dark:bg-primary-900/30" />
      <div className="fixed bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary-100/30 rounded-full blur-[100px] -z-10 dark:bg-secondary-900/30" />

      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 sm:mb-10 flex items-center justify-center gap-2 group transition-transform active:scale-95">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-500/20 group-hover:rotate-6 transition-transform">
             <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase dark:text-gray-100">{c('appName')}</span>
        </Link>

        <Card className="border-none shadow-2xl shadow-gray-900/5 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-800">
          <CardHeader className="pt-8 sm:pt-10 pb-4 sm:pb-6 text-center border-none">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight dark:text-gray-100">{c('login')}</h1>
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest dark:text-gray-500">{t('welcomeBack')}</p>
          </CardHeader>
          <CardContent className="px-5 sm:px-8 pb-8 sm:pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-2xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-xs font-black text-red-600 text-center uppercase tracking-widest dark:text-red-400">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <Input id="email" label={t('email')} type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="space-y-1">
                  <Input id="password" label={t('password')} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <div className="flex justify-end px-1">
                    <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-400 dark:hover:text-primary-500">{t('forgotPassword')}</Link>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 sm:h-14 rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-primary-500/20" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {c('loading')}
                  </div>
                ) : c('login')}
              </Button>
            </form>

            {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true' && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700" /></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-gray-500"><span className="bg-white px-4 dark:bg-gray-800">{c('or')}</span></div>
                </div>

                <a href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/google`}
                  className="flex w-full h-14 items-center justify-center gap-3 rounded-2xl border-2 border-gray-50 bg-white px-4 text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-100 transition-all active:scale-[0.98] shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  {t('continueWithGoogle')}
                </a>
              </>
            )}

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
                {t('noAccount')} <Link href="/register" className="font-black text-primary-600 hover:text-primary-700 underline decoration-primary-200 underline-offset-4 decoration-2 dark:text-primary-400 dark:hover:text-primary-500 dark:decoration-primary-700">{c('register')}</Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
           <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300">
              <ArrowLeft className="h-4 w-4" /> {c('backToHome')}
           </Link>
        </div>
      </div>
    </div>
  );
}
