import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '64px 32px 32px 32px',
      marginTop: '80px'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '48px',
          marginBottom: '64px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37, #c5a059)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} color="#0b0c0e" />
              </div>
              <span className="font-serif" style={{ fontSize: '1.4rem', letterSpacing: '0.1em' }}>
                STAYSPHERE
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              A revolutionary luxury hospitality system merging cinematic guest comfort with intelligent digital concierges and real-time operations.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={awardTagStyle}>Forbes 5-Star 2026</span>
              <span style={awardTagStyle}>Michelin Key</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '18px', letterSpacing: '0.05em' }}>
              DISCOVER & BOOK
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button onClick={() => setCurrentView('room_discovery')} style={footerLinkStyle}>
                  Suites & Penthouse Collection
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('restaurant')} style={footerLinkStyle}>
                  Fine Dining & Room Service
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('ai_concierge')} style={footerLinkStyle}>
                  AI Personal Concierge
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('guest_dashboard')} style={footerLinkStyle}>
                  Guest Portal Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Operations & Admin Portal */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '18px', letterSpacing: '0.05em' }}>
              STAFF & MANAGEMENT
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button onClick={() => setCurrentView('staff_console')} style={footerLinkStyle}>
                  Staff Operations Console
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('room_status')} style={footerLinkStyle}>
                  Visual Room Grid Board
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin_dashboard')} style={footerLinkStyle}>
                  Admin Command Center
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('guest_mobile')} style={footerLinkStyle}>
                  Guest Mobile App Frame
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '18px', letterSpacing: '0.05em' }}>
              STAY IN TOUCH
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="var(--accent-gold)" /> 108 Sanctuary Blvd, Oceanside
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="var(--accent-gold)" /> +1 (800) STAY-SPHERE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="var(--accent-gold)" /> concierge@staysphere.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-tertiary)'
        }}>
          <div>© {new Date().getFullYear()} STAYSPHERE Luxury Hospitality SaaS. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const awardTagStyle: React.CSSProperties = {
  background: 'rgba(197, 160, 89, 0.1)',
  border: '1px solid rgba(197, 160, 89, 0.3)',
  color: 'var(--accent-gold-light)',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '0.72rem',
  fontWeight: 600
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  cursor: 'pointer',
  padding: 0,
  transition: 'color 0.2s ease',
  textAlign: 'left'
};
