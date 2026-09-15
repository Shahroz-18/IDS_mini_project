/**
 * UI Skeleton Component.
 * Loading placeholder with subtle pulsing background.
 */
import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-slate-800/80', className)}
      {...props}
    />
  );
}

export default Skeleton;
