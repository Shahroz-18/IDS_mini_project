import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Fail: Rose gradient (deep -> bright)
const FAIL_COLORS = ['#9f1239', '#be123c', '#e11d48'];

// Pass: Solid emerald-400 (matches the Pass Rate text color)
const PASS_COLOR = '#34d399';

const PASS_THRESHOLD_INDEX = 3; // 70-79 is the first "Pass" bucket

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  const isPass = parseInt(label.split('-')[0], 10) >= 70;

  return (
    <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
        Score Range
      </p>
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isPass ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
        <span className="text-xs text-slate-400">Students:</span>
        <span className="text-sm font-bold text-white">{value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default function ExamScoreChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-full min-h-[250px] flex items-center justify-center text-slate-500 text-sm">
        Loading chart...
      </div>
    );
  }

  const chartData = Object.keys(data).map((key, index) => {
    const isPass = index >= PASS_THRESHOLD_INDEX;
    return {
      range: key,
      count: data[key],
      color: isPass ? PASS_COLOR : FAIL_COLORS[index % FAIL_COLORS.length],
      isPass,
    };
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Exam Score Distribution
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Red = Fail (below 70) · Green = Pass (70 and above) · Y-axis: Number of Students
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="range"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.3 }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}