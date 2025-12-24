import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg bg-gray-100 text-gray-900 py-2 pr-2 pl-3 leading-1.5 text-xs border placeholder:text-gray-700 focus-visible:outline-none',
          error
            ? 'border-red-500 focus-visible:border-red-500'
            : 'border-transparent focus-visible:border-gray-500',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
