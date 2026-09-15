import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home.jsx';
import Dataset from './pages/Dataset';
import Preprocessing from './pages/Preprocessing';
import EDA from './pages/EDA';
import Statistics from './pages/Statistics';
import Regression from './pages/Regression';
import Classification from './pages/Classification';
import Clustering from './pages/Clustering';
import PCA from './pages/PCA';
import StudyPath from './pages/StudyPath';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-layout">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dataset" element={<Dataset />} />
              <Route path="/preprocessing" element={<Preprocessing />} />
              <Route path="/eda" element={<EDA />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/regression" element={<Regression />} />
              <Route path="/classification" element={<Classification />} />
              <Route path="/clustering" element={<Clustering />} />
              <Route path="/pca" element={<PCA />} />
              <Route path="/study-path" element={<StudyPath />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;