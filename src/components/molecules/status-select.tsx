'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Status } from '@/types/task';
import { ChevronDown } from '@/icons/ChevronDown';

interface StatusSelectProps {
  statusValue: Status;
  onChange: (status: Status) => void;
  className?: string;
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export function StatusSelect({ statusValue, onChange, className }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectStatus = (status: Status) => {
    onChange(status);
    setIsOpen(false);
  };

  const selectedLabel = STATUS_OPTIONS.find(({ value }) => value === statusValue)?.label ?? 'Select Status';

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-gray-100 py-2 pr-2 pl-3 text-xs leading-1.5',
          isOpen ? 'border-gray-500' : 'border-transparent',
        )}
        onClick={handleToggleDropdown}
      >
        <span className="text-gray-900">{selectedLabel}</span>
        <ChevronDown
          className={cn('h-2.5 w-2.5 shrink-0 text-gray-900 transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-gray-500 bg-gray-100">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <div
              key={value}
              className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-200"
              onClick={() => handleSelectStatus(value)}
            >
              <span className="text-xs text-gray-900">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
