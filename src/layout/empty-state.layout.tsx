import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('empty-state', className)}>
      <Icon className="empty-state-icon" />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && action}
    </div>
  );
}