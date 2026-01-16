import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Villabatteri CRM</h1>
        </div>
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">Dashboard</Link>
          <Link to="/leads" className="navbar-item">Leads</Link>
        </div>
        <div className="navbar-user">
          <span className="user-name">
            {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logga ut
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
