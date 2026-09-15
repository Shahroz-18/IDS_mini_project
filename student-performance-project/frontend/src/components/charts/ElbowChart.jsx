/**
 * Elbow Chart Component.
 * Visualizes inertia / within-cluster sum of squares (WCSS) vs K clusters
 * to identify optimal cluster count using Recharts LineChart.
 * Wrapped in motion.div with 0.5s fade-in.
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts';

export default function ElbowChart({
  data = [
    { k: 1, inertia: 12500 },
    { k: 2, inertia: 7200 },
    { k: 3, inertia: 3800 },
    { k: 4, inertia: 3100 },
    { k: 5, inertia: 2600 },
    { k: 6, inertia: 2200 },
    { k: 7, inertia: 1900 },
    { k: 8, inertia: 1700 },
  ],
  optimalK = 3,
  height = 320,
}) {
  const optimalPoint = data.find((d) => d.k === optimalK);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 25, bottom: 20, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="k"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              label={{
                value: 'Number of Clusters (k)',
                position: 'insideBottom',
                offset: -10,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              label={{
                value: 'Inertia (WCSS)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
                      <p className="text-xs font-semibold text-slate-200">
                        k = {label}
                      </p>
                      <p className="text-xs font-medium text-indigo-400">
                        Inertia: {payload[0].value.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="inertia"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: '#6366f1', stroke: '#0f172a', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#818cf8' }}
            />
            {optimalPoint && (
              <ReferenceDot
                x={optimalPoint.k}
                y={optimalPoint.inertia}
                r={9}
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
          <span>Optimal Elbow Point (k={optimalK})</span>
        </div>
      </div>
    </motion.div>
  );
}
