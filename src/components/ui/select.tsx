import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({ value, onValueChange, placeholder, options, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <span className={selected ? '' : 'text-muted-foreground'}>{selected?.label || placeholder || 'Select...'}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onValueChange?.(option.value);
                setOpen(false);
              }}
              className={cn(
                'block w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors',
                value === option.value && 'bg-primary/10 text-primary'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
