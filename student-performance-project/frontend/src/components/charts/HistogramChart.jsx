/**
 * Histogram Chart Component.
 * Visualizes continuous score or metric frequency distributions using Recharts BarChart.
 * Wrapped in motion.div with 0.5s fade-in.
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function HistogramChart({
  data = [],
  xKey = 'range',
  yKey = 'count',
  title = 'Score Distribution',
  barColor = '#6366f1', // indigo-500
  height = 320,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col"
    >
      <div className="h-[320px] w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              cursor={{ fill: 'rgba(30, 41, 59, 0.5)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
                      <p className="text-xs font-semibold text-slate-200">{label}</p>
                      <p className="text-xs font-medium text-indigo-400">
                        {payload[0].value} students
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={yKey}
              fill={barColor}
              radius={[6, 6, 0, 0]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
