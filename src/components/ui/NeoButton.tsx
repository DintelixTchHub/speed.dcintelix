"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface NeoButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
}

export function NeoButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  className,
  type = "button",
}: NeoButtonProps) {
  const baseStyles = "neo-button";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-brand to-secondary text-background",
    secondary:
      "bg-glass-bg border border-glass-border text-text-primary",
    outline:
      "bg-transparent border-2 border-brand text-brand hover:bg-brand/10",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "relative overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
        </span>
      )}
      <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
    </button>
  );
}
