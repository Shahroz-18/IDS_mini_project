/**
 * Correlation Heatmap Component.
 * Visualizes pairwise Pearson correlation coefficients between features
 * using Plotly.js via react-plotly.js in dark theme.
 * Wrapped in motion.div with 0.5s fade-in.
 */
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min';

export default function CorrelationHeatmap({
  x = [
    'Hours_Studied',
    'Attendance',
    'Sleep_Hours',
    'Previous_Scores',
    'Tutoring_Sessions',
    'Physical_Activity',
    'Exam_Score',
  ],
  y = [
    'Hours_Studied',
    'Attendance',
    'Sleep_Hours',
    'Previous_Scores',
    'Tutoring_Sessions',
    'Physical_Activity',
    'Exam_Score',
  ],
  z = [
    [1.0, 0.58, 0.12, 0.44, 0.31, 0.08, 0.68],
    [0.58, 1.0, 0.05, 0.52, 0.22, 0.04, 0.72],
    [0.12, 0.05, 1.0, 0.09, 0.02, 0.15, 0.18],
    [0.44, 0.52, 0.09, 1.0, 0.28, 0.06, 0.79],
    [0.31, 0.22, 0.02, 0.28, 1.0, 0.01, 0.39],
    [0.08, 0.04, 0.15, 0.06, 0.01, 1.0, 0.09],
    [0.68, 0.72, 0.18, 0.79, 0.39, 0.09, 1.0],
  ],
  height = 420,
}) {
  const plotRef = useRef(null);

  // Purge Plotly instance on unmount to prevent stale DOM artifacts
  useEffect(() => {
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex items-center justify-center overflow-hidden"
    >
      <div ref={plotRef} className="w-full" style={{ minHeight: height }}>
        <Plot
          data={[
            {
              z: z,
              x: x,
              y: y,
              type: 'heatmap',
              colorscale: [
                [0, '#0f172a'],      // slate-900
                [0.25, '#312e81'],   // indigo-950
                [0.5, '#4f46e5'],    // indigo-600
                [0.75, '#818cf8'],   // indigo-400
                [1.0, '#38bdf8'],    // sky-400
              ],
              hoverongaps: false,
              showscale: true,
              colorbar: {
                tickfont: { color: '#94a3b8', size: 11 },
                outlinecolor: '#334155',
                outlinewidth: 1,
              },
            },
          ]}
          layout={{
            autosize: true,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            margin: { t: 30, r: 40, b: 80, l: 120 },
            xaxis: {
              tickfont: { color: '#cbd5e1', size: 11 },
              tickangle: -35,
              gridcolor: '#1e293b',
            },
            yaxis: {
              tickfont: { color: '#cbd5e1', size: 11 },
              gridcolor: '#1e293b',
            },
            font: {
              family: 'Inter, sans-serif',
              color: '#f8fafc',
            },
          }}
          config={{
            responsive: true,
            displayModeBar: false,
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: `${height}px` }}
        />
      </div>
    </motion.div>
  );
}
