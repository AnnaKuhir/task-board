'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui';
import { SolidButton, TextButton } from '@/components/atoms';

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskName,
  onConfirm,
  isDeleting = false,
}: DeleteTaskDialogProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0">
        <DialogHeader>
          <DialogTitle>Delete task &quot;{taskName}&quot;?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-4">
          This action is irreversible. After deleting, you will lose access to all settings, groups,
          modification history, and results of this task. The task cannot be restored. Are you sure
          you want to delete this task?
        </DialogDescription>
        <div className="mt-8 flex justify-end gap-3">
          <TextButton onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </TextButton>
          <SolidButton onClick={onConfirm} disabled={isDeleting}>
            Delete
          </SolidButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
