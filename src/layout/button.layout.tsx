import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className,
  ...props
}: ButtonProps) {

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    outline: 'btn-outline'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-base rounded-lg',
    lg: 'h-12 px-6 text-lg rounded-lg'
  };

  const buttonClasses = cn(
    'inline-flex items-center justify-center gap-2 font-medium',
    'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    loading && 'cursor-wait',
    className
  );

  const handleClick = () => {
    if (!loading && !disabled && onClick) {
      onClick();
    }
  };

  const LoadingSpinner = () => (
    <Loader2 className={cn(
      'animate-spin',
      size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
    )} />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
          {children && <span>Loading...</span>}
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          <span className={cn(
            size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
          )}>
            {icon}
          </span>
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          <span className={cn(
            size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
          )}>
            {icon}
          </span>
        </>
      );
    }

    return children;
  };

  return (
    <ShadcnButton
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {renderContent()}
    </ShadcnButton>
  );
}