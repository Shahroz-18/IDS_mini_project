/**
 * Shared SectionTitle Component.
 * Standardized header block for page sections with title, description, and optional action/badge.
 */
import React from 'react';
import Badge from '@/components/ui/badge';

export default function SectionTitle({
  title,
  subtitle,
  experimentNumber,
  badgeText,
  action,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {experimentNumber && (
            <Badge variant="default" className="text-[11px] font-mono">
              Exp {experimentNumber}
            </Badge>
          )}
          {badgeText && (
            <Badge variant="secondary" className="text-[11px]">
              {badgeText}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
