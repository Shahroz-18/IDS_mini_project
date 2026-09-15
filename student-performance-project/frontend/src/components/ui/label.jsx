/**
 * UI Label Component.
 * Standard accessible form label component.
 */
import React from 'react';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-xs font-semibold text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none block mb-1.5',
      className
    )}
    {...props}
  >
    {children}
  </label>
));

Label.displayName = 'Label';
export default Label;
