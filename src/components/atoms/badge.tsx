import { cn } from '@/lib/utils';
import type { Label, Status } from '@/types/task';

interface LabelBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: Label;
}

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status;
}

const baseBadgeStyles = 'px-1.5 py-1 text-2xs font-medium text-gray-700 capitalize';

const statusBg: Record<Status, string> = {
  backlog: 'bg-gray-200',
  in_progress: 'bg-green-100',
  done: 'bg-yellow-100',
};

const statusLabels: Record<Status, string> = {
  backlog: 'backlog',
  in_progress: 'in progress',
  done: 'done',
};

export function LabelBadge({ label, className, ...props }: LabelBadgeProps) {
  return (
    <span className={cn(baseBadgeStyles, 'rounded-sm bg-gray-200', className)} {...props}>
      {label}
    </span>
  );
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(baseBadgeStyles, 'w-fit rounded-20', statusBg[status], className)} {...props}>
      {statusLabels[status]}
    </span>
  );
}
