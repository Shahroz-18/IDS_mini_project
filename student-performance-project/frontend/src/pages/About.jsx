import React from 'react';

const About = () => {
  return (
    <div className="page">
      <h1>About Project</h1>

      <section className="section">
        <h2>Project Title</h2>
        <p>Student Performance Analysis and Prediction using Machine Learning</p>
      </section>

      <section className="section">
        <h2>Course</h2>
        <p>Intelligent Data Systems-I Laboratory (IT5PC_LR2)</p>
      </section>

      <section className="section">
        <h2>Team Members</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="avatar">👤</div>
            <h4>Team Member 1</h4>
            <p>Roll Number</p>
          </div>
          <div className="team-member">
            <div className="avatar">👤</div>
            <h4>Team Member 2</h4>
            <p>Roll Number</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Technologies Used</h2>
        <ul className="tech-list">
          <li><strong>Backend:</strong> Python, Flask, Scikit-learn, Pandas, NumPy, SciPy</li>
          <li><strong>Frontend:</strong> React (Vite), Chart.js, Axios, React Router</li>
          <li><strong>ML Algorithms:</strong> Linear Regression, Logistic Regression, K-Means, PCA</li>
          <li><strong>Search Algorithm:</strong> A* (A-Star)</li>
        </ul>
      </section>

      <section className="section">
        <h2>Dataset Source</h2>
        <p>
          Student Performance Factors by lainguyn123 on Kaggle<br />
          <a href="https://www.kaggle.com/datasets/lainguyn123/student-performance-factors" 
             target="_blank" rel="noreferrer">
            View Dataset on Kaggle
          </a>
        </p>
      </section>

      <section className="section">
        <h2>Conclusion</h2>
        <p>
          This project successfully demonstrates the integration of Experiments 1-9 
          into a single cohesive application. From data preprocessing and EDA to 
          advanced ML techniques including regression, classification, clustering, 
          PCA, and A* path optimization, the project provides a comprehensive 
          learning experience in Intelligent Data Systems.
        </p>
        <p>
          The web application makes the results accessible and interactive, allowing 
          users to explore the data, make predictions, and visualize insights in 
          real-time.
        </p>
      </section>
    </div>
  );
};

export default About;