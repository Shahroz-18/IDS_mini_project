import React from 'react';

const ChartCard = ({ title, children, description }) => {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {description && <p className="chart-description">{description}</p>}
      <div className="chart-container">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;