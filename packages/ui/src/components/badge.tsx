import * as React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'premium';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900',
    secondary: 'border-transparent bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    destructive: 'border-transparent bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    outline: 'border-gray-200 text-gray-600 bg-white shadow-sm dark:border-gray-600 dark:text-gray-400 dark:bg-gray-800',
    success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'border-transparent bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    info: 'border-transparent bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    premium: 'border-transparent bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold tracking-tight uppercase transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
