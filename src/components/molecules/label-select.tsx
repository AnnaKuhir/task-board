'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Label } from '@/types/task';
import { LABELS } from '@/constants/task';
import { ChevronDown } from '@/icons/ChevronDown';
import { Check, Close } from '@/icons';

interface LabelSelectProps {
  labelValues: Label[];
  onChange: (labels: Label[]) => void;
  className?: string;
}

export function LabelSelect({ labelValues, onChange, className }: LabelSelectProps) {
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

  const selectedLabelsSet = useMemo(() => new Set(labelValues), [labelValues]);

  const handleToggle = (label: Label) => {
    const newValue = selectedLabelsSet.has(label) ? labelValues.filter((labelValue) => labelValue !== label) : [...labelValues, label];
    onChange(newValue);
  };

  const handleRemove = (label: Label, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(labelValues.filter((labelValue) => labelValue !== label));
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const hasSelection = labelValues.length > 0;

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-gray-100 py-2 pr-2 pl-3 text-xs leading-1.5',
          isOpen ? 'border-gray-500' : 'border-transparent',
        )}
        onClick={handleToggleDropdown}
      >
        {hasSelection ? (
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto scrollbar-hide">
            {labelValues.map((label) => (
              <div
                key={label}
                className="flex shrink-0 items-center gap-1 rounded bg-gray-900 p-1 text-xs capitalize text-gray-100"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(label, e)}
                  className="flex items-center"
                  aria-label={`Remove ${label}`}
                >
                  <Close className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-700">Choose Label</span>
        )}
        <ChevronDown
          className={cn('h-2.5 w-2.5 shrink-0 text-gray-900 transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-0.5 w-full overflow-hidden rounded-lg border border-gray-500 bg-gray-100">
          {LABELS.map((label) => {
            return (
              <div
                key={label}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-200"
                onClick={() => handleToggle(label)}
              >
                <span className="text-xs capitalize text-gray-900">{label}</span>
                {selectedLabelsSet.has(label) && <Check className="h-2 w-2 text-gray-900" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
