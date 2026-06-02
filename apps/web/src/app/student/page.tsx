'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { subjectName } from '@/lib/subject';
import { Card, CardContent, Button, Badge, Skeleton } from '@oustadi/ui';
import { Send, CheckCircle, Clock, XCircle, ArrowRight, Heart } from 'lucide-react';

export default function StudentDashboard() {
  const [requests, setRequests] = useState<any>({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const d = useTranslations('dashboard');
  const c = useTranslations('common');
  const t = useTranslations('teacher');

  useEffect(() => {
    apiRequest('/requests').then((res) => {
      if (res.success && res.data) setRequests(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-10">
        <div>
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-48 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 sm:h-32 rounded-[2rem]" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusBadgeVariant = (status: string) => {
    if (status === 'ACCEPTED') return 'success';
    if (status === 'REJECTED') return 'destructive';
    return 'warning';
  };

  const statCards = [
    { label: d('sentRequests'), value: requests.sent?.length, icon: Send, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: d('accepted'), value: requests.sent?.filter((r: any) => r.status === 'ACCEPTED').length, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: d('pending'), value: requests.sent?.filter((r: any) => r.status === 'PENDING').length, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: d('rejected'), value: requests.sent?.filter((r: any) => r.status === 'REJECTED').length, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight lg:text-4xl">{d('studentDashboard')}</h1>
        <p className="text-[10px] sm:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{d('welcomeBack')}</p>
      </div>

      <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.label} className="border-none shadow-sm sm:shadow-soft hover:shadow-premium-hover transition-all duration-300 rounded-xl sm:rounded-[2rem] overflow-hidden group">
            <CardContent className="p-4 sm:p-8">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`h-8 w-8 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <item.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${item.color}`} />
                </div>
                <p className={`text-xl sm:text-3xl font-black ${item.color} tracking-tighter`}>{item.value}</p>
              </div>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{d('myRequests')}</h2>
            <Link href="/student/requests" className="flex items-center gap-1.5 text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:underline">
              {d('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {requests.sent?.slice(0, 5).map((req: any) => (
              <Card key={req.id} className="border-none shadow-soft hover:shadow-premium transition-all duration-300 rounded-[2rem] overflow-hidden group">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-black text-primary-600 dark:text-primary-400 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        {req.teacher?.fullName?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm sm:text-base">{req.teacher?.fullName}</p>
                        <p className="text-[11px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 mt-0.5">{subjectName(req.subject, locale)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 shrink-0">
                      <Badge variant={statusBadgeVariant(req.status)} className="h-7 sm:h-8 px-3 sm:px-4 rounded-xl text-xs">
                        {req.status === 'ACCEPTED' ? d('accepted') : req.status === 'REJECTED' ? d('rejected') : d('pending')}
                      </Badge>
                      {req.status === 'ACCEPTED' && (
                        <Link href="/student/chat">
                          <Button size="sm" variant="outline" className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl font-black text-xs">{d('message')}</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  {req.status === 'REJECTED' && req.teacherNotes && (
                    <div className="mt-4 rounded-2xl bg-red-50/50 dark:bg-red-900/20 p-4 border border-red-100/50 dark:border-red-900/50">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 leading-relaxed">
                        <span className="opacity-60 uppercase tracking-widest mr-2">{d('rejectionReason')}:</span> 
                        {req.teacherNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {requests.sent?.length === 0 && (
              <Card className="border-none shadow-soft rounded-[2rem] bg-white dark:bg-gray-800">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-20 w-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6">
                    <Send className="h-10 w-10 text-gray-200 dark:text-gray-600" />
                  </div>
                  <p className="text-lg font-black text-gray-900 dark:text-gray-100">{d('noRequests')}</p>
                  <Link href="/teachers" className="mt-6">
                    <Button className="rounded-2xl font-black px-8 h-12 shadow-xl shadow-primary-500/20">{d('findTeacher')}</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight px-2">{d('quickActions')}</h2>
          <div className="grid gap-4">
            <Link href="/teachers">
              <Card className="border-none shadow-soft hover:shadow-premium-hover transition-all duration-300 rounded-[2rem] bg-primary-600 group">
                <CardContent className="p-4 sm:p-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12 shrink-0">
                      <Send className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black tracking-tight text-sm sm:text-base">{d('findTeacher')}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest mt-0.5">{d('browseDirectory')}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 group-hover:translate-x-1 transition-transform shrink-0" />
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/student/favorites">
              <Card className="border-none shadow-soft hover:shadow-premium-hover transition-all duration-300 rounded-[2rem] bg-white dark:bg-gray-800 group">
                <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 dark:text-gray-100 tracking-tight text-sm sm:text-base">{d('favorites')}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{d('viewSavedProfs')}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
