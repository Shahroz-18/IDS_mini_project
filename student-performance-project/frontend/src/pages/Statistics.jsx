import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricCard from '../components/MetricCard';

const API_URL = 'http://localhost:5000/api';

const Statistics = () => {
  const [descriptive, setDescriptive] = useState(null);
  const [ttest, setTtest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/statistics/descriptive`),
      axios.get(`${API_URL}/statistics/ttest`)
    ])
      .then(([descRes, ttestRes]) => {
        setDescriptive(descRes.data);
        setTtest(ttestRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading statistics...</div>;

  return (
    <div className="page">
      <h1>Statistical Analysis</h1>

      {descriptive && (
        <section className="section">
          <h2>Descriptive Statistics</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Variance</th>
                <th>Std Dev</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(descriptive).map(([col, stats]) => (
                <tr key={col}>
                  <td>{col}</td>
                  <td>{stats.mean}</td>
                  <td>{stats.median}</td>
                  <td>{stats.variance}</td>
                  <td>{stats.std}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {ttest && (
        <section className="section">
          <h2>Hypothesis Testing (T-Test)</h2>
          <div className="hypothesis-box">
            <p><strong>H0:</strong> {ttest.hypothesis.H0}</p>
            <p><strong>H1:</strong> {ttest.hypothesis.H1}</p>
          </div>

          <div className="metrics-row">
            <MetricCard title="T-Statistic" value={ttest.t_statistic} color="#3498db" />
            <MetricCard title="P-Value" value={ttest.p_value} color={ttest.significant ? '#2ecc71' : '#e74c3c'} />
          </div>

          <div className={`conclusion-box ${ttest.significant ? 'success' : 'neutral'}`}>
            <h4>Conclusion</h4>
            <p>{ttest.conclusion}</p>
            <p className="small">Significance level: α = 0.05</p>
          </div>

          <h3>Group Statistics</h3>
          <table className="data-table">
            <thead>
              <tr><th>Group</th><th>N</th><th>Mean</th><th>Std Dev</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>High Study Time</td>
                <td>{ttest.groups.high_study.n}</td>
                <td>{ttest.groups.high_study.mean}</td>
                <td>{ttest.groups.high_study.std}</td>
              </tr>
              <tr>
                <td>Low Study Time</td>
                <td>{ttest.groups.low_study.n}</td>
                <td>{ttest.groups.low_study.mean}</td>
                <td>{ttest.groups.low_study.std}</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default Statistics;