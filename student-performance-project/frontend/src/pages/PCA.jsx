import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';
import MetricCard from '../components/MetricCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

const PCA = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/pca/analyze`)
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Performing PCA...</div>;
  if (!result) return <div className="error">Failed to load PCA results</div>;

  const varianceData = {
    labels: result.explained_variance.map((_, i) => `PC${i + 1}`),
    datasets: [{
      label: 'Explained Variance Ratio',
      data: result.explained_variance,
      backgroundColor: 'rgba(52, 152, 219, 0.7)'
    }]
  };

  const cumulativeData = {
    labels: result.cumulative_variance.map((_, i) => `PC${i + 1}`),
    datasets: [{
      label: 'Cumulative Explained Variance',
      data: result.cumulative_variance,
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.2)',
      fill: true,
      tension: 0.3
    }]
  };

  const scatterData = {
    datasets: [
      {
        label: 'Fail',
        data: result.pca_scatter.pc1
          .map((x, i) => ({ x, y: result.pca_scatter.pc2[i], c: result.pca_scatter.class[i] }))
          .filter(d => d.c === 0)
          .map(d => ({ x: d.x, y: d.y })),
        backgroundColor: '#e74c3c',
        pointRadius: 4
      },
      {
        label: 'Pass',
        data: result.pca_scatter.pc1
          .map((x, i) => ({ x, y: result.pca_scatter.pc2[i], c: result.pca_scatter.class[i] }))
          .filter(d => d.c === 1)
          .map(d => ({ x: d.x, y: d.y })),
        backgroundColor: '#2ecc71',
        pointRadius: 4
      }
    ]
  };

  return (
    <div className="page">
      <h1>PCA & Dimensionality Reduction</h1>

      <section className="section">
        <h2>Variance Summary</h2>
        <div className="metrics-row">
          <MetricCard title="Original Features" value={result.n_original_features} color="#3498db" />
          <MetricCard title="Components (95% var)" value={result.n_components_95} color="#2ecc71" />
          <MetricCard 
            title="PC1 Variance" 
            value={`${(result.pca_2d_variance[0] * 100).toFixed(1)}%`} 
            color="#e67e22" 
          />
          <MetricCard 
            title="PC2 Variance" 
            value={`${(result.pca_2d_variance[1] * 100).toFixed(1)}%`} 
            color="#9b59b6" 
          />
        </div>
      </section>

      <div className="charts-grid">
        <ChartCard title="Explained Variance by Component">
          <Bar data={varianceData} options={{
            scales: { y: { title: { display: true, text: 'Variance Ratio' } } }
          }} />
        </ChartCard>

        <ChartCard title="Cumulative Explained Variance">
          <Bar data={cumulativeData} options={{
            scales: { y: { title: { display: true, text: 'Cumulative Variance' }, max: 1 } }
          }} />
        </ChartCard>
      </div>

      <ChartCard title="PCA 2D Visualization" description="Students projected onto first two principal components, colored by Pass/Fail">
        <Scatter data={scatterData} options={{
          scales: {
            x: { title: { display: true, text: 'Principal Component 1' } },
            y: { title: { display: true, text: 'Principal Component 2' } }
          }
        }} />
      </ChartCard>
    </div>
  );
};

export default PCA;