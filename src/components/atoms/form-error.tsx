import { cn } from '@/lib/utils';

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function FormError({ className, children, ...props }: FormErrorProps) {
  if (!children) return null;

  return (
    <p
      className={cn('text-2xs font-medium leading-none tracking-[0.01px] text-red-500', className)}
      {...props}
    >
      {children}
    </p>
  );
}
