/**
 * PassFailChart Component.
 * Donut chart showing Pass/Fail distribution with summary stats.
 * Fetches live data from the pass/fail endpoint.
 */
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '@/api/axios';

// Softer, more harmonious colors for the dark theme
const COLORS = {
  Pass: '#10b981',   // Emerald
  Fail: '#f59e0b',   // Amber (less aggressive than rose red)
};

export default function PassFailChart() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dataset/pass-fail-stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to load pass/fail stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">Loading chart...</div>;
  }

  const chartData = [
    { name: 'Pass', value: stats.pass, color: COLORS.Pass },
    { name: 'Fail', value: stats.fail, color: COLORS.Fail },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center h-full space-y-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Dataset Distribution
      </h3>

      <div className="relative w-full flex justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}  // Bigger hole
              outerRadius={100} // Bigger ring
              paddingAngle={6}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-white">{stats.total.toLocaleString()}</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Students</span>
        </div>
      </div>

      {/* Cleaner Legend */}
      <div className="grid grid-cols-2 gap-4 w-full pt-2 border-t border-slate-800">
        <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50">
          <span className="text-xs text-slate-400 font-medium">Pass</span>
          <span className="text-lg font-bold text-emerald-400">{stats.pass_percentage}%</span>
          <span className="text-[10px] text-slate-500">{stats.pass.toLocaleString()} students</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50">
          <span className="text-xs text-slate-400 font-medium">Fail</span>
          <span className="text-lg font-bold text-amber-400">{stats.fail_percentage}%</span>
          <span className="text-[10px] text-slate-500">{stats.fail.toLocaleString()} students</span>
        </div>
      </div>
    </div>
  );
}