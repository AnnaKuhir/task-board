'use client';

import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, LabelBadge, StatusBadge } from '@/components/atoms';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

export const TaskCard = memo(function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const { id: taskId, status, name, key, description, labels } = task;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: taskId,
    data: task,
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  const handleClick = () => {
    onTaskClick(task);
  };

  const hasLabels = labels.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn('cursor-pointer transition-opacity', {
        'opacity-50': isDragging,
      })}
      onClick={handleClick}
      suppressHydrationWarning
    >
      <Card className="hover:shadow-md">
        <div className="flex flex-col gap-3 pb-4">
          <StatusBadge status={status} />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-gray-900">{name}</h3>
            <span className="text-xs leading-1.5 text-gray-600">{key}</span>
          </div>
          {description && (
            <p className="text-xs leading-1.5 text-gray-900/70">{description}</p>
          )}
        </div>

        <hr className="border-t-[0.5px] border-gray-500" />

        {hasLabels && (
          <div className="flex gap-1 pt-4">
            {labels.map((label) => (
              <LabelBadge key={label} label={label} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
});
