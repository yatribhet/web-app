import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "ember" | "sage" | "terracotta";
  className?: string;
}

export function Badge({ children, variant = "ember", className = "" }: BadgeProps) {
  const base = "inline-flex items-center px-1.5 py-0.5 rounded tracking-wider uppercase";
  
  const variants = {
    ember: "bg-ember text-white text-[10px]",
    sage: "bg-sage text-white text-[10px]",
    terracotta: "bg-terracotta dark:bg-[#26201a] text-[#8b4a1a] dark:text-[#d4936a] text-[10px]",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
