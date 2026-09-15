/**
 * UI Badge Component.
 * Label badges for status, experiment numbers, and categories.
 */
import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30',
  secondary: 'bg-slate-800 text-slate-300 border-slate-700',
  outline: 'text-slate-300 border-slate-700 bg-transparent',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  destructive: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Badge;
