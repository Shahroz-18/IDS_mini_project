import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { path: '/', label: '🏠 Home' },
  { path: '/dataset', label: '📊 Dataset' },
  { path: '/preprocessing', label: '🔧 Preprocessing' },
  { path: '/eda', label: '📈 EDA' },
  { path: '/statistics', label: '📐 Statistics' },
  { path: '/regression', label: '📉 Regression' },
  { path: '/classification', label: '🎯 Classification' },
  { path: '/clustering', label: '🔵 Clustering' },
  { path: '/pca', label: '🧬 PCA' },
  { path: '/study-path', label: '🗺️ Study Path (A*)' },
  { path: '/about', label: 'ℹ️ About' }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;