import { getTranslations } from 'next-intl/server';
import { Footer } from '@/components/layout/footer';
import { CtaButtons } from '@/components/cta-buttons';

export default async function HomePage() {
  const t = await getTranslations('home');

  const steps = [
    { key: 'cardStudent', icon: '1' },
    { key: 'cardTeacher', icon: '2' },
    { key: 'cardConnect', icon: '3' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-20 md:pb-32 lg:pt-32 lg:pb-48">
          {/* Background Blobs - Responsive sizes to prevent mobile overflow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-primary-100/50 rounded-full blur-[80px] md:blur-[120px] -z-10 dark:bg-primary-900/50" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-secondary-100/50 rounded-full blur-[60px] md:blur-[100px] -z-10 dark:bg-secondary-900/50" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 leading-[1.2] md:leading-[1.1] dark:text-gray-100">
              {t.rich('heroTitle', { span: (chunks) => <span className="text-primary-600 drop-shadow-sm dark:text-primary-400">{chunks}</span> })}
            </h1>
            <p className="mx-auto mt-6 sm:mt-10 max-w-2xl text-base sm:text-lg md:text-xl font-medium text-gray-500 leading-relaxed dark:text-gray-400 px-2 md:px-0">
              {t('heroSubtitle')}
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CtaButtons />
            </div>
            
            <div className="mt-20 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for logos if needed */}
            </div>
          </div>
        </section>

        {/* Features / How it works */}
        <section className="py-16 sm:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 sm:mb-20 text-center">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary-600 mb-4 dark:text-primary-400">{t('process') || 'العملية'}</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight sm:text-5xl dark:text-gray-100">{t('howItWorks')}</h3>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.key} className="group relative rounded-[2.5rem] border border-gray-100 bg-white p-6 sm:p-10 shadow-soft transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-2 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-6 sm:mb-8 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-50 text-lg sm:text-xl font-black text-primary-600 shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 group-hover:rotate-6 dark:bg-gray-900 dark:text-primary-400">
                    {step.icon}
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 tracking-tight mb-4 dark:text-gray-100">{t(step.key + 'Title')}</h4>
                  <p className="text-base font-medium leading-relaxed text-gray-500 dark:text-gray-400">{t(step.key + 'Desc')}</p>
                  
                  <div className="absolute top-10 left-10 h-16 w-16 bg-primary-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Stats Section */}
        <section className="py-16 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] sm:rounded-[3.5rem] bg-gray-900 p-6 sm:p-12 lg:p-20 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[80px]" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-600/20 rounded-full blur-[80px]" />
               
               <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
                  <div className="text-right">
                     <h3 className="text-2xl sm:text-3xl font-black text-white sm:text-5xl leading-tight">
                        {t('joinCommunity') || 'انضم إلى أكبر مجتمع تعليمي في المغرب'}
                     </h3>
                     <p className="mt-6 text-lg text-gray-400 font-medium leading-relaxed dark:text-gray-500">
                        {t('joinCommunityDesc') || 'أكثر من 5000 أستاذ وطالب يثقون في أستادي لتحقيق أهدافهم التعليمية.'}
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                     <div className="p-5 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                         <p className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2">5k+</p>
                         <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t('activeUsers') || 'مستخدم نشط'}</p>
                      </div>
                      <div className="p-5 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                         <p className="text-2xl sm:text-4xl font-black text-primary-400 mb-1 sm:mb-2">98%</p>
                         <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t('satisfaction') || 'رضا المستخدمين'}</p>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      <Footer />
    </>
  );
}
