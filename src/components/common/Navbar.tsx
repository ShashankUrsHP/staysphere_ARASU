import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Calendar, User as UserIcon, LogOut, Shield, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { setCurrentView } = useApp();
  const { user, role, logout, setShowAuthModal, setAuthModalMode } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      width: '100%',
      padding: isScrolled ? '12px 32px' : '20px 32px',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      background: isScrolled ? 'rgba(11, 12, 14, 0.94)' : 'rgba(11, 12, 14, 0.6)',
      backdropFilter: 'blur(16px)',
      borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)',
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* LOGO */}
        <div 
          onClick={() => setCurrentView('landing')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #e5c158, #c5a059 70%, #9e7a33)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(197, 160, 89, 0.3)'
          }}>
            <Sparkles size={18} color="#0b0c0e" />
          </div>
          <div>
            <span className="font-serif" style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: 'var(--text-primary)'
            }}>
              STAYSPHERE
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.62rem',
              letterSpacing: '0.25em',
              color: 'var(--accent-gold)',
              marginTop: '-4px'
            }}>
              GRAND BENGALURU
            </span>
          </div>
        </div>

        {/* DESKTOP LINKS */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button onClick={() => setCurrentView('landing')} style={linkStyle}>Discover</button>
          <button onClick={() => setCurrentView('room_discovery')} style={linkStyle}>Rooms & Suites</button>
          <button onClick={() => setCurrentView('restaurant')} style={linkStyle}>Dining</button>
          <button onClick={() => setCurrentView('ai_concierge')} style={linkStyle}>AI Concierge</button>
          
          {role === 'GUEST' && (
            <button onClick={() => setCurrentView('guest_dashboard')} style={linkStyle}>Guest Portal</button>
          )}
          {role === 'STAFF' && (
            <button onClick={() => setCurrentView('staff_console')} style={{ ...linkStyle, color: '#38bdf8', fontWeight: 600 }}>Staff Console</button>
          )}
          {role === 'ADMIN' && (
            <button onClick={() => setCurrentView('admin_dashboard')} style={{ ...linkStyle, color: '#c084fc', fontWeight: 600 }}>Admin Command Center</button>
          )}
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '24px',
                  padding: '6px 14px 6px 8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#d4af37',
                  color: '#0a0c10',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {user.full_name.charAt(0)}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.full_name.split(' ')[0]}</span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: role === 'ADMIN' ? 'rgba(192, 132, 252, 0.2)' : role === 'STAFF' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(212, 175, 55, 0.2)',
                  color: role === 'ADMIN' ? '#c084fc' : role === 'STAFF' ? '#38bdf8' : '#d4af37',
                  fontWeight: 700
                }}>
                  {role}
                </span>
                <ChevronDown size={14} color="rgba(255, 255, 255, 0.5)" />
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '220px',
                  backgroundColor: '#121620',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  padding: '8px',
                  zIndex: 100
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, margin: 0 }}>{user.full_name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (role === 'ADMIN') setCurrentView('admin_dashboard');
                      else if (role === 'STAFF') setCurrentView('staff_console');
                      else setCurrentView('guest_dashboard');
                    }}
                    style={dropdownItemStyle}
                  >
                    <Shield size={16} /> Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    style={{ ...dropdownItemStyle, color: '#fca5a5' }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <UserIcon size={15} />
              Sign In
            </button>
          )}
          
          <button 
            onClick={() => setCurrentView('room_discovery')}
            className="btn-gold"
            style={{ padding: '9px 20px', fontSize: '0.85rem' }}
          >
            <Calendar size={15} />
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
};

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  fontSize: '0.88rem',
  fontWeight: 400,
  letterSpacing: '0.03em',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  opacity: 0.88,
};

const dropdownItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  background: 'none',
  border: 'none',
  color: '#e2e8f0',
  fontSize: '0.85rem',
  cursor: 'pointer',
  borderRadius: '6px',
  textAlign: 'left'
};
