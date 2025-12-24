'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'sonner';
import { TaskColumn } from './task-column';
import { TaskDialog, DeleteTaskDialog } from '@/components/organisms';
import { SolidButton as Button } from '@/components/atoms';
import { MESSAGES } from '@/constants';
import type { Task, Status } from '@/types/task';

interface TaskBoardProps {
  initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error(MESSAGES.TASK_FETCH_ERROR);
      const data = await response.json();
      return data.tasks as Task[];
    },
    initialData: initialTasks,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || MESSAGES.TASK_UPDATE_ERROR);
      }
      return response.json();
    },
    onSuccess: (responseData) => {
      const updatedTask = responseData.task;
      queryClient.setQueryData(['tasks'], (oldTasks?: Task[]) => {
        if (!oldTasks) return [updatedTask];
        return oldTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      });
      toast.success(MESSAGES.TASK_STATUS_UPDATED);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || MESSAGES.TASK_DELETE_ERROR);
      }
      return response.json();
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['tasks'], (oldTasks?: Task[]) => {
        if (!oldTasks) return [];
        return oldTasks.filter((task) => task.id !== deletedId);
      });
      toast.success(MESSAGES.TASK_DELETED);
      setIsDeleteDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedTask(undefined);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const taskId = active.id as string;
      const newStatus = over.id as Status;
      const task = tasks.find((t) => t.id === taskId);

      if (task && task.status !== newStatus) {
        updateStatusMutation.mutate({ id: taskId, status: newStatus });
      }
    },
    [tasks, updateStatusMutation],
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedTask) {
      setIsDeleting(true);
      deleteMutation.mutate(selectedTask.id);
    }
  }, [selectedTask, deleteMutation]);

  const handleDeleteDialogClose = useCallback(
    (open: boolean) => {
      setIsDeleteDialogOpen(open);
      if (!open && selectedTask) {
        setIsEditDialogOpen(true);
      }
    },
    [selectedTask],
  );

  const backlogTasks = useMemo(() => tasks.filter((t) => t.status === 'backlog'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === 'in_progress'), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === 'done'), [tasks]);

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mx-auto mb-5 flex max-w-[1164px] justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>Create Task</Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="mx-auto flex max-w-[1164px] flex-col gap-3 md:flex-row">
          <TaskColumn
            status="backlog"
            title="Backlog"
            tasks={backlogTasks}
            onTaskClick={handleTaskClick}
          />
          <TaskColumn
            status="in_progress"
            title="In Progress"
            tasks={inProgressTasks}
            onTaskClick={handleTaskClick}
          />
          <TaskColumn status="done" title="Done" tasks={doneTasks} onTaskClick={handleTaskClick} />
        </div>
      </DndContext>

      <TaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      <TaskDialog
        task={selectedTask}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedTask(undefined);
        }}
        onDelete={handleDeleteClick}
      />

      {selectedTask && (
        <DeleteTaskDialog
          open={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
          taskName={selectedTask.name}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
