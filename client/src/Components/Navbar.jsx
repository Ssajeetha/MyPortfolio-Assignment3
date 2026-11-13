import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import auth from '../auth-helper'; // 👈 import auth helper

function Navbar() {
  const navigate = useNavigate();

  // Check if a user is currently logged in
  const jwt = auth.isAuthenticated();

  // Helper function for active link styles
  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#2563eb' : '#475569',
    fontWeight: isActive ? '600' : '500',
    fontSize: '15px',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 32px'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Custom Logo */}
        <Logo />

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <NavLink to="/" style={navLinkStyle} end>Home</NavLink>
          <NavLink to="/about" style={navLinkStyle}>About Me</NavLink>
          <NavLink to="/projects" style={navLinkStyle}>Projects</NavLink>
          <NavLink to="/education" style={navLinkStyle}>Education</NavLink>
          <NavLink to="/services" style={navLinkStyle}>Services</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact Me</NavLink>

          {/* Authentication Status Links */}
          {!jwt ? (
            // Shown when NOT logged in
            <>
              <NavLink to="/signin" style={navLinkStyle}>Sign In</NavLink>
              <NavLink
                to="/signup"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  padding: '8px 14px',
                  borderRadius: '6px'
                }}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            // Shown when LOGGED IN
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                Hi, <strong>{jwt.user.name}</strong>{' '}
                <span style={{
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: jwt.user.role === 'admin' ? '#fee2e2' : '#e0e7ff',
                  color: jwt.user.role === 'admin' ? '#b91c1c' : '#3730a3',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {jwt.user.role}
                </span>
              </span>

              <button
                onClick={() => {
                  auth.clearJWT(() => navigate('/'));
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;