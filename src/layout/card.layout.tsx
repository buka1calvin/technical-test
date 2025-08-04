import React from "react";
import { Card as ShadcnCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "ghost" | "product";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl" | "none";
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  isEditing?: boolean;
  isDeleting?: boolean;
  isDraggable?: boolean;
  dragId?: string;
  isDragging?: boolean;
}

export default function Card({
  children,
  variant = "default",
  padding = "md",
  rounded = "lg",
  hover = false,
  clickable = false,
  onClick,
  className,
  isEditing = false,
  isDeleting = false,
  isDraggable = false,
  dragId,
  isDragging = false,
  ...props
}: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: dragId || '',
    disabled: !isDraggable || isEditing || isDeleting,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms ease',
  };

  const variantClasses = {
    default: "bg-card border border-border shadow-sm",
    elevated: "bg-card border border-border shadow-md",
    outlined: "bg-card border-2 border-border shadow-none",
    ghost: "bg-transparent border-none shadow-none",
    product: "product-card",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const roundedClasses = {
    none: "rounded-none border-0",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  const cardClasses = cn(
    "text-card-foreground transition-all duration-200 relative z-10",
    variantClasses[variant],
    variant !== "product" && paddingClasses[padding],
    variant !== "product" && roundedClasses[rounded],
    hover && variant !== "product" && "hover:shadow-lg",
    clickable && "cursor-pointer hover:bg-accent/50",
    (clickable || onClick) && "focus:outline-none focus:ring-2 focus:ring-ring",
    isEditing && "ring-2 ring-orange-200 shadow-lg",
    isDeleting && "ring-2 ring-red-200 bg-red-50/20",
    isDraggable && !isEditing && !isDeleting && "cursor-grab active:cursor-grabbing",
    sortableIsDragging && "opacity-50 shadow-2xl scale-105 z-50",
    isDragging && "opacity-50",
    className
  );

  const handleClick = () => {
    if (onClick && !clickable && !sortableIsDragging) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((clickable || onClick) && (e.key === "Enter" || e.key === " ") && !sortableIsDragging) {
      e.preventDefault();
      onClick?.();
    }
  };

  const dragEventHandlers = isDraggable && !isEditing && !isDeleting ? {
    ...attributes,
    ...listeners,
  } : {};

  const cardContent = variant === "product" ? (
    <div className={cn("relative z-20", paddingClasses[padding])}>
      {isDraggable && !isEditing && !isDeleting && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200 z-30 pointer-events-none">
          <div className="p-1 rounded bg-white/80 shadow-sm border border-orange-100">
            <GripVertical className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      )}
      {children}
    </div>
  ) : (
    <>
      {isDraggable && !isEditing && !isDeleting && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity duration-200 z-30 pointer-events-none">
          <div className="p-1 rounded bg-white/80 shadow-sm border border-orange-100">
            <GripVertical className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      )}
      {children}
    </>
  );

  if (isDraggable) {
    return (
      <ShadcnCard
        ref={setNodeRef}
        style={style}
        className={cardClasses}
        onClick={clickable ? onClick : handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={clickable || onClick ? 0 : undefined}
        role={clickable || onClick ? "button" : undefined}
        {...dragEventHandlers}
        {...props}
      >
        {cardContent}
      </ShadcnCard>
    );
  }

  return (
    <ShadcnCard
      className={cardClasses}
      onClick={clickable ? onClick : handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable || onClick ? 0 : undefined}
      role={clickable || onClick ? "button" : undefined}
      {...props}
    >
      {cardContent}
    </ShadcnCard>
  );
}

Card.Header = function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-heading leading-tight", className)}>{children}</h3>
  );
};

Card.Content = function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
};

Card.Comment = function CardComment({
  children,
  className,
  isEditing = false,
}: {
  children: React.ReactNode;
  className?: string;
  isEditing?: boolean;
}) {
  return (
    <div
      className={cn(
        isEditing
          ? "p-0 bg-transparent border-none"
          : "bg-orange-50/50 rounded-lg p-3 border border-orange-100",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 mt-6 pt-4 border-t border-border",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Actions = function CardActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.DeleteOverlay = function CardDeleteOverlay({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-red-50/90 rounded-lg flex items-center justify-center z-50",
        className
      )}
    >
      <div className="text-center p-4">{children}</div>
    </div>
  );
};

Card.EditHint = function CardEditHint({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-3 pt-3 border-t border-orange-100", className)}>
      {children}
    </div>
  );
};