import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-all placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-800 dark:focus:border-primary-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-400',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500 ml-1 dark:text-red-400">{error}</p>}
    </div>
  );
}
