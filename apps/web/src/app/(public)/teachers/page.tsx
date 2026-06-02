'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { subjectName } from '@/lib/subject';
import { getAvatarUrl } from '@/lib/asset';

import { Footer } from '@/components/layout/footer';
import { Button, Card, CardContent, Skeleton, Breadcrumbs, cn } from '@oustadi/ui';
import { OfficialBadge, VerifiedBadge } from '@/components/teacher/status-badges';
import { MapPin, SlidersHorizontal, X, Star, Filter, Search, ChevronDown } from 'lucide-react';

const levels = ['primaire', 'collège', 'lycée', 'bac', 'université'];
const teachingModes = ['ONLINE', 'IN_PERSON', 'BOTH'];
const modeKey: Record<string, string> = { ONLINE: 'onlineLesson', IN_PERSON: 'inPersonLesson', BOTH: 'lessonTypeBoth' };
const sortOptions = ['', 'price_asc', 'price_desc', 'experience'];
const sortKey: Record<string, string> = { '': 'sortNewest', price_asc: 'sortPriceAsc', price_desc: 'sortPriceDesc', experience: 'sortExperience' };

function lastSeenText(lastSeen: string | null, locale: string, t: any): string {
  if (!lastSeen) return '';
  const diff = Date.now() - new Date(lastSeen).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('online');
  if (mins < 60) return t('minutesAgo', { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('hoursAgo', { n: hours });
  const days = Math.floor(hours / 24);
  return t('daysAgo', { n: days });
}

function FilterContent({ filters, setFilter, subjects }: {
  filters: any;
  setFilter: (key: string, value: any) => void;
  subjects: any[];
}) {
  const locale = useLocale();
  const h = useTranslations('home');
  const t = useTranslations('teacher');
  const c = useTranslations('common');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{c('search')}</h3>
        <div className="relative group">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input value={filters.query} onChange={(e) => setFilter('query', e.target.value)}
            placeholder={h('searchPlaceholder')}
            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 py-3 pr-10 pl-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none" />
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('filters')}</h3>
        
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-700 ml-1">{t('subject')}</label>
          <select value={filters.subjectId} onChange={(e) => setFilter('subjectId', e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-primary-500 outline-none transition-all cursor-pointer">
            <option value="">{c('all')}</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{subjectName(s, locale)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-700 ml-1">{t('level')}</label>
          <select value={filters.level} onChange={(e) => setFilter('level', e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-primary-500 outline-none transition-all cursor-pointer">
            <option value="">{c('all')}</option>
            {levels.map((l) => (
              <option key={l} value={l}>{l === 'université' ? t('universityLevel') : l}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-700 ml-1">{t('city')}</label>
          <input value={filters.city} onChange={(e) => setFilter('city', e.target.value)}
            placeholder={t('city')}
            className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-primary-500 outline-none transition-all" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-black text-gray-700">{t('price')}</label>
            <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg">{filters.maxPrice || '300'} {t('dh')}</span>
          </div>
          <input type="range" min="20" max="300" step="10" value={filters.maxPrice || '300'}
            onChange={(e) => setFilter('maxPrice', e.target.value === '300' ? '' : e.target.value)}
            className="w-full accent-primary-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-700 ml-1">{t('teachingMode')}</label>
          <div className="grid grid-cols-2 gap-2">
            {teachingModes.map((v) => (
              <button 
                key={v}
                onClick={() => setFilter('teachingMode', filters.teachingMode === v ? '' : v)}
                className={cn(
                  "px-3 py-2 text-[10px] font-black uppercase tracking-tight rounded-xl border transition-all",
                  filters.teachingMode === v 
                    ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                )}
              >
                {t(modeKey[v])}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <label className="flex items-center gap-3 group cursor-pointer">
          <div className={cn(
            "h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center",
            filters.verifiedOnly ? "bg-primary-600 border-primary-600 shadow-sm" : "border-gray-200 group-hover:border-primary-300"
          )}>
            {filters.verifiedOnly && <VerifiedBadge className="h-3 w-3 text-white" />}
          </div>
          <input type="checkbox" checked={filters.verifiedOnly}
            onChange={(e) => setFilter('verifiedOnly', e.target.checked)}
            className="hidden" />
          <span className="text-xs font-bold text-gray-700 group-hover:text-primary-600 transition-colors">{t('verifiedOnly')}</span>
        </label>

        <label className="flex items-center gap-3 group cursor-pointer">
          <div className={cn(
            "h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center",
            filters.availableToday ? "bg-primary-600 border-primary-600 shadow-sm" : "border-gray-200 group-hover:border-primary-300"
          )}>
            {filters.availableToday && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
          </div>
          <input type="checkbox" checked={filters.availableToday}
            onChange={(e) => setFilter('availableToday', e.target.checked)}
            className="hidden" />
          <span className="text-xs font-bold text-gray-700 group-hover:text-primary-600 transition-colors">{t('availableToday')}</span>
        </label>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const locale = useLocale();
  const h = useTranslations('home');
  const t = useTranslations('teacher');
  const c = useTranslations('common');

  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    query: sp.get('query') || '',
    subjectId: sp.get('subjectId') || '',
    level: sp.get('level') || '',
    city: sp.get('city') || '',
    maxPrice: sp.get('maxPrice') || '',
    minPrice: sp.get('minPrice') || '',
    teachingMode: sp.get('teachingMode') || '',
    gender: sp.get('gender') || '',
    minRating: sp.get('minRating') || '',
    verifiedOnly: sp.get('verifiedOnly') === 'true',
    availableToday: sp.get('availableToday') === 'true',
    sort: sp.get('sort') || '',
  });

  useEffect(() => {
    apiRequest('/subjects', { skipAuth: true }).then((r) => { if (r.success) setSubjects(r.data); });
  }, []);

  const buildQuery = useCallback((cursorVal?: string) => {
    const p = new URLSearchParams();
    if (filters.query) p.set('query', filters.query);
    if (filters.subjectId) p.set('subjectId', filters.subjectId);
    if (filters.level) p.set('levels', filters.level);
    if (filters.city) p.set('city', filters.city);
    if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
    if (filters.teachingMode) p.set('teachingMode', filters.teachingMode);
    if (filters.gender) p.set('gender', filters.gender);
    if (filters.minRating) p.set('minRating', filters.minRating);
    if (filters.verifiedOnly) p.set('verifiedOnly', 'true');
    if (filters.availableToday) p.set('availableToday', 'true');
    if (filters.sort) p.set('sort', filters.sort);
    if (cursorVal) p.set('cursor', cursorVal);
    p.set('limit', '20');
    return p.toString();
  }, [filters]);

  const fetchTeachers = useCallback(async (cursorVal?: string) => {
    setLoading(true);
    const res = await apiRequest<{ data: any[]; hasMore: boolean; cursor: string | null }>(
      `/teachers?${buildQuery(cursorVal)}`, { skipAuth: true }
    );
    if (res.success && res.data) {
      if (cursorVal) setTeachers((prev) => [...prev, ...res.data!.data]);
      else setTeachers(res.data!.data);
      setHasMore(res.data!.hasMore);
      setCursor(res.data!.cursor);
      setError(null);
    } else {
      setError(res.error || c('noResults'));
    }
    setLoading(false);
  }, [buildQuery]);

  useEffect(() => {
    fetchTeachers();
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, String(v)); });
    const qs = p.toString();
    router.replace(`/teachers${qs ? '?' + qs : ''}`, { scroll: false });
  }, [
    filters.query, filters.subjectId, filters.level, filters.city,
    filters.maxPrice, filters.teachingMode, filters.gender,
    filters.minRating, filters.verifiedOnly, filters.availableToday, filters.sort,
  ]);

  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setTeachers([]);
    setCursor(null);
  }, []);

  function resetFilters() {
    setFilters({
      query: '', subjectId: '', level: '', city: '', maxPrice: '', minPrice: '',
      teachingMode: '', gender: '', minRating: '', verifiedOnly: false,
      availableToday: false, sort: '',
    });
    setTeachers([]);
    setCursor(null);
  }

  const hasActiveFilters = Object.values(filters).some((v) => Boolean(v));

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12 text-right">
        <Breadcrumbs 
          locale={locale}
          items={[{ label: t('breadcrumbTeachers') }]} 
        />
        <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight lg:text-5xl">{h('searchTeachers')}</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-bold text-gray-400">{teachers.length} {t('teachersFound')}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative group">
              <ChevronDown className="absolute left-2.5 top-2.5 sm:left-3.5 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
              <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}
                className="appearance-none rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-white px-3 sm:px-5 py-2 sm:py-3 pr-8 sm:pr-10 text-[11px] sm:text-sm font-black focus:border-primary-500 outline-none transition-all cursor-pointer hover:border-gray-200">
                {sortOptions.map((v) => (
                  <option key={v} value={v}>{t(sortKey[v])}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" className="lg:hidden h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-black text-xs sm:text-sm shadow-sm" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('filters')}
            </Button>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-[10px] sm:text-xs font-black text-red-500 hover:text-red-700 transition-colors mr-2 sm:mr-3 whitespace-nowrap">{c('reset')}</button>
            )}
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 sticky top-24 shadow-soft">
              <FilterContent filters={filters} setFilter={setFilter} subjects={subjects} />
            </div>
          </aside>

          <div className="flex-1">
            {loading && teachers.length === 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden border-none bg-white rounded-xl sm:rounded-2xl">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-5">
                        <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl" />
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <Skeleton className="h-5 w-1/2 rounded-lg" />
                          <Skeleton className="h-4 w-1/3 rounded-lg" />
                        </div>
                      </div>
                      <Skeleton className="mt-4 sm:mt-6 h-4 w-full rounded-lg" />
                      <Skeleton className="mt-2 h-4 w-2/3 rounded-lg" />
                      <div className="mt-4 sm:mt-6 flex gap-2">
                        <Skeleton className="h-7 w-20 rounded-lg sm:rounded-xl" />
                        <Skeleton className="h-7 w-20 rounded-lg sm:rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <div className="h-16 w-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8" />
                </div>
                <p className="text-lg font-black text-gray-900">{error}</p>
              </div>
            ) : teachers.length === 0 ? (
              <div className="py-20 text-center">
                <div className="h-20 w-20 rounded-[2rem] bg-gray-50 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-200" />
                </div>
                <p className="text-xl font-black text-gray-900">{c('noResults')}</p>
                <p className="text-sm font-bold text-gray-400 mt-2">{t('tryChangingFilters')}</p>
                <Button variant="outline" className="mt-8 rounded-2xl font-black" onClick={resetFilters}>{c('reset')}</Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {teachers.map((teacher) => (
                    <Link key={teacher.id} href={`/teachers/${teacher.id}`} className="group">
                      <Card className="h-full border-none shadow-sm sm:shadow-soft group-hover:shadow-premium-hover transition-all duration-300 rounded-xl sm:rounded-[2rem] overflow-hidden">
                        <CardContent className="p-5 sm:p-7">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="relative shrink-0">
                              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl sm:rounded-[1.25rem] bg-primary-100 text-base sm:text-xl font-black text-primary-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                {teacher.avatarKey
                                  ? <img src={getAvatarUrl(teacher.avatarKey)} alt="" className="h-full w-full object-cover" />
                                  : teacher.fullName?.charAt(0)}
                              </div>
                              {teacher.isOnline && (
                                <span className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full border-3 sm:border-4 border-white bg-green-500 shadow-sm" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors truncate">{teacher.fullName}</h3>
                                {teacher.isOfficial ? (
                                  <OfficialBadge className="scale-75 sm:scale-90 origin-right" />
                                ) : teacher.isVerified ? (
                                  <VerifiedBadge className="scale-75 sm:scale-90 origin-right" />
                                ) : null}
                              </div>
                              <div className="flex items-center gap-3">
                                {teacher.city && (
                                  <p className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-500" /> {teacher.city}
                                  </p>
                                )}
                                {teacher.reviewCount > 0 && (
                                  <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                                    <Star className="h-3 w-3 fill-amber-500" /> {teacher.reviewCount}
                                  </div>
                                )}
                              </div>
                            </div>
                            {teacher.price && (
                              <div className="shrink-0 text-left">
                                <p className="text-lg sm:text-xl font-black text-primary-600 tracking-tighter leading-none">{teacher.price}</p>
                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('dhPerHour')}</p>
                              </div>
                            )}
                          </div>

                          {teacher.bio && (
                            <p className="mt-4 sm:mt-5 text-xs sm:text-sm font-medium text-gray-500 line-clamp-2 leading-relaxed">
                              {teacher.bio}
                            </p>
                          )}

                          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                            {teacher.subjects?.slice(0, 3).map((s: any) => (
                              <span key={s.id} className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black text-gray-600 group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:text-primary-700 transition-colors">
                                {subjectName(s, locale)}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <span className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                {teacher.experience || 0} {t('yearsExperience')}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-gray-200" />
                              <span className={cn(
                                "text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-lg",
                                teacher.teachingMode === 'ONLINE' ? "bg-blue-50 text-blue-600" : teacher.teachingMode === 'IN_PERSON' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                              )}>
                                {teacher.teachingMode === 'ONLINE' ? t('online') : teacher.teachingMode === 'IN_PERSON' ? t('inPerson') : t('both')}
                              </span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                              {teacher.isOnline ? t('online') : lastSeenText(teacher.lastSeen, locale, t)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-12 text-center">
                    <Button variant="outline" className="h-13 rounded-2xl px-10 font-black border-2 shadow-sm hover:shadow-md transition-all" onClick={() => fetchTeachers(cursor ?? undefined)} disabled={loading}>
                      {loading ? c('loading') : t('loadMore')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {showFilters && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 ease-out">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{t('filters')}</h2>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{teachers.length} {t('teachersCount')}</p>
              </div>
              <button onClick={() => setShowFilters(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-all"><X className="h-5 w-5" /></button>
            </div>
            <FilterContent filters={filters} setFilter={setFilter} subjects={subjects} />
            <div className="sticky bottom-0 mt-8 pt-4 pb-2 bg-white flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-xl font-black" onClick={resetFilters}>{c('reset')}</Button>
              <Button className="flex-[2] h-12 rounded-xl font-black shadow-lg shadow-primary-500/20" onClick={() => setShowFilters(false)}>{c('apply')}</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
