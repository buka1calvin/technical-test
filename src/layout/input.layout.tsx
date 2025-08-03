import React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "number";
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error,
  className,
  ...props
}: InputProps) {
  const inputClasses = cn(
    "w-full h-10 px-3 text-base border",
    "bg-input border-border",
    "text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
    "!text-gray-900 placeholder:!text-gray-500",
    "dark:!text-gray-100 dark:placeholder:!text-gray-400",
    error && "border-destructive focus:ring-destructive",
    className
  );

  return (
    <div className="w-full">
      <ShadcnInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <span className="text-sm text-destructive mt-1 block">{error}</span>
      )}
    </div>
  );
}
