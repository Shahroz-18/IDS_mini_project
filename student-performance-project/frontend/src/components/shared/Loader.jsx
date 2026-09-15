/**
 * Shared Loader Component.
 * Uses lucide-react Loader2 icon with spin animation and text message.
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({
  message = 'Loading analysis data...',
  size = 28,
  fullPage = false,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <Loader2 size={size} className="animate-spin text-indigo-500" />
      <p className="text-xs md:text-sm font-medium text-slate-400">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[400px] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
}
