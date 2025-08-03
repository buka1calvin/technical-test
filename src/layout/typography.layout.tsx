import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export default function Typography({ children, className }: TypographyProps) {
  return <span className={className}>{children}</span>;
}

Typography.Display = function Display({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('text-display', className)}>
      {children}
    </h1>
  );
};

Typography.Heading = function Heading({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('text-heading', className)}>
      {children}
    </h2>
  );
};

Typography.Subheading = function Subheading({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('text-subheading', className)}>
      {children}
    </h3>
  );
};

Typography.Body = function Body({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-body', className)}>
      {children}
    </p>
  );
};

Typography.BodySecondary = function BodySecondary({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-body-sec', className)}>
      {children}
    </p>
  );
};

Typography.Caption = function Caption({ children, className }: TypographyProps) {
  return (
    <span className={cn('text-caption', className)}>
      {children}
    </span>
  );
};

Typography.Label = function Label({ children, className }: TypographyProps) {
  return (
    <span className={cn('text-label', className)}>
      {children}
    </span>
  );
};

Typography.Amount = function Amount({ children, className }: TypographyProps) {
  return (
    <span className={cn('product-amount', className)}>
      {children}
    </span>
  );
};

Typography.Meta = function Meta({ 
  children, 
  className,
  icon: Icon
}: TypographyProps & { icon?: React.ComponentType<any> }) {
  return (
    <div className={cn('product-meta', className)}>
      {Icon && <Icon className="product-meta-icon" />}
      <span>{children}</span>
    </div>
  );
};