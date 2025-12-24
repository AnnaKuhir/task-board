'use client';

import { useForm } from 'react-hook-form';
import { SolidButton, TextButton, Input, Label, Textarea, FormError } from '@/components/atoms';
import { LabelSelect, StatusSelect } from '@/components/molecules';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { MESSAGES } from '@/constants';
import type { Task, Status, Label as TaskLabel } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

interface FormData {
  name: string;
  key: string;
  description: string;
  status: Status;
  labels: TaskLabel[];
}

export function TaskForm({ task, onSubmit, onDelete, isSubmitting }: TaskFormProps) {
  const { name, key, description, status: taskStatus, labels: taskLabels } = task || {};
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: name || '',
      key: key || '',
      description: description || '',
      status: taskStatus || 'backlog',
      labels: taskLabels || [],
    },
  });

  const labels = watch('labels');
  const status = watch('status');

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();

    value = value.replace(/[^A-Z0-9-]/g, '');

    if (!value.startsWith('TASK-') && value.length > 0) {
      if (value.startsWith('TASK')) {
        if (value.length > 4 && !value.includes('-')) {
          value = 'TASK-' + value.slice(4);
        }
      } else {
        value = 'TASK-' + value;
      }
    }

    setValue('key', value, { shouldDirty: true, shouldValidate: true });
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const isUpdateMode = !!task;
  const isInProgress = status === 'in_progress';
  const isDeleteDisabled = isSubmitting || isInProgress;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Task Name</Label>
          <div className="flex flex-col gap-1">
            <Input
              id="name"
              {...register('name', { required: MESSAGES.TASK_NAME_REQUIRED })}
              placeholder="e.g. SEO meta tags"
              error={!!errors.name}
            />
            <FormError>{errors.name?.message}</FormError>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="key">Task Key</Label>
          <div className="flex flex-col gap-1">
            <Input
              id="key"
              {...register('key', {
                required: MESSAGES.TASK_KEY_REQUIRED,
                pattern: {
                  value: /^TASK-\d{3,}$/,
                  message: MESSAGES.TASK_KEY_FORMAT,
                },
              })}
              placeholder="e.g. TASK-005"
              error={!!errors.key}
              onChange={handleKeyChange}
            />
            <FormError>{errors.key?.message}</FormError>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Task description"
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <div className={cn('flex min-w-0 flex-col gap-1', isUpdateMode ? 'flex-1' : 'w-full')}>
            <Label>Labels</Label>
            <LabelSelect
              labelValues={labels}
              onChange={(newLabels) => setValue('labels', newLabels, { shouldDirty: true })}
            />
          </div>

          {isUpdateMode && (
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Label>Task Status</Label>
              <StatusSelect
                statusValue={status}
                onChange={(newStatus: Status) => setValue('status', newStatus, { shouldDirty: true })}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-3">
        {isUpdateMode && onDelete && (
          <Tooltip delayDuration={1}>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <TextButton
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleteDisabled}
                >
                  Delete task
                </TextButton>
              </span>
            </TooltipTrigger>
            {isInProgress && (
              <TooltipContent side="top">
                <p>{MESSAGES.TASK_DELETE_IN_PROGRESS}</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
        <SolidButton type="submit" disabled={isSubmitting || (!isDirty && isUpdateMode)}>
          {isUpdateMode ? 'Update' : 'Create'}
        </SolidButton>
      </div>
    </form>
  );
}
