/**
 * Confusion Matrix Component.
 * Styled 2x2 grid representing classification outcomes (TP, FP, FN, TN)
 * with color-coded intensity cells and accuracy breakdown.
 * Wrapped in motion.div with 0.5s fade-in.
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function ConfusionMatrix({
  matrix = [
    [850, 62],  // Actual Fail: [TN, FP]
    [48, 1040], // Actual Pass: [FN, TP]
  ],
  labels = ['Fail', 'Pass'],
}) {
  const tn = matrix[0]?.[0] ?? 0;
  const fp = matrix[0]?.[1] ?? 0;
  const fn = matrix[1]?.[0] ?? 0;
  const tp = matrix[1]?.[1] ?? 0;

  const total = tn + fp + fn + tp || 1;

  const cells = [
    {
      title: 'True Negative (TN)',
      value: tn,
      pct: ((tn / total) * 100).toFixed(1),
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      actual: labels[0],
      predicted: labels[0],
    },
    {
      title: 'False Positive (FP)',
      value: fp,
      pct: ((fp / total) * 100).toFixed(1),
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      actual: labels[0],
      predicted: labels[1],
    },
    {
      title: 'False Negative (FN)',
      value: fn,
      pct: ((fn / total) * 100).toFixed(1),
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      actual: labels[1],
      predicted: labels[0],
    },
    {
      title: 'True Positive (TP)',
      value: tp,
      pct: ((tp / total) * 100).toFixed(1),
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      actual: labels[1],
      predicted: labels[1],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full max-w-md">
        {/* Top predicted header */}
        <div className="text-center mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Predicted Class
          </span>
          <div className="grid grid-cols-2 mt-1 text-xs font-semibold text-slate-300">
            <div>Predicted {labels[0]}</div>
            <div>Predicted {labels[1]}</div>
          </div>
        </div>

        {/* Matrix Row 1 */}
        <div className="grid grid-cols-[80px_1fr_1fr] gap-2 items-center mb-2">
          <div className="text-xs font-semibold text-slate-400 text-right pr-2">
            Actual {labels[0]}
          </div>
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${cells[0].bg}`}
          >
            <span className="text-xl font-bold">{cells[0].value}</span>
            <span className="text-[11px] opacity-80">{cells[0].title}</span>
            <span className="text-[10px] font-mono mt-0.5">{cells[0].pct}%</span>
          </div>
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${cells[1].bg}`}
          >
            <span className="text-xl font-bold">{cells[1].value}</span>
            <span className="text-[11px] opacity-80">{cells[1].title}</span>
            <span className="text-[10px] font-mono mt-0.5">{cells[1].pct}%</span>
          </div>
        </div>

        {/* Matrix Row 2 */}
        <div className="grid grid-cols-[80px_1fr_1fr] gap-2 items-center">
          <div className="text-xs font-semibold text-slate-400 text-right pr-2">
            Actual {labels[1]}
          </div>
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${cells[2].bg}`}
          >
            <span className="text-xl font-bold">{cells[2].value}</span>
            <span className="text-[11px] opacity-80">{cells[2].title}</span>
            <span className="text-[10px] font-mono mt-0.5">{cells[2].pct}%</span>
          </div>
          <div
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${cells[3].bg}`}
          >
            <span className="text-xl font-bold">{cells[3].value}</span>
            <span className="text-[11px] opacity-80">{cells[3].title}</span>
            <span className="text-[10px] font-mono mt-0.5">{cells[3].pct}%</span>
          </div>
        </div>

        {/* Summary note */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
          <span>Total Evaluated: <strong className="text-slate-200">{total}</strong></span>
          <span>Correct: <strong className="text-emerald-400">{tn + tp}</strong> ({(((tn + tp) / total) * 100).toFixed(1)}%)</span>
        </div>
      </div>
    </motion.div>
  );
}
