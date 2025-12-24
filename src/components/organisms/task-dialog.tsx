'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, TooltipProvider } from '@/components/ui';
import { TaskForm } from './task-form';
import { MESSAGES } from '@/constants';
import type { Task } from '@/types/task';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onDelete?: () => void;
}

export function TaskDialog({ task, open, onOpenChange, onDelete }: TaskDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const taskData = {
        name: data.name || '',
        key: data.key || '',
        description: data.description || '',
        status: 'backlog' as const,
        labels: data.labels || [],
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || MESSAGES.TASK_CREATE_ERROR);
      }
      return response.json();
    },
    onSuccess: (responseData) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        const newTask = responseData.task;
        if (!old) return [newTask];
        return [...old, newTask];
      });
      toast.success(MESSAGES.TASK_CREATED);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      if (!task?.id) {
        throw new Error(MESSAGES.TASK_ID_REQUIRED);
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || MESSAGES.TASK_UPDATE_ERROR);
      }
      return response.json();
    },
    onSuccess: (responseData) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        const updatedTask = responseData.task;
        if (!old) return [updatedTask];
        return old.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      });
      toast.success(MESSAGES.TASK_UPDATED);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: Partial<Task>) => {
    setIsSubmitting(true);
    if (task) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onDelete={onDelete}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
