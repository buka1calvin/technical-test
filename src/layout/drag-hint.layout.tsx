import React from 'react';
import { cn } from '@/lib/utils';
import Typography from '@/src/layout/typography.layout';

interface DragHintProps {
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  className?: string;
}

export default function DragHint({
  children,
  icon: Icon,
  className
}: DragHintProps) {
  return (
    <div className={cn(
      'mb-4 p-3 bg-orange-50/60 rounded-lg border border-orange-100',
      className
    )}>
      <Typography.Caption className={cn(
        'flex items-center gap-2 text-primary',
        className
      )}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </Typography.Caption>
    </div>
  );
}