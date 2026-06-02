import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600': variant === 'primary',
          'bg-secondary-600 text-white shadow-sm hover:bg-secondary-700 hover:shadow-md': variant === 'secondary',
          'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-600': variant === 'outline',
          'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200': variant === 'ghost',
          'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md dark:bg-red-500 dark:hover:bg-red-600': variant === 'danger',
          'h-9 px-4 text-xs': size === 'sm',
          'h-11 px-6 text-sm': size === 'md',
          'h-13 px-8 text-base': size === 'lg',
          'h-10 w-10 p-0': size === 'icon',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
