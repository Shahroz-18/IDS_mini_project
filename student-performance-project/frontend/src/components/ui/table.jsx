/**
 * UI Table Component.
 * Responsive data table components with shadcn styling and slate-800 borders.
 */
import React from 'react';
import { cn } from '@/lib/utils';

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border border-slate-800">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm text-left', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b border-slate-800 bg-slate-900/90', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0 divide-y divide-slate-800/60', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-slate-900/50 font-medium text-slate-300 border-t border-slate-800', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-slate-800/80 transition-colors hover:bg-slate-800/50 data-[state=selected]:bg-slate-800',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wider text-slate-400 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-slate-200 text-sm [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-xs text-slate-400 italic', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export default Table;
