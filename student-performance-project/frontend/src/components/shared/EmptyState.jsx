/**
 * Shared EmptyState Component.
 * Fallback display when data is unavailable or empty with lucide-react icon.
 */
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';

export default function EmptyState({
  title = 'No Data Found',
  description = 'There is no data available to display at the moment.',
  icon: Icon = AlertCircle,
  onRetry,
  retryLabel = 'Retry Request',
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 md:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-xs md:text-sm text-slate-400 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw size={14} />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
