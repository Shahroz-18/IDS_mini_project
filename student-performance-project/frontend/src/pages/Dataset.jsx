import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricCard from '../components/MetricCard';

const API_URL = 'http://localhost:5000/api';

const Dataset = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/dataset/info`)
      .then(res => {
        setInfo(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading dataset info...</div>;
  if (!info) return <div className="error">Failed to load dataset</div>;

  return (
    <div className="page">
      <h1>Dataset Overview</h1>
      
      <div className="metrics-row">
        <MetricCard title="Records" value={info.shape[0]} color="#3498db" />
        <MetricCard title="Features" value={info.shape[1]} color="#2ecc71" />
        <MetricCard 
          title="Missing Values" 
          value={Object.values(info.missing).reduce((a, b) => a + b, 0)} 
          color="#e74c3c" 
        />
      </div>

      <section className="section">
        <h2>Column Information</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Data Type</th>
              <th>Missing</th>
              <th>Missing %</th>
            </tr>
          </thead>
          <tbody>
            {info.columns.map(col => (
              <tr key={col}>
                <td>{col}</td>
                <td>{info.dtypes[col]}</td>
                <td>{info.missing[col]}</td>
                <td>{info.missing_percent[col]}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Sample Data (First 10 Rows)</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {info.columns.slice(0, 10).map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {info.sample.map((row, idx) => (
                <tr key={idx}>
                  {info.columns.slice(0, 10).map(col => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dataset;