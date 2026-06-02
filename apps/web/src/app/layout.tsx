import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, getTranslations } from 'next-intl/server';
import { Providers } from '@/providers/providers';
import { GlobalHeader } from '@/components/layout/global-header';
import { NotifierShell } from '@/components/notifier-shell';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('appName')} | ${locale === 'fr' ? 'Plateforme éducative marocaine' : 'منصة التعليم المغربية'}`,
    description: locale === 'fr'
      ? 'Oustadi est une plateforme marocaine qui connecte enseignants et étudiants. Trouvez votre professeur idéal dans toutes les villes marocaines.'
      : 'أستادي هي منصة مغربية تربط بين الأساتذة والطلاب. ابحث عن أستاذك المثالي في جميع المدن المغربية.',
    openGraph: {
      title: `${t('appName')}`,
      description: locale === 'fr'
        ? 'Plateforme marocaine qui connecte enseignants et étudiants'
        : 'منصة مغربية تربط بين الأساتذة والطلاب',
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'ar_MA',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`${inter.variable} ${notoArabic.variable} font-sans min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <NotifierShell>
              <GlobalHeader />
              <main className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] overflow-x-hidden">
                {children}
              </main>
            </NotifierShell>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
