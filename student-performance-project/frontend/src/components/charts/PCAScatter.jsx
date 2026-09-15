/**
 * PCA Scatter Component.
 * Visualizes 2D Principal Components (PC1 vs PC2) with color encoding for
 * student performance outcome (Pass vs Fail) using Recharts ScatterChart.
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
  Legend,
} from 'recharts';

export default function PCAScatter({
  data = [],
  passData = [],
  failData = [],
  height = 360,
}) {
  // If data is passed as a single array with 'label' or 'pass' property, split it
  const passed =
    passData.length > 0
      ? passData
      : data.filter((d) => d.label === 'Pass' || d.pass === 1 || d.target === 1);
  const failed =
    failData.length > 0
      ? failData
      : data.filter((d) => d.label === 'Fail' || d.pass === 0 || d.target === 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 25, bottom: 20, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="pc1"
              name="PC1"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              label={{
                value: 'Principal Component 1 (PC1)',
                position: 'insideBottom',
                offset: -12,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="pc2"
              name="PC2"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              label={{
                value: 'Principal Component 2 (PC2)',
                angle: -90,
                position: 'insideLeft',
                offset: 12,
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#475569' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-white">
                        Student Status:{' '}
                        <span
                          className={
                            pt.label === 'Pass' || pt.pass === 1
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }
                        >
                          {pt.label || (pt.pass === 1 ? 'Pass' : 'Fail')}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        PC1: <span className="font-mono text-indigo-400">{Number(pt.pc1).toFixed(2)}</span>
                      </p>
                      <p className="text-slate-300">
                        PC2: <span className="font-mono text-indigo-400">{Number(pt.pc2).toFixed(2)}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
            />
            <Scatter
              name="Pass Status"
              data={passed}
              fill="#10b981" // emerald-500
              fillOpacity={0.7}
            />
            <Scatter
              name="Fail Status"
              data={failed}
              fill="#f43f5e" // rose-500
              fillOpacity={0.7}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
