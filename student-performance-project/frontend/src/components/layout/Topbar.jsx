/**
 * Layout Topbar Component.
 * Displays page title / breadcrumbs and mobile drawer toggle.
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronRight } from 'lucide-react';

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
  const currentPageTitle = ROUTE_NAMES[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
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

      <div className="flex items-center gap-3" aria-hidden="true" />
    </header>
  );
}
