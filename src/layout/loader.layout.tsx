import React from 'react';
import { PulseLoader, ClipLoader, DotLoader } from 'react-spinners';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  message?: string;
  className?: string;
}

export default function Loading({
  size = 'md',
  variant = 'spinner',
  message,
  className
}: LoadingProps) {
  const sizeMap = {
    sm: { spinner: 16, dots: 8, pulse: 6 },
    md: { spinner: 24, dots: 12, pulse: 8 },
    lg: { spinner: 32, dots: 16, pulse: 12 }
  };

  const primaryColor = 'oklch(0.65 0.15 45)'; 

  const renderLoader = () => {
    const loaderSize = sizeMap[size][variant];
    
    switch (variant) {
      case 'dots':
        return <DotLoader size={loaderSize} color={primaryColor} />;
      case 'pulse':
        return <PulseLoader size={loaderSize} color={primaryColor} margin={2} />;
      default:
        return <ClipLoader size={loaderSize} color={primaryColor} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {renderLoader()}
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

Loading.Page = function PageLoading({ 
  message = "Loading..." 
}: { 
  message?: string 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading 
        size="lg" 
        variant="spinner" 
        message={message}
        className="text-center"
      />
    </div>
  );
};

Loading.Card = function CardLoading({ 
  message 
}: { 
  message?: string 
}) {
  return (
    <div className="p-8 flex items-center justify-center">
      <Loading 
        size="md" 
        variant="dots" 
        message={message}
      />
    </div>
  );
};

Loading.Inline = function InlineLoading({ 
  message 
}: { 
  message?: string 
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Loading 
        size="sm" 
        variant="pulse" 
        message={message}
        className="flex-row gap-2"
      />
    </div>
  );
};

Loading.Overlay = function OverlayLoading({ 
  message = "Processing..." 
}: { 
  message?: string 
}) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <Loading 
          size="lg" 
          variant="spinner" 
          message={message}
          className="text-center"
        />
      </div>
    </div>
  );
};