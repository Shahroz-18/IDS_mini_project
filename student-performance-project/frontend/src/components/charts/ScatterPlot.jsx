/**
 * Scatter Plot Component.
 * Visualizes pairwise feature correlations (e.g. Study Time vs Score) using Recharts ScatterChart.
 * Wrapped in motion.div with 0.5s fade-in.
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function ScatterPlot({
  data = [],
  xKey = 'x',
  yKey = 'y',
  xLabel = 'X Axis',
  yLabel = 'Y Axis',
  pointColor = '#6366f1',
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
          <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xLabel}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              label={{
                value: xLabel,
                position: 'insideBottom',
                offset: -12,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yLabel}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              label={{
                value: yLabel,
                angle: -90,
                position: 'insideLeft',
                offset: 15,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#475569' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
                      <p className="text-xs font-semibold text-slate-200">
                        {xLabel}: <span className="text-indigo-400">{dataPoint[xKey]}</span>
                      </p>
                      <p className="text-xs font-semibold text-slate-200">
                        {yLabel}: <span className="text-emerald-400">{dataPoint[yKey]}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Students"
              data={data}
              fill={pointColor}
              fillOpacity={0.65}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
