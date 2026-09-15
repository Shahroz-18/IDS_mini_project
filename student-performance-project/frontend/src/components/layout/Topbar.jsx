/**
 * Layout Topbar Component.
 * Displays page title / breadcrumbs, mobile drawer toggle, theme toggle,
 * and user profile indicator.
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, User, ChevronRight } from 'lucide-react';

const ROUTE_NAMES = {
  '/': 'Home & Overview',
  '/dataset': 'Dataset Exploration',
  '/preprocessing': 'Data Preprocessing',
  '/eda': 'Exploratory Data Analysis',
  '/statistics': 'Statistical Analysis',
  '/regression': 'Score Regression',
  '/classification': 'Pass/Fail Classification',
  '/clustering': 'Student Clustering',
  '/pca': 'Dimensionality Reduction (PCA)',
  '/study-path': 'Optimal Study Path (A*)',
  '/about': 'About Mini-Project',
};

export default function Topbar({ onToggleMobile }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  const currentPageTitle = ROUTE_NAMES[location.pathname] || 'Dashboard';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Left: Mobile menu button + Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium">
          <span className="hidden sm:inline">Analytics</span>
          <ChevronRight size={14} className="hidden sm:inline text-slate-600" />
          <h2 className="text-sm md:text-base font-semibold text-slate-100 tracking-tight">
            {currentPageTitle}
          </h2>
        </div>
      </div>

      {/* Right: Theme Toggle & Avatar */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User / Student Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-500/20">
            <User size={16} />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-none">
              Student Lab
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
              IT5PC_LR2
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
