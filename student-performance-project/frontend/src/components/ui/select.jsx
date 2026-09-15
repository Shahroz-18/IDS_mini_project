/**
 * UI Select Component.
 * Styled select dropdown with lucide ChevronDown icon indicator.
 */
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 pr-8 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
        <ChevronDown size={16} />
      </div>
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
