/**
 * Root Application Component.
 * Sets up React Router v6, AnimatePresence for smooth route transitions,
 * fixed responsive Sidebar, and Topbar layout structure.
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Page Imports
import Home from './pages/Home';
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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-background text-foreground flex antialiased">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-16 md:peer-hover:pl-64 transition-all duration-300 ease-out">
          {/* Topbar */}
          <Topbar onToggleMobile={() => setMobileOpen((prev) => !prev)} />

          {/* Main Body */}
          <main className="flex-1 w-full max-w-[1280px] mx-auto p-6 md:p-8">
            <AnimatedRoutes />
          </main>
        </div>
      </div>
    </Router>
  );
}