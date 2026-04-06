import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2";

  const variants = {
    primary: "bg-ember text-white hover:bg-dusk",
    outline:
      "border border-ember text-ember hover:bg-ember hover:text-white dark:hover:bg-ember dark:hover:text-white",
    ghost: "text-stone hover:bg-terracotta dark:hover:bg-[#26201a]",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-11 px-6 text-sm", // min 44px h
    lg: "h-14 px-8 text-base",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
