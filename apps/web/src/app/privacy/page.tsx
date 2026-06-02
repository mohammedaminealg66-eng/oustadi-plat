import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';

const SECTIONS = [
  'pinfo', 'paccount', 'pbooking', 'pmessaging',
  'ppayment', 'pcookies', 'pusage', 'pretention',
  'prights', 'psecurity', 'pcontact',
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal');
  return {
    title: t('privacyTitle'),
    description: t('privacyDesc'),
  };
}

export default async function PrivacyPage() {
  const tl = await getTranslations('legal');
  const tc = await getTranslations('common');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        {tc('backToHome')}
      </Link>

      <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 sm:text-4xl">
        {tl('privacyTitle')}
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {tl('lastUpdated', { date: '1 يونيو 2026' })}
      </p>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => {
          const content = tl(`${section}Content`);
          const paragraphs = content.split('\n\n');
          return (
            <section key={section}>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                {tl(`${section}Title`)}
              </h2>
              <div className="space-y-3">
                {paragraphs.map((p: string, i: number) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
