import { cn } from '@/lib/utils';
import { BaseButton, type BaseButtonProps } from '@/components/ui';

export type SolidButtonProps = BaseButtonProps;

export function SolidButton({ className = '', ...props }: SolidButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cn(
        'inline-flex min-w-[150px] items-center justify-center gap-2 rounded-[32px] px-3 py-2 text-xs font-medium leading-5 tracking-[0.01px]',
        'bg-gray-900 text-gray-100',
        'hover:enabled:bg-gray-800 hover:enabled:text-gray-400',
        'disabled:bg-gray-600 disabled:text-gray-400',
        className,
      )}
    />
  );
}

export interface TextButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'destructive';
}

const textButtonVariants = {
  primary: 'text-gray-900 hover:enabled:bg-gray-200 hover:enabled:text-gray-900',
  destructive: 'text-red-500 hover:enabled:bg-red-100 hover:enabled:text-red-500 disabled:text-red-300',
} as const;

export function TextButton({ className = '', variant = 'primary', ...props }: TextButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[32px] px-3 py-2 text-xs font-medium leading-5 tracking-[0.01px]',
        textButtonVariants[variant],
        className,
      )}
    />
  );
}

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center rounded-[32px] p-3 transition-all ease-in-out',
        'bg-gray-200',
        'hover:enabled:bg-gray-100',
        'disabled:cursor-not-allowed disabled:bg-gray-200',
        className,
      )}
    >
      {children}
    </button>
  );
}
