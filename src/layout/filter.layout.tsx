import React from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './button.layout';

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  icon?: React.ElementType;
  className?: string;
}

export default function FilterDropdown({
  title,
  options,
  selectedValues,
  onValueChange,
  icon: Icon = Filter,
  className
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onValueChange(newValues);
  };

  const handleClear = () => {
    onValueChange([]);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-9 border-dashed justify-start min-w-[100px]',
          selectedValues.length > 0 && 'border-primary/50 text-primary bg-primary/10 hover:bg-primary/20'
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        {title}
        {selectedValues.length > 0 && (
          <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className="ml-auto h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
                    
          <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-md shadow-lg z-50">
            <div className="p-2 max-h-64 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const OptionIcon = option.icon;
                                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <div className={cn(
                      'w-4 h-4 border-2 rounded flex items-center justify-center',
                      isSelected ? 'bg-primary border-primary' : 'border-border'
                    )}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                      )}
                    </div>
                    {OptionIcon && <OptionIcon className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm">{option.label}</span>
                  </div>
                );
              })}
                            
              {selectedValues.length > 0 && (
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={handleClear}
                    className="w-full text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-accent transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}