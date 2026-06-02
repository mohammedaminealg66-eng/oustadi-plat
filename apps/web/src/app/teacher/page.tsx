'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, Button, Badge, Skeleton } from '@oustadi/ui';
import { UserPlus, CheckCircle, Clock, XCircle, Check, MessageSquare } from 'lucide-react';

export default function TeacherDashboard() {
  const [requests, setRequests] = useState<any>({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const [rejecting, setRejecting] = useState<Record<string, boolean>>({});
  const d = useTranslations('dashboard');
  const c = useTranslations('common');
  const t = useTranslations('teacher');

  useEffect(() => {
    apiRequest('/requests').then((res) => {
      if (res.success && res.data) setRequests(res.data);
      setLoading(false);
    });
  }, []);

  async function handleAction(requestId: string, action: 'accept' | 'reject') {
    const notes = action === 'reject' ? rejectNotes[requestId] : undefined;
    await apiRequest(`/requests/${requestId}/${action}`, {
      method: 'PATCH',
      body: notes ? JSON.stringify({ notes }) : undefined,
    });
    const res = await apiRequest('/requests');
    if (res.success && res.data) setRequests(res.data);
  }

  if (loading) {
    return (
      <div className="space-y-10">
        <div>
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-48 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
    { label: d('incomingRequests'), value: requests.received?.length, icon: UserPlus, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: d('accepted'), value: requests.received?.filter((r: any) => r.status === 'ACCEPTED').length, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: d('pending'), value: requests.received?.filter((r: any) => r.status === 'PENDING').length, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight lg:text-4xl">{d('teacherDashboard')}</h1>
        <p className="text-[10px] sm:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{d('welcomeBack')}</p>
      </div>

      <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3">
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

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{d('incomingRequests')}</h2>
        </div>

        <div className="grid gap-4">
          {requests.received?.map((req: any) => (
            <Card key={req.id} className="border-none shadow-sm sm:shadow-soft hover:shadow-premium transition-all duration-300 rounded-xl sm:rounded-[2rem] overflow-hidden group">
              <CardContent className="p-4 sm:p-7">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
                  <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-black text-primary-600 dark:text-primary-400 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                      {req.student?.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-base sm:text-lg">{req.student?.fullName}</p>
                      <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic line-clamp-2">"{req.message}"</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 w-full sm:w-auto">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge variant={statusBadgeVariant(req.status)} className="h-7 sm:h-8 px-3 sm:px-4 rounded-xl text-xs sm:text-sm">
                        {req.status === 'ACCEPTED' ? d('accepted') : req.status === 'REJECTED' ? d('rejected') : d('pending')}
                      </Badge>
                      {req.status === 'ACCEPTED' && (
                        <Link href="/teacher/chat">
                          <Button size="sm" variant="outline" className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm">
                            <MessageSquare className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />{d('message')}
                          </Button>
                        </Link>
                      )}
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="mt-1 w-full">
                        {rejecting[req.id] ? (
                          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <textarea
                              value={rejectNotes[req.id] || ''}
                              onChange={(e) => setRejectNotes((r) => ({ ...r, [req.id]: e.target.value }))}
                              placeholder={d('confirmReject')}
                              className="w-full rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/20 px-4 py-3 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-200 transition-all"
                              rows={2}
                            />
                            <div className="flex gap-2 justify-end items-center">
                              <button onClick={() => setRejecting((r) => ({ ...r, [req.id]: false }))} className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300">{c('cancel')}</button>
                              <Button size="sm" variant="danger" className="h-8 sm:h-9 px-4 sm:px-5 rounded-xl text-[10px] sm:text-xs font-black" onClick={() => { handleAction(req.id, 'reject'); setRejecting((r) => ({ ...r, [req.id]: false })); }}>{d('confirmRejectShort')}</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-primary-500/20" onClick={() => handleAction(req.id, 'accept')}>
                              <Check className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />{d('accept')}
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm" onClick={() => setRejecting((r) => ({ ...r, [req.id]: true }))}>
                              <XCircle className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />{d('reject')}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {requests.received?.length === 0 && (
            <Card className="border-none shadow-soft rounded-[2rem] bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-20 w-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6">
                  <UserPlus className="h-10 w-10 text-gray-200 dark:text-gray-600" />
                </div>
                <p className="text-lg font-black text-gray-900 dark:text-gray-100">{d('noIncomingRequests')}</p>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-2">{t('shareProfileToGetRequests')}</p>
                <Link href="/teacher/profile" className="mt-8">
                  <Button className="rounded-2xl font-black px-8 h-12 shadow-xl shadow-primary-500/20">{d('viewProfile')}</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
