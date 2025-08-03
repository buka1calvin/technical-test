import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './button.layout';

interface SortOption {
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  className?: string;
}

export function SortDropdown({
  value,
  onChange,
  options,
  className
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const SortIcon = selectedOption?.icon;

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 justify-start min-w-[140px]"
      >
        {SortIcon && <SortIcon className="mr-2 h-4 w-4" />}
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className="ml-auto h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-md shadow-lg z-20">
            <div className="p-1">
              {options.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = value === option.value;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded cursor-pointer text-sm',
                      'hover:bg-accent',
                      isSelected && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {OptionIcon && <OptionIcon className="h-4 w-4" />}
                    <span>{option.label}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}