// src/components/Navbar.jsx — Matches screenshot design: K8 left, nav center, Login right
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services-page' },
    { label: 'Success', href: '/success-page' },
    { label: 'Contact', href: '/contact-page' },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.5)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '0 5%',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Logo — matches screenshot "K8" bold left */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: '700', fontSize: '1.6rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}>K8</span>
        </Link>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              style={{
                color: isActive(href) ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.92rem',
                fontWeight: isActive(href) ? '600' : '400',
                transition: 'color 0.2s',
                textDecoration: 'none',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = isActive(href) ? 'var(--text-primary)' : 'var(--text-secondary)'}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Login or dashboard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/dashboard')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px' }}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 24px',
                border: '2px solid var(--text-primary)',
                borderRadius: '50px',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontWeight: '600', fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
