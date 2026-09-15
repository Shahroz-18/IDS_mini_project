/**
 * Layout Sidebar Component.
 * Fixed 260px left navigation bar with framer-motion layoutId active pill,
 * lucide-react icons exclusively, responsive mobile overlay/drawer,
 * and student project footer.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Database,
  Filter,
  BarChart3,
  Sigma,
  TrendingUp,
  Target,
  Boxes,
  Layers,
  Route,
  Info,
  GraduationCap,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dataset', label: 'Dataset', icon: Database },
  { path: '/preprocessing', label: 'Preprocessing', icon: Filter },
  { path: '/eda', label: 'EDA', icon: BarChart3 },
  { path: '/statistics', label: 'Statistics', icon: Sigma },
  { path: '/regression', label: 'Regression', icon: TrendingUp },
  { path: '/classification', label: 'Classification', icon: Target },
  { path: '/clustering', label: 'Clustering', icon: Boxes },
  { path: '/pca', label: 'PCA', icon: Layers },
  { path: '/study-path', label: 'Study Path', icon: Route },
  { path: '/about', label: 'About', icon: Info },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
              EduPredict ML
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Experiments 1–9 Suite
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {mobileOpen && (
          <button
            onClick={closeMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-500/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    <Icon size={18} />
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="rounded-lg bg-slate-800/70 p-3 border border-slate-700/60">
          <p className="text-xs font-semibold text-slate-200">
            Mini-Project ID: IT5PC_LR2
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Student Performance ML
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-300">FastAPI / Flask Live</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 w-[260px] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
