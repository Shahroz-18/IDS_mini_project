import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricCard from '../components/MetricCard';

const API_URL = 'http://localhost:5000/api';

const Classification = () => {
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
    axios.get(`${API_URL}/classification/train`)
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
    axios.post(`${API_URL}/classification/predict`, formData)
      .then(res => setPrediction(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  if (loading) return <div className="loading">Training classification model...</div>;
  if (!result) return <div className="error">Failed to load classification results</div>;

  return (
    <div className="page">
      <h1>Classification - Pass/Fail Prediction</h1>

      <section className="section">
        <h2>Model Performance</h2>
        <div className="metrics-row">
          <MetricCard title="Accuracy" value={result.metrics.accuracy} color="#2ecc71" />
          <MetricCard title="Precision" value={result.metrics.precision} color="#3498db" />
          <MetricCard title="Recall" value={result.metrics.recall} color="#e67e22" />
          <MetricCard title="F1-Score" value={result.metrics.f1_score} color="#9b59b6" />
        </div>
      </section>

      <section className="section">
        <h2>Confusion Matrix</h2>
        <div className="confusion-matrix">
          <div className="cm-cell cm-header"></div>
          <div className="cm-cell cm-header">Predicted Fail</div>
          <div className="cm-cell cm-header">Predicted Pass</div>
          
          <div className="cm-cell cm-header">Actual Fail</div>
          <div className="cm-cell cm-tn">{result.confusion_matrix.tn}</div>
          <div className="cm-cell cm-fp">{result.confusion_matrix.fp}</div>
          
          <div className="cm-cell cm-header">Actual Pass</div>
          <div className="cm-cell cm-fn">{result.confusion_matrix.fn}</div>
          <div className="cm-cell cm-tp">{result.confusion_matrix.tp}</div>
        </div>
      </section>

      <section className="section">
        <h2>Predict Pass/Fail</h2>
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
          Predict Result
        </button>
        {prediction && (
          <div className={`prediction-result ${prediction.prediction === 'Pass' ? 'pass' : 'fail'}`}>
            <h3>Prediction: {prediction.prediction}</h3>
            <p>Confidence: {(Math.max(prediction.probability.pass, prediction.probability.fail) * 100).toFixed(1)}%</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Classification;