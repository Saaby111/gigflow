import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Navbar() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">GigFlow</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {user ? (
          <>
            <Link to="/browse" className="nav-link">Browse Gigs</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            
          
            <span className="ml-2" style={{ color: '#95a5a6' }}>
              Hello, {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register">
              <button className="btn btn-success">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;