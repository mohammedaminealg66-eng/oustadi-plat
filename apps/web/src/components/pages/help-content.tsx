'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Mail,
  MessageSquare,
  CreditCard,
  LogIn,
  User,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Send,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';

const TOPICS = [
  { key: 'topicBooking', icon: MessageSquare },
  { key: 'topicPayment', icon: CreditCard },
  { key: 'topicLogin', icon: LogIn },
  { key: 'topicProfile', icon: User },
  { key: 'topicMessaging', icon: MessageCircle },
  { key: 'topicOther', icon: HelpCircle },
] as const;

const FAQS = [
  { q: 'faqQ1', a: 'faqA1' },
  { q: 'faqQ2', a: 'faqA2' },
  { q: 'faqQ3', a: 'faqA3' },
  { q: 'faqQ4', a: 'faqA4' },
  { q: 'faqQ5', a: 'faqA5' },
] as const;

export function HelpContent() {
  const t = useTranslations('helpPage');
  const c = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [form, setForm] = useState({ fullName: '', email: '', userType: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSubmitted(true);
    setForm({ fullName: '', email: '', userType: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <>
      <section className="relative pt-16 pb-12 md:pt-20 md:pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-primary-100/50 rounded-full blur-[80px] md:blur-[120px] -z-10 dark:bg-primary-900/50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-secondary-100/50 rounded-full blur-[60px] md:blur-[100px] -z-10 dark:bg-secondary-900/50" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-400 dark:hover:text-primary-300"
          >
            {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t('backToHome')}
          </Link>

          <div className="text-center mt-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight dark:text-gray-100">
              {t('pageTitle')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg font-medium text-gray-500 leading-relaxed dark:text-gray-400">
              {t('pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary-600 mb-6 dark:text-primary-400">
                  {t('helpTopics')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {TOPICS.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <div
                        key={topic.key}
                        className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t(topic.key)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary-600 mb-6 dark:text-primary-400">
                  {t('faqSection')}
                </h2>
                <div className="space-y-3">
                  {FAQS.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-gray-100 bg-white shadow-soft transition-all dark:border-gray-700 dark:bg-gray-800"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left"
                        >
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{t(faq.q)}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            {t(faq.a)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-soft dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
                  <Mail className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">{t('contactMethod')}</h3>
                <a
                  href="mailto:contact@oustadi.tech"
                  className="mt-3 inline-block text-sm font-bold text-primary-600 hover:underline dark:text-primary-400"
                >
                  {t('supportEmail')}
                </a>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-soft dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-base font-black text-gray-900 dark:text-gray-100">{t('supportForm')}</h3>
                {submitted ? (
                  <div className="mt-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/30">
                      <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-black text-gray-900 dark:text-gray-100">{t('successTitle')}</p>
                    <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{t('successMessage')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {t('fullName')}
                      </label>
                      <input
                        value={form.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder={t('placeholderFullName')}
                        required
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-primary-600 dark:focus:bg-gray-950"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={t('placeholderEmail')}
                        required
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-primary-600 dark:focus:bg-gray-950"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {t('userType')}
                      </label>
                      <select
                        value={form.userType}
                        onChange={(e) => handleChange('userType', e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-primary-600 dark:focus:bg-gray-950"
                      >
                        <option value="">--</option>
                        <option value="student">{t('student')}</option>
                        <option value="teacher">{t('teacher')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {t('subject')}
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-primary-600 dark:focus:bg-gray-950"
                      >
                        <option value="">{t('placeholderSubject')}</option>
                        {TOPICS.map((topic) => (
                          <option key={topic.key} value={topic.key}>
                            {t(topic.key)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {t('message')}
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder={t('placeholderMessage')}
                        required
                        rows={4}
                        className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-primary-600 dark:focus:bg-gray-950"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t('send')}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3.5rem] bg-gray-900 p-8 sm:p-12 lg:p-16 shadow-2xl">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-600/20 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary-600/20 blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t('emergencyTitle')}</h2>
              <p className="mt-4 max-w-lg text-base font-medium text-gray-400">{t('emergencyDesc')}</p>
              <a
                href="mailto:contact@oustadi.tech"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-gray-900 shadow-xl transition-all hover:bg-gray-100 active:scale-[0.98]"
              >
                <Mail className="h-4 w-4" />
                contact@oustadi.tech
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Footer() {
  const t = useTranslations('common');
  const year = new Date().getFullYear();

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
              <Link href="/help" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('contactSupport')}</Link>
              <Link href="/terms" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('terms')}</Link>
              <Link href="/privacy" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">{t('privacy')}</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-gray-50 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
