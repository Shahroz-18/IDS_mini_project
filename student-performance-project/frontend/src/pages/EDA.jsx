import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

const EDA = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/eda/data`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading EDA data...</div>;
  if (!data) return <div className="error">Failed to load EDA data</div>;

  const scatterData = {
    datasets: [{
      label: 'Hours Studied vs Exam Score',
      data: data.hours_studied.map((h, i) => ({ x: h, y: data.exam_score[i] })),
      backgroundColor: 'rgba(52, 152, 219, 0.6)',
      pointRadius: 4
    }]
  };

  const genderData = {
    labels: Object.keys(data.gender_counts),
    datasets: [{
      label: 'Count',
      data: Object.values(data.gender_counts),
      backgroundColor: ['#3498db', '#e74c3c']
    }]
  };

  return (
    <div className="page">
      <h1>Exploratory Data Analysis</h1>

      <div className="charts-grid">
        <ChartCard 
          title="Hours Studied vs Exam Score" 
          description="Positive correlation observed - more study hours generally lead to higher scores"
        >
          <Scatter data={scatterData} options={{ 
            scales: { 
              x: { title: { display: true, text: 'Hours Studied' } },
              y: { title: { display: true, text: 'Exam Score' } }
            } 
          }} />
        </ChartCard>

        <ChartCard 
          title="Gender Distribution" 
          description="Balanced representation of male and female students"
        >
          <Bar data={genderData} options={{ 
            scales: { y: { title: { display: true, text: 'Count' } } } 
          }} />
        </ChartCard>
      </div>

      <section className="section">
        <h2>Key Observations</h2>
        <ul className="observations-list">
          <li><strong>Study Time Impact:</strong> Clear positive relationship between Hours_Studied and Exam_Score</li>
          <li><strong>Attendance Matters:</strong> Higher attendance correlates with better performance</li>
          <li><strong>Previous Scores:</strong> Strong predictor of current performance</li>
          <li><strong>Outliers:</strong> A few students with very low attendance despite high scores</li>
          <li><strong>Distribution:</strong> Exam scores are approximately normally distributed around 67</li>
        </ul>
      </section>
    </div>
  );
};

export default EDA;