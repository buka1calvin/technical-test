import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  hover = false,
  clickable = false,
  onClick,
  className,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-card border border-border shadow-sm',
    elevated: 'bg-card border border-border shadow-md',
    outlined: 'bg-card border-2 border-border shadow-none',
    ghost: 'bg-transparent border-none shadow-none'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const cardClasses = cn(
    'text-card-foreground transition-all duration-200',
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    hover && 'hover:shadow-lg hover:scale-[1.02]',
    clickable && 'cursor-pointer hover:bg-accent/50',
    (clickable || onClick) && 'focus:outline-none focus:ring-2 focus:ring-ring',
    className
  );

  const handleClick = () => {
    if (onClick && !clickable) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((clickable || onClick) && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <ShadcnCard
      className={cardClasses}
      onClick={clickable ? onClick : handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={(clickable || onClick) ? 0 : undefined}
      role={(clickable || onClick) ? 'button' : undefined}
      {...props}
    >
      {children}
    </ShadcnCard>
  );
}

Card.Header = function CardHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <h3 className={cn('text-lg font-semibold text-card-foreground', className)}>
      {children}
    </h3>
  );
};

Card.Content = function CardContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('text-muted-foreground', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border', className)}>
      {children}
    </div>
  );
};