import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiChevronDown, 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiCalendar,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import logo from './logo.png'

export default function Header({ onMenuToggle }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/dashboard/${user.role}`;
  };

  return (
    <header className="header" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <img src={logo} alt='logo' style={{height:'40px',width:'40px',objectFit:'contain'}}></img>
              </div>
              <span className="brand-text" style={{ fontStyle: 'normal', letterSpacing: '-0.02em', fontWeight: 800 }}>
                CampusConnect
              </span>
            </div>
          </Link>

          {/* User Actions */}
          <div className="header-actions">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggle}
              className="btn btn-ghost"
              style={{
                width: '38px',
                height: '38px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {!isAuthenticated ? (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                <Link to="/signup" className="btn btn-primary">Get Started</Link>
              </div>
            ) : (
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <div className="user-avatar" style={{ flexShrink: 0 }}>
                    <FiUser />
                  </div>
                  <span className="user-name">{user?.name || user?.email}</span>
                  <FiChevronDown className={`dropdown-icon ${isProfileOpen ? 'open' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="user-avatar large">
                        <FiUser />
                      </div>
                      <div>
                        <div className="user-name">{user?.name || 'User'}</div>
                        <div className="user-email">{user?.email}</div>
                        <div className="user-role">{user?.role}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link 
                      to={`/dashboard/${user?.role}/profile`} 
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser /> Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button 
              className="mobile-menu-toggle"
              onClick={() => {
                if (onMenuToggle) {
                  onMenuToggle();
                } else {
                  setIsMenuOpen(!isMenuOpen);
                }
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                <FiHome /> Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiBook /> Dashboard
                  </Link>
                  {user?.role === 'student' && (
                    <>
                      <Link 
                        to="/dashboard/student/clubs" 
                        className="mobile-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUsers /> Clubs
                      </Link>
                    </>
                  )}
                  <Link 
                    to={`/dashboard/${user?.role}/profile`} 
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser /> Profile
                  </Link>
                  <button 
                    className="mobile-nav-link logout" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
