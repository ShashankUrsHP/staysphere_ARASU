import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  Bed, 
  CalendarCheck, 
  Users, 
  UtensilsCrossed, 
  Wrench, 
  TrendingUp, 
  Bot, 
  User, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'admin_dashboard', label: 'Command Center', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'room_status', label: 'Rooms Inventory', icon: <Bed size={18} /> },
        { id: 'booking_wizard', label: 'Bookings Manager', icon: <CalendarCheck size={18} /> },
        { id: 'guest_dashboard', label: 'Guest Directory', icon: <Users size={18} /> },
      ]
    },
    {
      title: 'SERVICES',
      items: [
        { id: 'restaurant', label: 'Dining & Kitchen', icon: <UtensilsCrossed size={18} /> },
        { id: 'staff_console', label: 'Housekeeping & Maintenance', icon: <Wrench size={18} /> },
      ]
    },
    {
      title: 'ANALYTICS & AI',
      items: [
        { id: 'admin_dashboard', label: 'Revenue Analytics', icon: <TrendingUp size={18} /> },
        { id: 'ai_concierge', label: 'AI Intelligence', icon: <Bot size={18} /> },
      ]
    }
  ];

  return (
    <aside style={{
      width: isCollapsed ? '70px' : '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      position: 'relative',
      flexShrink: 0
    }}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          top: '28px',
          right: '-14px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          color: 'var(--text-primary)',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '36px',
          overflow: 'hidden',
          paddingLeft: '4px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #c5a059)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={18} color="#0b0c0e" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                STAYSPHERE
              </span>
              <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--accent-gold)', letterSpacing: '0.2em' }}>
                ADMIN CONSOLE
              </span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {menuSections.map((sec, idx) => (
            <div key={idx}>
              {!isCollapsed && (
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.15em', marginBottom: '10px' }}>
                  {sec.title}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sec.items.map((item, iIdx) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={iIdx}
                      onClick={() => setCurrentView(item.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: isActive ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                        color: isActive ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                        border: isActive ? '1px solid rgba(197, 160, 89, 0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 600 : 400,
                        transition: 'all 0.15s ease',
                        width: '100%',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.icon}
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Profile */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <User size={18} color="var(--accent-gold)" />
        </div>
        {!isCollapsed && (
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Alex Vance</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>General Manager</div>
          </div>
        )}
      </div>
    </aside>
  );
};
