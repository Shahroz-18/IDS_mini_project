/**
 * Shared MetricCard Component.
 * Framer-motion animated stat card displaying a key KPI with lucide-react icon.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cardMotionVariants } from '@/components/ui/card';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10 border-indigo-500/20',
  badge,
}) {
  return (
    <motion.div
      variants={cardMotionVariants}
      initial="hidden"
      animate="visible"
      className="relative rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md flex flex-col justify-between overflow-hidden group hover:border-slate-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="text-2xl font-bold tracking-tight text-white">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-xl border ${iconBg} ${iconColor} shrink-0`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {badge && <span>{badge}</span>}
        </div>
      )}
    </motion.div>
  );
}
