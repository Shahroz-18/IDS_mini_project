/**
 * Root Application Component.
 * Sets up React Router v6, AnimatePresence for smooth route transitions,
 * fixed responsive Sidebar, and Topbar layout structure.
 */
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
    <Routes location={location}>
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
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // ✅ FIXED: Removed NodeJS.Timeout type (plain JavaScript)
  const scrollTimeoutRef = useRef(null);

  // Scrollbar auto-hide logic
  useEffect(() => {
    const handleScroll = () => {
      // Add class to show scrollbar
      document.documentElement.classList.add('is-scrolling');
      
      // Clear previous timer
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Hide scrollbar 1 second after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-background text-foreground antialiased">
        {/* Fixed Sidebar (overlays on top of content) */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        {/* md:pl-[72px] leaves permanent room for the collapsed sidebar (72px wide) */}
        <div className="min-h-screen flex flex-col md:pl-[72px]">
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