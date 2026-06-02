'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { subjectName } from '@/lib/subject';
import { getAvatarUrl, getYouTubeEmbedUrl } from '@/lib/asset';
import { useAuth } from '@/providers/auth-provider';

import { Footer } from '@/components/layout/footer';
import { Button, Card, CardContent, Badge, Skeleton } from '@oustadi/ui';
import { SocialLinks } from '@/components/teacher/social-links';
import { TeacherHeader } from '@/components/teacher/teacher-header';
import {
  BookOpen, Star, MessageSquare, Video, ShieldCheck, Share2, Flag, X,
} from 'lucide-react';

interface Review {
  id: string; rating: number; comment: string | null; createdAt: string;
  student: { id: string; fullName: string; avatarKey: string | null };
}
interface TeacherProfile {
  id: string; userId: string; bio: string | null; experience: number | null;
  price: number | null; teachingMode: string; city: string | null;
  showContact: boolean; isVerified: boolean; isOfficial: boolean; responseTime: string | null;
  introVideo: string | null; avgRating: number | null; studentCount: number;
  facebookUrl: string | null; instagramUrl: string | null; linkedinUrl: string | null;
  youtubeUrl: string | null; websiteUrl: string | null;
  tiktokUrl: string | null; twitterUrl: string | null; telegramUrl: string | null;
  user: { id: string; fullName: string; avatarKey: string | null; phone: string | null; createdAt: string; isOnline: boolean; lastSeen: string | null };
  subjects: { id: string; subject: { id: string; nameAr: string; nameFr: string }; levels: string[]; price: number | null }[];
  availability: { id: string; dayOfWeek: number; startTime: string; endTime: string }[];
  documents: { id: string; type: string; fileName: string; originalName: string; createdAt: string; isVerified: boolean }[];
  reviews: Review[];
  _count: { favorites: number; reviews: number };
}

const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${s} ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </div>
  );
}

function StarRatingInput({ rating, onChange, size = 'md' }: { rating: number; onChange: (r: number) => void; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} className="transition-transform hover:scale-110">
          <Star className={`${s} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} cursor-pointer`} />
        </button>
      ))}
    </div>
  );
}

