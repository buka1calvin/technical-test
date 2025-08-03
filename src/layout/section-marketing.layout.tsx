import React from 'react';
import { CheckCircle, ShoppingBag, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketingSectionProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  features?: Array<{
    icon: React.ReactNode;
    text: string;
    iconColor?: string;
  }>;
  className?: string;
}

export default function MarketingSection({
  title = "Manage Your Products",
  subtitle = "Simple, fast, and organized product management for your business",
  icon = <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-primary-foreground" />,
  features = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Email-only login - no passwords to remember",
      iconColor: "text-green-300"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Drag & drop reordering",
      iconColor: "text-yellow-300"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Your data stays private and secure",
      iconColor: "text-blue-300"
    }
  ],
  className,
  ...props
}: MarketingSectionProps) {
  return (
    <div className={cn('text-center space-y-8', className)} {...props}>
      <div>
        {icon}
        <h1 className="text-4xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-xl opacity-90 max-w-md mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className={cn(feature.iconColor)}>
              {feature.icon}
            </span>
            <span className="text-left">{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}