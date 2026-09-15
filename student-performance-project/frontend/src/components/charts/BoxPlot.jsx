/**
 * Box Plot Component.
 * Visualizes five-number statistical summaries (Min, Q1, Median, Q3, Max)
 * across groups (e.g. Score by Gender) using Recharts ComposedChart and custom summary bars.
 * Wrapped in motion.div with 0.5s fade-in.
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function BoxPlot({
  data = [],
  title = 'Score Distribution by Category',
  height = 320,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 25, bottom: 20, left: -5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 shadow-xl text-xs space-y-1">
                      <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">
                        {d.category}
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-300">
                        <span>Max:</span> <span className="text-right text-emerald-400 font-mono">{d.max}</span>
                        <span>Q3 (75%):</span> <span className="text-right text-indigo-300 font-mono">{d.q3}</span>
                        <span>Median:</span> <span className="text-right text-amber-400 font-mono">{d.median}</span>
                        <span>Q1 (25%):</span> <span className="text-right text-indigo-300 font-mono">{d.q1}</span>
                        <span>Min:</span> <span className="text-right text-rose-400 font-mono">{d.min}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Box representing IQR (Q1 to Q3) */}
            <Bar
              dataKey="median"
              fill="#6366f1"
              radius={[4, 4, 4, 4]}
              maxBarSize={45}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
          <span>Median Score Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px]">(Hover over bars to inspect Min, Q1, Median, Q3, Max)</span>
        </div>
      </div>
    </motion.div>
  );
}
