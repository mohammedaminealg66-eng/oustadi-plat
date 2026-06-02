'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { subjectName } from '@/lib/subject';
import { Card, CardContent, Button } from '@oustadi/ui';
import { MessageSquare, Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle, Star } from 'lucide-react';

export default function StudentRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<any>({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [showReviewPrompt, setShowReviewPrompt] = useState<string | null>(null);
  const locale = useLocale();
  const d = useTranslations('dashboard');
  const t = useTranslations('teacher');
  const c = useTranslations('common');
  const b = useTranslations('booking');

  const fetchRequests = async () => {
    const res = await apiRequest<{ sent: any[]; received: any[] }>('/requests');
    if (res.success && res.data) setRequests(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  async function handleAcceptProposal(requestId: string) {
    await apiRequest(`/requests/${requestId}/accept-proposal`, { method: 'PATCH' });
    await fetchRequests();
  }

  async function handleRejectProposal(requestId: string) {
    await apiRequest(`/requests/${requestId}/reject-proposal`, { method: 'PATCH' });
    await fetchRequests();
  }

  async function handleConfirmCompletion(requestId: string, confirmed: boolean) {
    if (confirmed) {
      await apiRequest(`/requests/${requestId}/confirm-completion`, {
        method: 'PATCH',
        body: JSON.stringify({ confirmed: true }),
      });
      setConfirmModal(null);
      setShowReviewPrompt(requestId);
      await fetchRequests();
    } else {
      if (!disputeReason.trim()) return;
      await apiRequest(`/requests/${requestId}/confirm-completion`, {
        method: 'PATCH',
        body: JSON.stringify({ confirmed: false, reason: disputeReason }),
      });
      setConfirmModal(null);
      setDisputeReason('');
      await fetchRequests();
    }
  }

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      ACCEPTED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
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
      return <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">{d('waitingStudentConfirmation')}</span>;
    }
    if (bookingStatus === 'waiting_confirmation') {
      return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{d('confirmLesson')}</span>;
    }
    if (bookingStatus === 'disputed') {
      return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">{d('lessonDisputed')}</span>;
    }
    if (bookingStatus === 'under_review') {
      return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{b('underReview')}</span>;
    }
    if (bookingStatus === 'resolved') {
      return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">{b('disputeResolved')}</span>;
    }
    return null;
  }

  if (loading) return <p className="text-gray-500 dark:text-gray-400">{c('loading')}</p>;

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{d('myRequests')}</h1>
      <div className="mt-4 sm:mt-6 space-y-3">
        {requests.sent?.map((req: any) => (
          <Card key={req.id} className="rounded-xl sm:rounded-2xl">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="min-w-0 flex-1 w-full sm:w-auto">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{req.teacher?.fullName}</p>
                  {req.subject && <p className="text-xs text-primary-600 dark:text-primary-400">{subjectName(req.subject, locale)}</p>}
                  {req.message && <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{req.message}</p>}
                  {(req.bookedDate || req.bookedTime || req.lessonType) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                      {req.bookedDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(req.bookedDate).toLocaleDateString('ar-MA')} {req.bookedTime}</span>}
                      {req.lessonType && <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700">{req.lessonType === 'ONLINE' ? t('onlineLesson') : t('inPersonLesson')}</span>}
                    </div>
                  )}
                  {req.bookingStatus === 'waiting_student_confirmation' && req.proposedDate && req.proposedTime && (
                    <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-2 sm:p-3 dark:border-purple-800 dark:bg-purple-900/20">
                      <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-400"><RefreshCw className="h-3.5 w-3.5" /> {d('proposedTime')}</p>
                      <p className="mt-1 text-xs sm:text-sm text-purple-600 dark:text-purple-400">{new Date(req.proposedDate).toLocaleDateString('ar-MA')} {req.proposedTime}</p>
                    </div>
                  )}
                  {req.bookingStatus === 'disputed' && req.disputeReason && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 sm:p-3 dark:border-red-800 dark:bg-red-900/20">
                      <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-red-700 dark:text-red-400"><AlertTriangle className="h-3.5 w-3.5" /> {d('disputeReason')}</p>
                      <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{req.disputeReason}</p>
                    </div>
                  )}
                  {req.bookingStatus === 'under_review' && (
                    <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-2 sm:p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                      <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-400"><AlertTriangle className="h-3.5 w-3.5" /> {b('underReview')}</p>
                      <p className="mt-1 text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">{b('underReviewDesc')}</p>
                    </div>
                  )}
                  {req.teacherNotes && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{d('rejectionReason')} {req.teacherNotes}</p>}
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <div className="flex flex-wrap gap-1.5">
                    {statusBadge(req.status)}
                    {bookingBadge(req.bookingStatus)}
                  </div>
                  <div className="flex gap-1.5">
                    {(req.status === 'ACCEPTED' || req.status === 'COMPLETED') && (
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/student/chat'}><MessageSquare className="h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
              </div>
              {req.bookingStatus === 'waiting_student_confirmation' && (
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 border-t pt-3 sm:pt-4 dark:border-gray-700">
                  <Button size="sm" onClick={() => handleAcceptProposal(req.id)}>
                    <CheckCircle className="ml-1 h-4 w-4" /> {d('acceptProposal')}
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleRejectProposal(req.id)}>
                    <XCircle className="ml-1 h-4 w-4" /> {d('rejectProposal')}
                  </Button>
                </div>
              )}
              {req.bookingStatus === 'waiting_confirmation' && (
                <div className="mt-3 sm:mt-4 flex gap-2 border-t pt-3 sm:pt-4 dark:border-gray-700">
                  <Button size="sm" onClick={() => setConfirmModal(req.id)}>
                    <CheckCircle className="ml-1 h-4 w-4" /> {d('confirmLesson')}
                  </Button>
                </div>
              )}
              {req.bookingStatus === 'resolved' && (
                <div className="mt-3 sm:mt-4 rounded-lg border border-green-200 bg-green-50 p-2 sm:p-3 dark:border-green-800 dark:bg-green-900/20">
                  <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-green-700 dark:text-green-400"><CheckCircle className="h-3.5 w-3.5" /> {b('disputeResolved')}</p>
                  <p className="mt-1 text-xs sm:text-sm text-green-600 dark:text-green-400">{b('disputeResolvedDesc')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {requests.sent?.length === 0 && <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">{d('noSentRequests')}</p>}
      </div>

      {/* Completion confirmation modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 mx-2 sm:mx-0 dark:bg-gray-800">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{d('confirmLessonQuestion')}</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{b('confirmLessonQuestionShort')}</p>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button className="w-full sm:flex-1" onClick={() => handleConfirmCompletion(confirmModal, true)}>
                <CheckCircle className="ml-1 h-4 w-4" /> {d('yesCompleted')}
              </Button>
              <Button variant="outline" className="w-full sm:flex-1 text-red-500" onClick={() => handleConfirmCompletion(confirmModal, false)}>
                <XCircle className="ml-1 h-4 w-4" /> {d('noProblem')}
              </Button>
            </div>
            <div className="mt-3 sm:mt-4">
              <textarea value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
                placeholder={d('problemReason')} rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
            </div>
          </div>
        </div>
      )}

      {/* Review prompt modal */}
      {showReviewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 mx-2 sm:mx-0 dark:bg-gray-800">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{d('reviewPrompt')}</h3>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button className="w-full sm:flex-1" onClick={() => { setShowReviewPrompt(null); const req = requests.sent?.find((r: any) => r.id === showReviewPrompt); const teacherProfileId = req?.teacher?.teacherProfile?.id; if (teacherProfileId) router.push(`/teachers/${teacherProfileId}?requestId=${req.id}`); }}>
                <Star className="ml-1 h-4 w-4" /> {t('addReview')}
              </Button>
              <Button variant="outline" className="w-full sm:flex-1" onClick={() => setShowReviewPrompt(null)}>
                {c('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
