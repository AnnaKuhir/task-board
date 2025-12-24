'use client';

import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from '@/components/molecules';
import type { Task, Status } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskColumn = memo(function TaskColumn({ status, title, tasks, onTaskClick }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  return (
    <div className="flex w-full flex-col rounded-3xl bg-gray-200 px-3 pb-3 pt-4 md:w-[380px]">
      <h2 className="mb-4 text-base font-bold leading-none text-gray-900">{title}</h2>
      <div
        ref={setNodeRef}
        className={cn('flex flex-1 flex-col gap-4', {
          'rounded-lg bg-primary/10': isOver,
        })}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
});
