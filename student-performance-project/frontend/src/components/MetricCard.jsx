import React from 'react';

const MetricCard = ({ title, value, subtitle, color = '#3498db' }) => {
  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <h4>{title}</h4>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
    </div>
  );
};

export default MetricCard;