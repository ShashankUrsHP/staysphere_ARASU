import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { AppViewMode } from '../../types';
import { 
  Sparkles, 
  Home, 
  BedDouble, 
  CalendarCheck, 
  User as UserIcon, 
  Smartphone, 
  Bot, 
  UtensilsCrossed, 
  ClipboardList, 
  Grid, 
  ShieldAlert, 
  ChevronDown,
  ChevronUp,
  LogIn
} from 'lucide-react';

export const ViewSwitcher: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const { user, role, setShowAuthModal, setAuthModalMode } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const views: { id: AppViewMode; label: string; icon: React.ReactNode; group: string }[] = [
    { id: 'landing', label: 'Landing Page', icon: <Home size={14} />, group: 'Public Experience' },
    { id: 'room_discovery', label: 'Room Discovery', icon: <BedDouble size={14} />, group: 'Public Experience' },
    { id: 'booking_wizard', label: 'Booking Wizard', icon: <CalendarCheck size={14} />, group: 'Public Experience' },
    
    { id: 'guest_dashboard', label: 'Guest Dashboard', icon: <UserIcon size={14} />, group: 'Guest Concierge' },
    { id: 'guest_mobile', label: 'Guest Mobile UI', icon: <Smartphone size={14} />, group: 'Guest Concierge' },
    { id: 'ai_concierge', label: 'AI Concierge Chat', icon: <Bot size={14} />, group: 'Guest Concierge' },
    { id: 'restaurant', label: 'Room Service Menu', icon: <UtensilsCrossed size={14} />, group: 'Guest Concierge' },

    { id: 'staff_console', label: 'Staff Console', icon: <ClipboardList size={14} />, group: 'Operations & Admin' },
    { id: 'room_status', label: 'Room Status Board', icon: <Grid size={14} />, group: 'Operations & Admin' },
    { id: 'admin_dashboard', label: 'Admin Command Center', icon: <ShieldAlert size={14} />, group: 'Operations & Admin' },
  ];

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 12, 14, 0.95)',
      borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '6px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #d4af37, #c5a059)',
            color: '#0b0c0e',
            borderRadius: '6px',
            padding: '4px 8px',
            fontWeight: 700,
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={12} /> STAYSPHERE ENGINE
          </div>

          {user ? (
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Active Session: <strong style={{ color: '#fff' }}>{user.full_name}</strong>
              <span style={{
                fontSize: '0.65rem',
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: role === 'ADMIN' ? 'rgba(192, 132, 252, 0.2)' : role === 'STAFF' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(212, 175, 55, 0.2)',
                color: role === 'ADMIN' ? '#c084fc' : role === 'STAFF' ? '#38bdf8' : '#d4af37',
                fontWeight: 700
              }}>
                {role}
              </span>
            </span>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <LogIn size={13} /> Sign in to test role capabilities
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isExpanded ? 'Hide Dev Module Bar' : 'Dev Module Selector'}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(16, 18, 22, 0.95)',
          padding: '10px 24px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'flex-start'
          }}>
            {views.map((v) => {
              const isActive = currentView === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setCurrentView(v.id)}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(197, 160, 89, 0.25) 0%, rgba(197, 160, 89, 0.1) 100%)' 
                      : 'var(--bg-surface)',
                    border: isActive 
                      ? '1px solid var(--accent-gold)' 
                      : '1px solid var(--border-subtle)',
                    color: isActive ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {v.icon}
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
