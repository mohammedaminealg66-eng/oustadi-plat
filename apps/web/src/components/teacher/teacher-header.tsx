'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Heart, BookOpen, MessageSquare,
} from 'lucide-react';
import { Button } from '@oustadi/ui';
import { OfficialBadge, VerifiedBadge } from '@/components/teacher/status-badges';
import { getAvatarUrl } from '@/lib/asset';
import { subjectName } from '@/lib/subject';

interface TeacherHeaderProps {
  variant?: 'minimal' | 'card' | 'split';
  showCover?: boolean;
  coverUrl?: string;
  avatarKey: string | null;
  name: string;
  isVerified: boolean;
  isOfficial: boolean;
  isOnline: boolean;
  subject: { nameAr: string; nameFr: string } | null;
  avgRating: number | null;
  reviewCount: number;
  studentCount: number;
  experience: number | null;
  responseTime: string | null;
  faved: boolean;
  toggling: boolean;
  onToggleFav: () => void;
  onBookLesson: () => void;
  onMessageTeacher: () => void;
}

export function TeacherHeader({
  variant = 'card',
  showCover = true,
  coverUrl,
  avatarKey,
  name,
  isVerified,
  isOfficial,
  isOnline,
  subject,
  avgRating,
  reviewCount,
  studentCount,
  experience,
  responseTime,
  faved,
  toggling,
  onToggleFav,
  onBookLesson,
  onMessageTeacher,
}: TeacherHeaderProps) {
  const t = useTranslations('teacher');
  const locale = useLocale();
  const avatarSrc = getAvatarUrl(avatarKey);
  const initial = name.charAt(0).toUpperCase();
  const subjectDisplay = subject ? subjectName(subject, locale) : '';

  const stats = [
    { label: t('students'), value: studentCount },
    { label: t('reviews'), value: reviewCount },
    { label: t('experience'), value: `${experience || 0} ${t('years')}` },
    { label: t('responseTime'), value: responseTime || '1h' },
  ];

  const favButton = (
    <button
      onClick={onToggleFav}
      disabled={toggling}
      className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      aria-label={faved ? t('removeFromFavorites') : t('addToFavorites')}
    >
      <Heart className={`h-4 w-4 ${faved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
    </button>
  );

  const avatarMarkup = (size: 'sm' | 'md' = 'md') => {
    const dimensions = size === 'sm'
      ? 'h-14 w-14 sm:h-16 sm:w-16'
      : 'h-20 w-20 sm:h-24 sm:w-24';
    const onlineDot = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3 sm:h-3.5 sm:w-3.5';
    return (
      <div className="relative">
        <div className={`${dimensions} rounded-full bg-white p-0.5 shadow-sm border-2 border-gray-100`}>
          {avatarKey ? (
            <img src={avatarSrc} alt={`${name}'s avatar`} className="h-full w-full rounded-full object-cover" />
          ) : (
            <div className="h-full w-full rounded-full bg-primary-50 flex items-center justify-center font-bold text-primary-600 text-lg sm:text-xl">
              {initial}
            </div>
          )}
        </div>
        {isOnline && (
          <span className={`absolute -bottom-0.5 -right-0.5 ${onlineDot} rounded-full border-2 border-white bg-green-500 shadow-sm`} />
        )}
      </div>
    );
  };

  const ratingPill = avgRating != null ? (
    <div className="inline-flex items-center bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-sm font-semibold">
      <span role="img" aria-label={`${avgRating.toFixed(1)} star rating`}>⭐</span>
      <span className="ml-1.5">{avgRating.toFixed(1)}</span>
      <span className="ml-2 text-xs text-gray-500">({reviewCount} {t('reviews')})</span>
    </div>
  ) : null;

  const actionButtons = (
    <div className="flex flex-col sm:flex-row justify-center gap-2">
      <Button className="w-full sm:w-auto rounded-full py-2 px-6" onClick={onBookLesson}>
        <BookOpen className="mr-1.5 h-4 w-4" />
        {t('bookSession')}
      </Button>
      <Button variant="outline" className="w-full sm:w-auto rounded-full py-2 px-6 border-2" onClick={onMessageTeacher}>
        <MessageSquare className="mr-1.5 h-4 w-4" />
        {t('messageTeacher')}
      </Button>
      {favButton}
    </div>
  );

  const statsRow = (
    <div className="flex justify-center space-x-6 bg-gray-50 py-3 rounded-lg">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs font-medium text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );

  /* ───────── Minimal Variant ───────── */
  if (variant === 'minimal') {
    return (
      <div className="bg-white shadow-sm rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex justify-center sm:justify-start">
            {avatarMarkup('sm')}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-gray-900">{name}</h1>
              {isOfficial ? <OfficialBadge className="text-[10px] h-5" /> : isVerified ? <VerifiedBadge className="text-[10px] h-5" /> : null}
            </div>
            {subjectDisplay && (
              <p className="text-xs text-gray-500 mt-0.5">{subjectDisplay}</p>
            )}
            <div className="mt-1">{ratingPill}</div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
            <Button className="w-full sm:w-auto rounded-full py-1.5 px-4 text-xs h-9" onClick={onBookLesson}>
              <BookOpen className="mr-1 h-3 w-3" />
              {t('bookSession')}
            </Button>
            <Button variant="outline" className="w-full sm:w-auto rounded-full py-1.5 px-4 text-xs h-9" onClick={onMessageTeacher}>
              <MessageSquare className="mr-1 h-3 w-3" />
              {t('messageTeacher')}
            </Button>
            {favButton}
          </div>
        </div>
        <div className="mt-3">{statsRow}</div>
      </div>
    );
  }

  /* ───────── Split Variant ───────── */
  if (variant === 'split') {
    return (
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-4 sm:p-6 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-3">{avatarMarkup()}</div>
            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h1>
              {favButton}
            </div>
            <div className="mb-1">
              {isOfficial ? <OfficialBadge /> : isVerified ? <VerifiedBadge /> : null}
            </div>
            {subjectDisplay && (
              <p className="text-sm text-gray-600 mb-2">{subjectDisplay}</p>
            )}
            {ratingPill}
          </div>

          <div className="sm:w-64 p-4 sm:p-6 flex sm:flex-col justify-center gap-3 bg-gray-50/50 border-t sm:border-t-0 sm:border-l border-gray-100">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {actionButtons}
        </div>
      </div>
    );
  }

  /* ───────── Card Variant ─────────
     Marketplace-style: no cover, left-aligned, compact.
     Desktop: avatar + info side-by-side.
     Mobile: avatar + info side-by-side (avatar 56px, flex-shrink-0), buttons full-width.
  */
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 sm:p-5">
      {/* Identity block: avatar + info side-by-side */}
      <div className="flex gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-white p-0.5 shadow-sm border-2 border-gray-100">
              {avatarKey ? (
                <img src={avatarSrc} alt={`${name}'s avatar`} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="h-full w-full rounded-full bg-primary-50 flex items-center justify-center font-bold text-primary-600 text-base sm:text-xl">
                  {initial}
                </div>
              )}
            </div>
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white bg-green-500 shadow-sm" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {/* Name + Badge + Favorite */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{name}</h1>
            {isOfficial ? <OfficialBadge className="text-[9px] h-5 sm:text-[10px]" /> : isVerified ? <VerifiedBadge className="text-[9px] h-5 sm:text-[10px]" /> : null}
            <button
              onClick={onToggleFav}
              disabled={toggling}
              className="ml-auto flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label={faved ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${faved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Subject */}
          {subjectDisplay && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{subjectDisplay}</p>
          )}

          {/* Rating */}
          {avgRating != null && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <span className="inline-flex items-center text-yellow-500" role="img" aria-label={`${avgRating.toFixed(1)} star rating`}>
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </span>
              <span className="text-sm sm:text-base font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({reviewCount} {t('reviews')})</span>
            </div>
          )}

          {/* Action Buttons — desktop: inline; mobile: full-width */}
          <div className="mt-3 flex flex-col sm:flex-row items-start gap-2">
            <Button className="w-full sm:w-auto rounded-lg py-2 px-4 text-xs sm:text-sm font-semibold h-9 sm:h-10" onClick={onBookLesson}>
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              {t('bookSession')}
            </Button>
            <Button variant="outline" className="w-full sm:w-auto rounded-lg py-2 px-4 text-xs sm:text-sm font-semibold h-9 sm:h-10 border" onClick={onMessageTeacher}>
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              {t('messageTeacher')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-3 sm:mt-4 bg-gray-50 rounded-lg py-2.5 sm:py-3 px-3 grid grid-cols-4 gap-1 sm:gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center min-w-0">
            <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{stat.value}</p>
            <p className="text-[9px] sm:text-[11px] font-medium text-gray-500 truncate">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
