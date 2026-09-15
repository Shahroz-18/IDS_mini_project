import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

const Regression = () => {
  const [result, setResult] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    Hours_Studied: 20,
    Attendance: 80,
    Sleep_Hours: 7,
    Previous_Scores: 75,
    Tutoring_Sessions: 2,
    Physical_Activity: 3,
    Motivation_Level: 1,
    Parental_Involvement: 1,
    Access_to_Resources: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/regression/train`)
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePredict = () => {
    axios.post(`${API_URL}/regression/predict`, formData)
      .then(res => setPrediction(res.data.predicted_score))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  if (loading) return <div className="loading">Training regression model...</div>;
  if (!result) return <div className="error">Failed to load regression results</div>;

  const scatterData = result.actual_vs_predicted ? {
    datasets: [
      {
        label: 'Actual vs Predicted',
        data: result.actual_vs_predicted.actual.map((a, i) => ({ 
          x: a, 
          y: result.actual_vs_predicted.predicted[i] 
        })),
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        pointRadius: 5
      },
      {
        label: 'Perfect Prediction',
        data: [{ x: 50, y: 50 }, { x: 100, y: 100 }],
        borderColor: 'red',
        borderWidth: 2,
        pointRadius: 0,
        showLine: true
      }
    ]
  } : null;

  return (
    <div className="page">
      <h1>Linear Regression - Score Prediction</h1>

      <section className="section">
        <h2>Model Performance</h2>
        <div className="metrics-row">
          <MetricCard title="R² Score" value={result.metrics.test.R2} color="#2ecc71" />
          <MetricCard title="MAE" value={result.metrics.test.MAE} color="#3498db" />
          <MetricCard title="RMSE" value={result.metrics.test.RMSE} color="#e67e22" />
        </div>
      </section>

      {scatterData && (
        <ChartCard title="Actual vs Predicted Scores">
          <Scatter data={scatterData} options={{
            scales: {
              x: { title: { display: true, text: 'Actual Score' } },
              y: { title: { display: true, text: 'Predicted Score' } }
            }
          }} />
        </ChartCard>
      )}

      <section className="section">
        <h2>Predict Your Score</h2>
        <div className="form-grid">
          {Object.keys(formData).map(key => (
            <div className="form-group" key={key}>
              <label>{key.replace(/_/g, ' ')}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={handlePredict}>
          Predict Score
        </button>
        {prediction !== null && (
          <div className="prediction-result">
            <h3>Predicted Exam Score: {prediction}</h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default Regression;