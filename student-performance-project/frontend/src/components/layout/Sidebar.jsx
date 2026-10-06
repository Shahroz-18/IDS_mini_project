/**
 * Layout Sidebar Component.
 * Fixed left navigation bar with framer-motion layoutId active pill,
 * lucide-react icons, responsive mobile drawer.
 *
 * Header is aligned to a fixed 64px height so its bottom border
 * sits flush with the top app bar's bottom border (uniform look).
 * Nav scrollbar is hidden for a clean, chrome-free look.
 * Overlay uses a dark tint only (no backdrop-blur) for smooth 60fps.
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Database, Filter, BarChart3, Sigma, TrendingUp, Target, Boxes, Layers, Route, Info, GraduationCap, X,
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

const COLLAPSED_W = 72;
const EXPANDED_W = 256;
export const SIDEBAR_HEADER_H = 64;

// Tween is cheaper than spring — no continuous physics recalc during animation
const SIDEBAR_TRANSITION = {
  type: 'tween',
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1], // material easing — snappy start, soft landing
};

const OVERLAY_TRANSITION = { duration: 0.15 };

// Tailwind utility to hide scrollbars across all browsers
const HIDE_SCROLLBAR =
  '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const closeMobile = () => setMobileOpen?.(false);

  const sidebarContent = (expanded) => (
    <div className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none overflow-hidden ${HIDE_SCROLLBAR}`}>
      {/* Brand Header — locked to SIDEBAR_HEADER_H */}
      <div
        className="relative flex items-center border-b border-slate-800 shrink-0"
        style={{ height: SIDEBAR_HEADER_H }}
      >
        <div className="absolute left-0 top-0 h-full w-[72px] flex items-center justify-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <GraduationCap size={18} />
          </div>
        </div>

        <div
          className={`pl-[68px] pr-3 min-w-0 transition-opacity duration-200 ${
            expanded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h1 className="text-sm font-bold tracking-tight text-white leading-tight whitespace-nowrap">
            EduPredict ML
          </h1>
          <p className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
            Experiments 1–9 Suite
          </p>
        </div>

        {mobileOpen && expanded && (
          <button
            onClick={closeMobile}
            className="md:hidden ml-auto mr-3 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav list — scrollbar hidden */}
      <nav className={`flex-1 py-3 space-y-1 overflow-y-auto ${HIDE_SCROLLBAR}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `relative flex items-center h-11 text-sm font-medium transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute top-0 bottom-0 left-2 right-2 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-500/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center w-[72px] shrink-0">
                    <Icon size={20} />
                  </span>

                  <span
                    className={`relative z-10 whitespace-nowrap pr-3 transition-opacity duration-200 ${
                      expanded ? 'opacity-100 delay-100' : 'opacity-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop overlay — dark tint only (no blur = no lag) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_TRANSITION}
            className="fixed inset-0 z-30 bg-slate-950/50 hidden md:block"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        initial={false}
        animate={{ width: isExpanded ? EXPANDED_W : COLLAPSED_W }}
        transition={SIDEBAR_TRANSITION}
        className={`fixed top-0 left-0 bottom-0 z-40 hidden md:flex flex-col overflow-hidden will-change-[width] ${HIDE_SCROLLBAR}`}
      >
        {sidebarContent(isExpanded)}
      </motion.aside>

      {/* Mobile drawer — solid tint backdrop, no blur */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70"
            onClick={closeMobile}
          />
          <div
            className={`relative w-[260px] max-w-[80vw] h-full z-10 shadow-2xl bg-slate-900 ${HIDE_SCROLLBAR}`}
          >
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}