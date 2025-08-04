import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/src/context/auth.context';
import { cn } from '@/lib/utils';
import Button from '@/src/layout/button.layout';

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
    'sm:px-6',
    'lg:px-8',
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
        <div className="flex items-center justify-center p-12 w-full">
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
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Container size="full" className={cn('py-8', className)}>
      {title && (
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-display">{title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.email}</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<LogOut />}
              onClick={handleLogout}
              loading={isLoggingOut}
              disabled={isLoggingOut}
              className=" hover:text-destructive"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </Container>
  );
};

Container.ProductGrid = function ProductGridContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      'grid gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'xl:grid-cols-3',
      className
    )}>
      {children}
    </div>
  );
};

Container.ProductActions = function ProductActionsContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      'flex flex-col items-center gap-4',
      className
    )}>
      {children}
    </div>
  );
};

Container.ProductLoadMore = function ProductLoadMoreContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('max-w-md w-full', className)}>
      {children}
    </div>
  );
};

Container.ProductMetaGroup = function ProductMetaGroupContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {children}
    </div>
  );
};

Container.ProductStats = function ProductStatsContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      'stats-container',
      className
    )}>
      {children}
    </div>
  );
};

Container.ProductCard = function ProductCardContainer({
  children,
  className,
  onKeyDown
}: {
  children: React.ReactNode;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div
      className={cn('group', className)}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

Container.ActionGroup = function ActionGroupContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-2 mt-3', className)}>
      {children}
    </div>
  );
};

Container.EditField = function EditFieldContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex-1 mr-4', className)}>
      {children}
    </div>
  );
};

Container.AmountField = function AmountFieldContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('w-32', className)}>
      {children}
    </div>
  );
};

Container.LoadingCenter = function LoadingCenterContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex justify-center py-4', className)}>
      {children}
    </div>
  );
};