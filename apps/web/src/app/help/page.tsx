import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HelpContent } from '@/components/pages/help-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('helpPage');
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  };
}

export default async function HelpPage() {
  return <HelpContent />;
}
