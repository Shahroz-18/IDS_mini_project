/**
 * UI Button Component.
 * Styled button with framer-motion micro-interactions (whileHover 1.03, whileTap 0.97)
 * and shadcn style variants.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const variantClasses = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/30',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
  outline: 'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
  destructive: 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-600/30',
  link: 'text-indigo-400 underline-offset-4 hover:underline p-0 h-auto',
};

const sizeClasses = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-6 text-base font-semibold',
  icon: 'h-10 w-10 p-0 flex items-center justify-center',
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      disabled,
      children,
      type = 'button',
      animate = true,
      ...props
    },
    ref
  ) => {
    const Component = animate ? motion.button : 'button';
    const motionProps = animate
      ? {
          whileHover: disabled ? undefined : { scale: 1.03 },
          whileTap: disabled ? undefined : { scale: 0.97 },
          transition: { duration: 0.15 },
        }
      : {};

    return (
      <Component
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variantClasses[variant] || variantClasses.default,
          sizeClasses[size] || sizeClasses.default,
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;
