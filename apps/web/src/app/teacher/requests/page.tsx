'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, Button } from '@oustadi/ui';
import { MessageSquare, CheckCircle, XCircle, Clock, RefreshCw, X, Star } from 'lucide-react';

export default function TeacherRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposing, setProposing] = useState<string | null>(null);
  const [proposeDate, setProposeDate] = useState('');
  const [proposeTime, setProposeTime] = useState('');
  const d = useTranslations('dashboard');
  const c = useTranslations('common');
  const t = useTranslations('teacher');
  const b = useTranslations('booking');

  useEffect(() => {
    apiRequest<{ received: any[] }>('/requests').then((res) => {
      if (res.success && res.data) setRequests((res.data as any).received || []);
      setLoading(false);
    });
  }, []);

  async function handleAction(requestId: string, action: 'accept' | 'reject' | 'complete' | 'cancel') {
    await apiRequest(`/requests/${requestId}/${action}`, { method: 'PATCH' });
    const res = await apiRequest<{ received: any[] }>('/requests');
    if (res.success && res.data) setRequests((res.data as any).received || []);
  }

  async function handlePropose(requestId: string) {
    if (!proposeDate || !proposeTime) return;
    await apiRequest(`/requests/${requestId}/propose`, {
      method: 'PATCH',
      body: JSON.stringify({ proposedDate: proposeDate, proposedTime: proposeTime }),
    });
    setProposing(null);
    setProposeDate('');
    setProposeTime('');
    const res = await apiRequest<{ received: any[] }>('/requests');
    if (res.success && res.data) setRequests((res.data as any).received || []);
  }

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      ACCEPTED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      CANCELLED: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    };
    const labels: Record<string, string> = {
      PENDING: d('pending'), ACCEPTED: d('accepted'), REJECTED: d('rejected'),
      COMPLETED: d('completed'), CANCELLED: d('cancelled'),
    };
    return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] || ''}`}>{labels[status] || status}</span>;
  }

  function bookingBadge(bookingStatus: string) {
    if (bookingStatus === 'waiting_student_confirmation') {
      return <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{d('waitingStudentConfirmation')}</span>;
    }
    if (bookingStatus === 'waiting_confirmation') {
      return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{d('confirmLesson')}</span>;
    }
    if (bookingStatus === 'disputed') {
      return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">{d('lessonDisputed')}</span>;
    }
    if (bookingStatus === 'under_review') {
      return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">{b('underReview')}</span>;
    }
    if (bookingStatus === 'resolved') {
      return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">{b('disputeResolved')}</span>;
    }
    return null;
  }

  if (loading) return <p className="text-gray-500 dark:text-gray-400">{c('loading')}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{d('requests')}</h1>
      <div className="mt-6 space-y-3">
        {requests.map((req: any) => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{req.student?.fullName}</p>
                  {req.subject && <p className="text-xs text-primary-600 dark:text-primary-400">{req.subject.nameAr || req.subject.nameFr}</p>}
                  {req.message && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{req.message}</p>}
                  {(req.bookedDate || req.bookedTime || req.lessonType) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      {req.bookedDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(req.bookedDate).toLocaleDateString('ar-MA')} {req.bookedTime}</span>}
                      {req.lessonType && <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700">{req.lessonType === 'ONLINE' ? t('onlineLesson') : t('inPersonLesson')}</span>}
                    </div>
                  )}
                  {req.bookingStatus === 'waiting_student_confirmation' && req.proposedDate && req.proposedTime && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-purple-600 dark:text-purple-400">
                      <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {d('proposedTime')}: {new Date(req.proposedDate).toLocaleDateString('ar-MA')} {req.proposedTime}</span>
                    </div>
                  )}
                  {req.teacherNotes && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{d('rejectionReason')} {req.teacherNotes}</p>}
                  {req.bookingStatus === 'under_review' && (
                    <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/30">
                      <p className="flex items-center gap-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">{b('underReview')}</p>
                      <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">{b('underReviewDesc')}</p>
                    </div>
                  )}
                  {req.bookingStatus === 'resolved' && (
                    <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/30">
                      <p className="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-300"><CheckCircle className="h-4 w-4" /> {b('disputeResolved')}</p>
                      <p className="mt-1 text-sm text-green-600 dark:text-green-400">{b('disputeResolvedDesc')}</p>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex gap-1.5">
                    {statusBadge(req.status)}
                    {bookingBadge(req.bookingStatus)}
                  </div>
                  <div className="flex gap-1.5">
                    {req.status === 'PENDING' && req.bookingStatus !== 'waiting_student_confirmation' && (
                      <>
                        <Button size="sm" onClick={() => handleAction(req.id, 'accept')}>{d('accept')}</Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction(req.id, 'reject')}>{d('reject')}</Button>
                      </>
                    )}
                    {req.status === 'ACCEPTED' && (
                      <>
                        <Button size="sm" onClick={() => handleAction(req.id, 'complete')}><CheckCircle className="ml-1 h-3 w-3" /> {d('complete')}</Button>
                        <Button size="sm" variant="outline" onClick={() => setProposing(req.id)}><RefreshCw className="ml-1 h-3 w-3" /> {d('propose')}</Button>
                        <Button size="sm" variant="outline" onClick={() => router.push('/teacher/chat')}><MessageSquare className="ml-1 h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-500 dark:text-red-400" onClick={() => handleAction(req.id, 'cancel')}><XCircle className="h-3 w-3" /></Button>
                      </>
                    )}
                    {req.status === 'COMPLETED' && (
                      <Button size="sm" variant="outline" onClick={() => router.push('/teacher/chat')}><MessageSquare className="ml-1 h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
              </div>
              {proposing === req.id && (
                <div className="mt-4 flex items-end gap-3 border-t pt-4">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">{d('date')}</label>
                    <input type="date" value={proposeDate} onChange={(e) => setProposeDate(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">{d('time')}</label>
                    <input type="time" value={proposeTime} onChange={(e) => setProposeTime(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600" />
                  </div>
                  <Button size="sm" onClick={() => handlePropose(req.id)} disabled={!proposeDate || !proposeTime}>{d('propose')}</Button>
                  <button onClick={() => setProposing(null)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"><X className="h-4 w-4" /></button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {requests.length === 0 && <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">{d('noRequests')}</p>}
      </div>
    </div>
  );
}
