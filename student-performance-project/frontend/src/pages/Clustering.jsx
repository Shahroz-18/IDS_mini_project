import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter, Line } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

const Clustering = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/clustering/train`)
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Training clustering model...</div>;
  if (!result) return <div className="error">Failed to load clustering results</div>;

  const elbowData = {
    labels: result.elbow.k_values,
    datasets: [{
      label: 'Inertia',
      data: result.elbow.inertias,
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      fill: true,
      tension: 0.3
    }]
  };

  const clusterColors = ['#e74c3c', '#f39c12', '#2ecc71'];
  const scatterData = {
    datasets: [0, 1, 2].map(clusterId => ({
      label: result.clusters[`Cluster_${clusterId}`]?.label || `Cluster ${clusterId}`,
      data: result.scatter_data.hours_studied
        .map((h, i) => ({ h, s: result.scatter_data.exam_score[i], c: result.scatter_data.cluster[i] }))
        .filter(d => d.c === clusterId)
        .map(d => ({ x: d.h, y: d.s })),
      backgroundColor: clusterColors[clusterId],
      pointRadius: 5
    }))
  };

  return (
    <div className="page">
      <h1>K-Means Clustering</h1>

      <ChartCard title="Elbow Method" description="Find optimal K by identifying the 'elbow' point">
        <Line data={elbowData} options={{
          scales: {
            x: { title: { display: true, text: 'Number of Clusters (K)' } },
            y: { title: { display: true, text: 'Inertia' } }
          }
        }} />
      </ChartCard>

      <ChartCard title="Student Clusters" description="Students grouped by Hours Studied and Exam Score">
        <Scatter data={scatterData} options={{
          scales: {
            x: { title: { display: true, text: 'Hours Studied' } },
            y: { title: { display: true, text: 'Exam Score' } }
          }
        }} />
      </ChartCard>

      <section className="section">
        <h2>Cluster Descriptions</h2>
        <div className="clusters-grid">
          {Object.entries(result.clusters).map(([key, cluster]) => (
            <div className="cluster-card" key={key}>
              <h3>{cluster.label}</h3>
              <p>Students: {cluster.count}</p>
              <p>Avg Hours Studied: {cluster.avg_hours_studied}</p>
              <p>Avg Attendance: {cluster.avg_attendance}%</p>
              <p>Avg Exam Score: {cluster.avg_exam_score}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Clustering;