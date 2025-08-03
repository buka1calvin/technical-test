import React from 'react';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  error,
  className,
  ...props
}: TextareaProps) {
  const textareaClasses = cn(
    'w-full px-3 py-2 text-base rounded-md border resize-none',
    'bg-input border-border text-foreground',
    'placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200',
    error && 'border-destructive focus:ring-destructive',
    className
  );

  return (
    <div className="w-full">
      <ShadcnTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <span className="text-sm text-destructive mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}