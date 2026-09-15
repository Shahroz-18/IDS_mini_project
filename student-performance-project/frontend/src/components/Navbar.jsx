import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎓 Student Performance Analytics
      </Link>
      <div className="navbar-links">
        <a href="http://localhost:5000/api/health" target="_blank" rel="noreferrer">
          Backend Status
        </a>
      </div>
    </nav>
  );
};

export default Navbar;