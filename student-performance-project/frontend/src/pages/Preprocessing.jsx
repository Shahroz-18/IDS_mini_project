import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricCard from '../components/MetricCard';

const API_URL = 'http://localhost:5000/api';

const Preprocessing = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/preprocessing/report`)
      .then(res => {
        setReport(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading preprocessing report...</div>;
  if (!report) return <div className="error">Failed to load report</div>;

  return (
    <div className="page">
      <h1>Data Preprocessing</h1>

      <section className="section">
        <h2>Before vs After Cleaning</h2>
        <div className="comparison-grid">
          <div className="comparison-card">
            <h3>Before</h3>
            <p>Rows: {report.before.shape[0]}</p>
            <p>Columns: {report.before.shape[1]}</p>
            <p>Missing Values: {report.before.missing_total}</p>
            <p>Duplicates: {report.before.duplicates}</p>
          </div>
          <div className="comparison-arrow">→</div>
          <div className="comparison-card">
            <h3>After</h3>
            <p>Rows: {report.after.shape[0]}</p>
            <p>Columns: {report.after.shape[1]}</p>
            <p>Missing Values: {report.after.missing_total}</p>
            <p>Duplicates: {report.after.duplicates}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Missing Value Handling</h2>
        <table className="data-table">
          <thead>
            <tr><th>Column</th><th>Missing Count</th><th>Strategy</th></tr>
          </thead>
          <tbody>
            {Object.entries(report.missing_details).map(([col, count]) => (
              <tr key={col}>
                <td>{col}</td>
                <td>{count}</td>
                <td>Mode Imputation</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Transformations Applied</h2>
        <div className="metrics-row">
          <MetricCard 
            title="Categorical Columns Encoded" 
            value={report.encoding_applied} 
            color="#9b59b6" 
          />
          <MetricCard 
            title="Numerical Columns Scaled" 
            value={report.scaling_applied} 
            color="#e67e22" 
          />
        </div>
        <ul className="info-list">
          <li>Label Encoding for categorical features (preserves for tree-based models)</li>
          <li>StandardScaler for numerical features (mean=0, std=1)</li>
          <li>Pass/Fail target created: Exam_Score ≥ 70</li>
          <li>Invalid values fixed: negative attendance, out-of-range Exam_Score</li>
        </ul>
      </section>
    </div>
  );
};

export default Preprocessing;