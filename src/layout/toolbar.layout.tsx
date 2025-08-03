import React from 'react';
import { cn } from '@/lib/utils';
import SearchInput from './search.layout';
import FilterDropdown from './filter.layout';
import { SortDropdown } from './sorting.layout';

interface ToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-lg',
      'items-start sm:items-center justify-between',
      className
    )}>
      {children}
    </div>
  );
}

Toolbar.Left = function ToolbarLeft({ children, className }: ToolbarProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      {children}
    </div>
  );
};

Toolbar.Right = function ToolbarRight({ children, className }: ToolbarProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      {children}
    </div>
  );
};

Toolbar.Search = SearchInput;
Toolbar.Filter = FilterDropdown;
Toolbar.Sort = SortDropdown;