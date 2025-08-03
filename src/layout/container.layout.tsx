import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function Container({
  children,
  size = 'lg',
  className,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl', 
    lg: 'max-w-4xl',  
    xl: 'max-w-6xl',     
    full: 'max-w-none'   
  };

  const containerClasses = cn(
    'mx-auto w-full',
    'px-4',  
    'md:px-24',  
    'xl:px-0',
    sizeClasses[size],
    className
  );

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

Container.Auth = function AuthContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center',
      'px-4 py-8',
      className
    )}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

Container.Split = function SplitContainer({ 
  left, 
  right, 
  className 
}: { 
  left: React.ReactNode; 
  right: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'min-h-screen flex',
      className
    )}>
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground">
        <div className="flex items-center justify-center p-12">
          {left}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-8">
          {right}
        </div>
      </div>
    </div>
  );
};

Container.Page = function PageContainer({ 
  children, 
  title,
  className 
}: { 
  children: React.ReactNode; 
  title?: string;
  className?: string; 
}) {
  return (
    <Container size="lg" className={cn('py-8', className)}>
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-foreground">{title}</h1>
        </div>
      )}
      {children}
    </Container>
  );
};