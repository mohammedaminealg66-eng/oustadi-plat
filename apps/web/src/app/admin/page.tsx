'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, Skeleton } from '@oustadi/ui';
import { Users, GraduationCap, BookOpen, FileText, Clock, AlertTriangle } from 'lucide-react';

interface DashboardData {
  users: number;
  teachers: number;
  students: number;
  requests: number;
  pendingDocuments: number;
  pendingReports: number;
}

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<DashboardData>('/admin/dashboard').then((res) => {
      if (res.success && res.data) setData(res.data as DashboardData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-xl sm:rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="mt-2 h-4 w-24 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
        <AlertTriangle className="h-12 w-12" />
        <p className="mt-4 text-sm">{t('errorLoading')}</p>
      </div>
    );
  }

  const cards = [
    { label: t('totalUsers'), value: data.users, icon: Users, color: 'text-primary-600 dark:text-primary-400' },
    { label: t('teachers'), value: data.teachers, icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: t('students'), value: data.students, icon: BookOpen, color: 'text-blue-600 dark:text-blue-400' },
    { label: t('requests'), value: data.requests, icon: FileText, color: 'text-purple-600 dark:text-purple-400' },
    { label: t('pendingDocuments'), value: data.pendingDocuments, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400' },
    { label: t('openReports'), value: data.pendingReports, icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('dashboardTitle')}</h1>
      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((item) => (
          <Card key={item.label} className="rounded-xl sm:rounded-2xl shadow-sm sm:shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className={`text-2xl sm:text-3xl font-bold ${item.color}`}>{item.value}</p>
                <item.icon className={`h-6 w-6 sm:h-8 sm:w-8 opacity-20 ${item.color}`} />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
