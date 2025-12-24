import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[88px] w-full rounded-lg bg-gray-100 text-gray-900 py-2 pr-2 pl-3 leading-1.5 text-xs border placeholder:text-gray-700 focus-visible:outline-none resize-none',
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

export { Textarea };
