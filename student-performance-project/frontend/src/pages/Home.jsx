import React from 'react';

const Home = () => {
  return (
    <div className="page">
      <div className="hero">
        <h1>Student Performance Analysis and Prediction</h1>
        <p className="subtitle">
          An Integrated Mini Project demonstrating Experiments 1-9 from 
          Intelligent Data Systems-I Laboratory (IT5PC_LR2)
        </p>
      </div>

      <section className="section">
        <h2>Problem Statement</h2>
        <p>
          Analyze factors affecting student performance and build predictive models 
          to identify at-risk students and recommend optimal study paths.
        </p>
      </section>

      <section className="section">
        <h2>Dataset</h2>
        <p>
          <strong>Student Performance Factors</strong> from Kaggle (lainguyn123)
        </p>
        <ul>
          <li>6,607 student records</li>
          <li>20 features (19 predictors + 1 target)</li>
          <li>Numerical: Hours_Studied, Attendance, Sleep_Hours, Previous_Scores, etc.</li>
          <li>Categorical: Parental_Involvement, School_Type, Gender, etc.</li>
          <li>Target: Exam_Score (regression), Pass/Fail (classification)</li>
        </ul>
      </section>

      <section className="section">
        <h2>Project Objectives</h2>
        <ol>
          <li>Perform comprehensive data preprocessing and cleaning</li>
          <li>Conduct exploratory data analysis with visualizations</li>
          <li>Implement A* search for study path optimization</li>
          <li>Perform statistical analysis and hypothesis testing</li>
          <li>Build Linear Regression for score prediction</li>
          <li>Build Classification model for Pass/Fail prediction</li>
          <li>Apply K-Means clustering for student segmentation</li>
          <li>Apply PCA for dimensionality reduction</li>
          <li>Deploy as an interactive web application</li>
        </ol>
      </section>

      <section className="section">
        <h2>Experiments Covered</h2>
        <div className="experiments-grid">
          <div className="experiment-card">
            <h4>Experiment 1</h4>
            <p>Python Libraries (NumPy, Pandas, Matplotlib, Scikit-learn)</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 2</h4>
            <p>Data Preprocessing and Cleaning</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 3</h4>
            <p>Exploratory Data Analysis</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 4</h4>
            <p>A* Search Algorithm</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 5</h4>
            <p>Statistical Analysis</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 6</h4>
            <p>Linear Regression</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 7</h4>
            <p>Classification</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 8</h4>
            <p>Clustering</p>
          </div>
          <div className="experiment-card">
            <h4>Experiment 9</h4>
            <p>PCA and Model Evaluation</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;