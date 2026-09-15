import React, { useState } from 'react';
import axios from 'axios';
import MetricCard from '../components/MetricCard';

const API_URL = 'http://localhost:5000/api';

const StudyPath = () => {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startLevel, setStartLevel] = useState('Beginner');
  const [targetLevel, setTargetLevel] = useState('Exam_Ready');

  const handleFindPath = () => {
    setLoading(true);
    axios.post(`${API_URL}/astar/path`, { start_level: startLevel, target_level: targetLevel })
      .then(res => {
        setPath(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="page">
      <h1>A* Study Path Optimization</h1>

      <section className="section">
        <h2>Find Your Optimal Study Path</h2>
        <p className="section-description">
          Using A* search algorithm to find the most efficient path from your current 
          level to your target performance level.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label>Current Level</label>
            <select value={startLevel} onChange={e => setStartLevel(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Level</label>
            <select value={targetLevel} onChange={e => setTargetLevel(e.target.value)}>
              <option value="Exam_Ready">Exam Ready</option>
            </select>
          </div>
        </div>

        <button className="btn-primary" onClick={handleFindPath} disabled={loading}>
          {loading ? 'Finding Path...' : 'Find Optimal Path'}
        </button>
      </section>

      {path && (
        <>
          <section className="section">
            <h2>Recommended Study Path</h2>
            <div className="path-visualization">
              {path.path.map((node, idx) => (
                <React.Fragment key={idx}>
                  <div className="path-node">{node.replace(/_/g, ' ')}</div>
                  {idx < path.path.length - 1 && <div className="path-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>Path Cost Analysis</h2>
            <div className="metrics-row">
              <MetricCard title="Total Study Effort" value={path.total_cost} color="#e67e22" />
              <MetricCard title="Estimated Steps" value={path.path.length - 1} color="#3498db" />
            </div>
          </section>
        </>
      )}

      <section className="section">
        <h2>How A* Works Here</h2>
        <ul className="info-list">
          <li><strong>State:</strong> Current study topic/level</li>
          <li><strong>Nodes:</strong> Study topics (Fundamentals, Practice_Problems, Mock_Tests, etc.)</li>
          <li><strong>Edges:</strong> Transitions between topics with effort costs</li>
          <li><strong>Cost (g):</strong> Estimated study effort/time for each transition</li>
          <li><strong>Heuristic (h):</strong> Estimated remaining difficulty to reach Exam_Ready</li>
          <li><strong>f(n) = g(n) + h(n):</strong> Total estimated cost through node n</li>
        </ul>
      </section>
    </div>
  );
};

export default StudyPath;