export default function TeacherProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const reviewRequestId = searchParams?.get('requestId') || undefined;
  const locale = useLocale();
  const t = useTranslations('teacher');
  const c = useTranslations('common');
  const d = useTranslations('dashboard');
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [faved, setFaved] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [lessonType, setLessonType] = useState<string>('ONLINE');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError] = useState('');

  const dayT = useTranslations('days');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [existingReview, setExistingReview] = useState<{ rating: number; comment: string | null; requestId: string | null } | null>(null);

  useEffect(() => {
    async function fetch() {
      const res = await apiRequest<TeacherProfile>(`/teachers/${id}`, { skipAuth: true });
      if (res.success && res.data) setProfile(res.data as TeacherProfile);
      setLoading(false);
    }
    fetch();

    apiRequest('/teachers?limit=4', { skipAuth: true }).then((r: any) => {
      const items = r.data?.data || r.data || [];
      setSimilar(Array.isArray(items) ? items.filter((t: any) => t.id !== id).slice(0, 3) : []);
    });
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== 'STUDENT') return;
    apiRequest<any[]>('/students/favorites').then((res) => {
      if (res.success && res.data) setFaved(res.data.some((fav: any) => profile && fav.teacherId === profile.id));
    });
  }, [user, profile]);

  useEffect(() => {
    if (!user || user.role !== 'STUDENT' || !profile) return;
    apiRequest<{ id: string; teacherId: string; rating: number; comment: string | null; requestId: string | null }[]>('/students/reviews/mine').then((res) => {
      if (res.success && res.data) {
        let mine;
        if (reviewRequestId) {
          mine = res.data.find((r) => r.requestId === reviewRequestId);
        } else {
          mine = res.data.find((r) => r.teacherId === profile.id);
        }
        if (mine) {
          setExistingReview(mine);
          setReviewRating(mine.rating);
          setReviewComment(mine.comment || '');
        }
      }
    });
  }, [user, profile, reviewRequestId]);

  async function toggleFav() {
    if (!user) { router.push('/login'); return; }
    setToggling(true);
    const res = await apiRequest(`/students/favorites/${profile?.id}`, { method: 'POST' });
    setToggling(false);
    if (res.success) setFaved(res.data?.favorited ?? !faved);
  }

  function handleBookLesson() {
    if (!user) { router.push('/login'); return; }
    setRequestError('');
    setShowBookingForm(true);
  }

  async function handleSendRequest() {
    if (!selectedSubjectId || !profile) return;
    setRequestError('');
    setSendingRequest(true);
    const res = await apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: profile.user.id,
        subjectId: selectedSubjectId,
        message: bookingMessage,
        lessonType,
        bookedDate: selectedDate,
        bookedTime: selectedTime,
      }),
    });
    setSendingRequest(false);
    if (res.success) {
      setShowBookingForm(false);
      setSelectedSubjectId('');
      setBookingMessage('');
      setSelectedDate('');
      setSelectedTime('');
      setLessonType('ONLINE');
    } else {
      setRequestError(res.error || t('requestFailed'));
    }
  }

  async function handleMessageTeacher() {
    if (!user) { router.push('/login'); return; }
    if (!profile?.user?.id) return;
    const res = await apiRequest('/conversations', {
      method: 'POST',
      body: JSON.stringify({ teacherId: profile.user.id }),
    });
    if (res.success) {
      router.push(user.role === 'TEACHER' ? '/teacher/chat' : '/student/chat');
    }
  }

  async function handleSubmitReview() {
    if (reviewRating === 0 || !profile) return;
    setSubmittingReview(true);
    setReviewError('');
    const res = await apiRequest('/students/reviews', {
      method: 'POST',
      body: JSON.stringify({ teacherId: profile.id, rating: reviewRating, comment: reviewComment || undefined, requestId: reviewRequestId }),
    });
    setSubmittingReview(false);
    if (res.success) {
      setReviewSubmitted(true);
      setExistingReview({ rating: reviewRating, comment: reviewComment, requestId: reviewRequestId || null });
    } else {
      if (res.error?.includes('already submitted')) {
        setReviewSubmitted(true);
      }
      setReviewError(res.error || t('requestFailed'));
    }
  }

  const daysAvail = useMemo(() => {
    const d = profile?.availability ?? [];
    const days = Array.from({ length: 7 }, (_, i) => ({
      index: i, name: dayT(dayKeys[i]),
      slots: d.filter((s) => s.dayOfWeek === i),
    }));
    return { days };
  }, [profile]);
 
  const dateOptions = useMemo(() => {
    const opts: { dateStr: string; dayName: string; dayNum: number; slots: typeof daysAvail.days[0]['slots'] }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      const slots = daysAvail.days[dow]?.slots || [];
      if (slots.length > 0) {
        opts.push({
          dateStr: d.toISOString().split('T')[0],
          dayName: dayT(dayKeys[dow]),
          dayNum: d.getDate(),
          slots,
        });
      }
    }
    return opts;
  }, [daysAvail]);

  if (loading) return <ProfileSkeleton locale={locale} />;
  if (!profile) return <div className="py-32 text-center font-bold text-xl text-gray-400">{t('notFound')}</div>;

  const mainSubject = profile.subjects[0];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Profile Header Section */}
      <section>
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6">
          <TeacherHeader
            variant="card"
            avatarKey={profile.user.avatarKey}
            name={profile.user.fullName}
            isVerified={profile.isVerified}
            isOfficial={profile.isOfficial}
            isOnline={profile.user.isOnline}
            subject={mainSubject?.subject || null}
            avgRating={profile.avgRating}
            reviewCount={profile._count.reviews}
            studentCount={profile.studentCount}
            experience={profile.experience}
            responseTime={profile.responseTime}
            faved={faved}
            toggling={toggling}
            onToggleFav={toggleFav}
            onBookLesson={handleBookLesson}
            onMessageTeacher={handleMessageTeacher}
          />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
        <div className="grid gap-8 sm:gap-16 lg:grid-cols-3">
          {/* 2. Main Content Column */}
          <div className="lg:col-span-2 space-y-10 sm:space-y-24 order-2 lg:order-1">
             
              {/* About & Social */}
               <section className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col gap-4 sm:gap-6">
                     <div className="space-y-2 sm:space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">{t('about')}</h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                           {profile.bio}
                        </p>
                     </div>
                     <div>
                        <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 sm:mb-3">{t('socialLinks')}</h3>
                        <SocialLinks 
                          links={{
                            facebook: profile.facebookUrl,
                            instagram: profile.instagramUrl,
                            linkedin: profile.linkedinUrl,
                            youtube: profile.youtubeUrl,
                            tiktok: profile.tiktokUrl,
                            twitter: profile.twitterUrl,
                            telegram: profile.telegramUrl,
                            website: profile.websiteUrl,
                          }} 
                        />
                     </div>
                  </div>
               </section>

             {/* Featured Content / Video */}
               {profile.introVideo && (
                 <section className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 sm:gap-3">
                       <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-red-50 flex items-center justify-center"><Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" /></div>
                       {t('introVideo')}
                    </h2>
                   <div className="aspect-video rounded-2xl sm:rounded-[3rem] overflow-hidden bg-gray-900 shadow-xl sm:shadow-2xl ring-1 ring-gray-100">
                      <iframe src={getYouTubeEmbedUrl(profile.introVideo)} className="h-full w-full" allowFullScreen />
                   </div>
                </section>
              )}

             {/* Subjects Cards */}
               <section className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 sm:gap-3">
                     <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-primary-50 flex items-center justify-center"><BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" /></div>
                     {t('subjects')}
                  </h2>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                     {profile.subjects.map((s) => (
                       <Card key={s.id} className="group border-none bg-white shadow-md sm:shadow-lg ring-1 ring-gray-100 transition-all hover:ring-primary-100 hover:shadow-xl">
                          <CardContent className="p-4 sm:p-6">
                             <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{subjectName(s.subject, locale)}</h3>
                             <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                                {s.levels.map((l) => (
                                  <Badge key={l} className="bg-gray-50 text-gray-600 border-none font-bold text-[9px] sm:text-[10px] py-0.5 sm:py-1 uppercase tracking-widest">{l}</Badge>
                                ))}
                             </div>
                             <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-50">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{t('price')}</span>
                                <p className="text-lg sm:text-2xl font-bold text-primary-600">{s.price || profile.price} <span className="text-[10px] sm:text-xs text-gray-400">{t('dh')}/H</span></p>
                             </div>
                          </CardContent>
                       </Card>
                     ))}
                  </div>
               </section>

             {/* Testimonials / Reviews */}
               <section className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                     <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 sm:gap-3">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-yellow-50 flex items-center justify-center"><Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" /></div>
                        {t('studentTestimonials')}
                     </h2>
                     <Button variant="ghost" className="font-bold text-xs sm:text-sm text-primary-600">{c('viewAll')}</Button>
                  </div>

                  <div className="grid gap-3 sm:gap-4">
                     {profile.reviews.slice(0, 3).map((review) => (
                       <div key={review.id} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                             <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm">
                                {review.student.avatarKey 
                                  ? <img src={getAvatarUrl(review.student.avatarKey)} alt="" className="h-full w-full object-cover" />
                                  : <div className="h-full w-full flex items-center justify-center font-bold bg-primary-50 text-primary-600 text-xs sm:text-sm">{review.student.fullName.charAt(0)}</div>
                                }
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 text-xs sm:text-sm">{review.student.fullName}</p>
                                <StarRating rating={review.rating} size="sm" />
                             </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                       </div>
                     ))}
                  </div>
                </section>

              {/* Review Submission Form */}
              {user?.role === 'STUDENT' && (
                <section className="space-y-4 sm:space-y-6">
                   <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 sm:gap-3">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-primary-50 flex items-center justify-center"><MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" /></div>
                      {t('reviewPromptSection')}
                   </h2>
                   {reviewSubmitted || existingReview ? (
                     <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={existingReview?.rating || reviewRating} size="sm" />
                        </div>
                        {existingReview?.comment && (
                          <p className="text-green-800 text-sm sm:text-base italic mb-2">"{existingReview.comment}"</p>
                        )}
                        <p className="text-green-700 font-medium text-sm sm:text-base">{t('reviewSubmitted')}</p>
                     </div>
                   ) : (
                     <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{t('reviewCompletedLesson')}</p>
                        <div className="space-y-3 sm:space-y-4">
                           <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('rating')}</label>
                              <StarRatingInput rating={reviewRating} onChange={setReviewRating} size="md" />
                           </div>
                           <div>
                              <textarea
                                className="w-full h-24 sm:h-28 rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm resize-none text-gray-900"
                                placeholder={t('reviewPlaceholder')}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                              />
                           </div>
                           {reviewError && <p className="text-xs sm:text-sm text-red-600">{reviewError}</p>}
                           <Button
                             className="w-full sm:w-auto"
                             onClick={handleSubmitReview}
                             disabled={reviewRating === 0 || submittingReview}
                           >
                              {submittingReview ? t('sending') : t('submitReview')}
                           </Button>
                        </div>
                     </div>
                   )}
                </section>
              )}
           </div>

          {/* 3. Sidebar Booking Column */}
          <div className="space-y-8 order-1 lg:order-2">
              <Card className="lg:sticky lg:top-10 border-none bg-white shadow-xl ring-1 ring-gray-100 rounded-3xl overflow-hidden">
                 <CardContent className="p-0">
                     <div className="bg-gray-900 p-4 sm:p-6 text-white">
                        <div className="flex items-center justify-between mb-2 sm:mb-3 text-right flex-row-reverse">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('price')}</span>
                        </div>
                        <div className="flex items-baseline gap-2 justify-end">
                           <h4 className="text-3xl sm:text-4xl font-bold">{profile.price || 150}</h4>
                           <span className="text-sm sm:text-base font-bold text-gray-400">{t('dh')}/H</span>
                        </div>
                     </div>

                     <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 sm:mb-3 block text-right">{t('availability')}</label>
                            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 flex-row-reverse">
                               {dateOptions.slice(0, 5).map((opt) => (
                                 <button
                                   key={opt.dateStr}
                                   onClick={() => { setSelectedDate(opt.dateStr); setSelectedTime(''); }}
                                   className={`flex flex-col items-center gap-1 min-w-[56px] sm:min-w-[64px] p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all active:scale-90 group ${
                                     selectedDate === opt.dateStr
                                       ? 'border-primary-500 bg-primary-50'
                                       : 'border-gray-100 bg-gray-50 hover:border-primary-500'
                                   }`}
                                 >
                                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase ${
                                      selectedDate === opt.dateStr ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                                    }`}>{opt.dayName}</span>
                                    <span className={`text-sm sm:text-base font-bold ${
                                      selectedDate === opt.dateStr ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-600'
                                    }`}>{opt.dayNum}</span>
                                 </button>
                               ))}
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                           <Button className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-primary-900/20 transition-all hover:scale-[1.02]" onClick={handleBookLesson}>
                              {t('reserveLesson')}
                           </Button>
                           <Button variant="outline" className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border-2 hover:bg-gray-50" onClick={handleMessageTeacher}>
                              <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              {t('messageTeacher')}
                           </Button>
                        </div>

                       <div className="pt-6 border-t border-gray-50 space-y-3">
                          <div className="flex items-center gap-3 text-right flex-row-reverse">
                             <div className="h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /></div>
                             <div className="flex-1">
                                <p className="text-xs font-bold text-gray-900 leading-none">{t('guarantee')}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{t('guaranteeDesc')}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Secondary Actions Sidebar */}
               <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-gray-500 font-bold h-9 sm:h-10 rounded-lg sm:rounded-xl hover:text-gray-900 group flex-row-reverse text-xs sm:text-sm">
                     <Share2 className="ml-2 sm:ml-3 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:text-primary-600" /> {t('shareProfile')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-gray-500 font-bold h-9 sm:h-10 rounded-lg sm:rounded-xl hover:text-red-600 group flex-row-reverse text-xs sm:text-sm">
                     <Flag className="ml-2 sm:ml-3 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:text-red-600" /> {t('reportProfile')}
                  </Button>
               </div>
          </div>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowBookingForm(false)}>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-8 space-y-4 sm:space-y-6 mx-2 sm:mx-0" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{t('sendLessonRequest')}</h3>
              <button onClick={() => setShowBookingForm(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t('chooseSubject')}</label>
              <select
                className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm font-medium bg-white text-gray-900"
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
              >
                <option value="">{t('chooseSubject')}</option>
                {profile.subjects.map(s => (
                  <option key={s.id} value={s.subject.id}>{subjectName(s.subject, locale)}</option>
                ))}
              </select>
            </div>
            {/* Date + Time Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t('date')}</label>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {dateOptions.slice(0, 7).map((opt) => (
                  <button
                    key={opt.dateStr}
                    type="button"
                    onClick={() => { setSelectedDate(opt.dateStr); setSelectedTime(''); }}
                    className={`flex flex-col items-center gap-0.5 min-w-[52px] p-1.5 rounded-xl border transition-all ${
                      selectedDate === opt.dateStr
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 bg-gray-50 hover:border-primary-500'
                    }`}
                  >
                    <span className={`text-[9px] font-bold uppercase ${
                      selectedDate === opt.dateStr ? 'text-primary-600' : 'text-gray-400'
                    }`}>{opt.dayName}</span>
                    <span className={`text-sm font-bold ${
                      selectedDate === opt.dateStr ? 'text-primary-600' : 'text-gray-900'
                    }`}>{opt.dayNum}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (() => {
              const slots = dateOptions.find(o => o.dateStr === selectedDate)?.slots || [];
              return slots.length > 0 ? (
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t('time')}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {slots.map((slot) => (
                      <button
                        key={slot.startTime}
                        type="button"
                        onClick={() => setSelectedTime(slot.startTime)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedTime === slot.startTime
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-primary-500'
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Lesson Type */}
            {profile.teachingMode === 'BOTH' || profile.teachingMode === 'ONLINE' || profile.teachingMode === 'IN_PERSON' ? (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t('lessonType')}</label>
                <div className="flex gap-2">
                  {(profile.teachingMode === 'BOTH' || profile.teachingMode === 'ONLINE') && (
                    <button
                      type="button"
                      onClick={() => setLessonType('ONLINE')}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        lessonType === 'ONLINE'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-primary-500'
                      }`}
                    >
                      {t('onlineLesson')}
                    </button>
                  )}
                  {(profile.teachingMode === 'BOTH' || profile.teachingMode === 'IN_PERSON') && (
                    <button
                      type="button"
                      onClick={() => setLessonType('IN_PERSON')}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        lessonType === 'IN_PERSON'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-primary-500'
                      }`}
                    >
                      {t('inPersonLesson')}
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t('message')}</label>
              <textarea
                className="w-full h-28 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium resize-none text-gray-900"
                placeholder={t('messagePlaceholder')}
                value={bookingMessage}
                onChange={e => setBookingMessage(e.target.value)}
              />
            </div>
            {requestError && (
              <p className="text-sm text-red-600 text-center font-medium">{requestError}</p>
            )}
            <Button
              className="w-full h-14 rounded-2xl font-bold text-base shadow-lg"
              onClick={handleSendRequest}
              disabled={!selectedSubjectId || sendingRequest}
            >
              {sendingRequest ? t('sending') : t('sendRequest')}
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function ProfileSkeleton({ locale }: { locale: string }) {
  return (
    <div className="animate-pulse space-y-8 sm:space-y-12">
       <div className="h-48 sm:h-64 bg-gray-100 lg:h-96" />
       <div className="mx-auto max-w-6xl px-4 -mt-16 sm:-mt-24 lg:-mt-32 flex flex-col items-center sm:items-start gap-6 sm:gap-10">
          <div className="h-28 w-28 sm:h-48 sm:w-48 rounded-[1.5rem] sm:rounded-[3.5rem] bg-gray-200 lg:h-64 lg:w-64" />
          <div className="flex-1 space-y-3 sm:space-y-4">
             <Skeleton className="h-8 sm:h-12 w-48 sm:w-64 rounded-xl" />
             <Skeleton className="h-5 sm:h-6 w-36 sm:w-48 rounded-xl" />
          </div>
       </div>
       <div className="mx-auto max-w-6xl px-4 grid gap-8 sm:gap-16 lg:grid-cols-3 py-8 sm:py-16">
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 sm:h-32 rounded-xl sm:rounded-[2.5rem]" />)}
             </div>
             <Skeleton className="h-48 sm:h-64 rounded-2xl sm:rounded-[3.5rem]" />
             <Skeleton className="h-64 sm:h-96 rounded-2xl sm:rounded-[3.5rem]" />
          </div>
          <Skeleton className="h-[400px] sm:h-[600px] rounded-2xl sm:rounded-[3rem]" />
       </div>
    </div>
  );
}
