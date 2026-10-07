import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Bed, 
  Compass, 
  ClipboardList, 
  User, 
  Bot, 
  Key, 
  Sparkles, 
  Bell, 
  Utensils
} from 'lucide-react';

export const GuestMobileView: React.FC = () => {
  const { booking, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'stay' | 'explore' | 'requests' | 'profile'>('home');

  return (
    <div style={{
      maxWidth: '100%',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span className="badge-gold">NATIVE APP EXPERIENCE</span>
        <h2 className="font-serif" style={{ fontSize: '1.8rem', marginTop: '8px' }}>
          StaySphere Mobile Concierge
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Simulated iOS / Android luxury mobile application
        </p>
      </div>

      {/* PHONE MOCKUP CONTAINER */}
      <div style={{
        width: '380px',
        height: '760px',
        borderRadius: '44px',
        background: '#090a0c',
        border: '10px solid #22262e',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(197, 160, 89, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Dynamic Notch / Status Bar */}
        <div style={{
          height: '32px',
          background: '#090a0c',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}>
          <span>9:41</span>
          <div style={{ width: '90px', height: '18px', background: '#1b1e23', borderRadius: '10px' }} />
          <span>100%</span>
        </div>

        {/* APP CONTENT AREA */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {activeTab === 'home' && (
            <>
              {/* Top Mobile Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.15em' }}>
                    STAYSPHERE RESORT
                  </span>
                  <h3 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                    Suite 304 Keycard
                  </h3>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <Bell size={16} color="var(--accent-gold)" />
                </div>
              </div>

              {/* Digital Room Key NFC Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2a2e37 0%, #16181b 100%)',
                border: '1px solid var(--border-accent)',
                borderRadius: '20px',
                padding: '20px',
                color: 'var(--text-primary)',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>ROOM NUMBER</span>
                    <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--accent-gold-light)' }}>304</h2>
                  </div>
                  <Sparkles size={24} color="var(--accent-gold)" />
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{booking.room?.name || 'DELUXE KING'}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>NFC Digital Key Active</div>
                  </div>
                  <button style={{
                    background: 'var(--accent-gold)',
                    border: 'none',
                    color: '#0b0c0e',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Key size={12} /> Tap to Unlock
                  </button>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={() => setCurrentView('restaurant')}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Utensils size={20} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order Food</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>25 min room service</div>
                </button>

                <button 
                  onClick={() => setCurrentView('ai_concierge')}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Bot size={20} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ask Concierge</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>AI Instant Assistant</div>
                </button>
              </div>

              {/* Active Mobile Requests Status */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  ACTIVE SERVICE TRACKER
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Housekeeping Service</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Staff #14 is on the way</div>
                  </div>
                  <span className="badge-gold" style={{ fontSize: '0.65rem' }}>In Progress</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'stay' && (
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Your Stay Info</h3>
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', fontSize: '0.85rem' }}>
                <p><strong>Dates:</strong> 24 Sep → 27 Sep</p>
                <p style={{ marginTop: '6px' }}><strong>Guest:</strong> {booking.guestName}</p>
                <p style={{ marginTop: '6px' }}><strong>Ref:</strong> #{booking.bookingRef}</p>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Resort Experiences</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Infinity Pool • Thermal Spa • Fine Dining</p>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '12px' }}>My Requests</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Housekeeping (In Progress), Room Service (Preparing)</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Guest Profile</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{booking.guestEmail}</p>
            </div>
          )}
        </div>

        {/* FLOATING AI CONCIERGE BUTTON */}
        <button
          onClick={() => setCurrentView('ai_concierge')}
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '20px',
            background: 'linear-gradient(135deg, #d4af37, #c5a059)',
            color: '#0b0c0e',
            border: 'none',
            borderRadius: '30px',
            padding: '10px 16px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 8px 20px rgba(197, 160, 89, 0.4)',
            cursor: 'pointer'
          }}
        >
          <Bot size={16} /> AI Concierge
        </button>

        {/* BOTTOM NAVIGATION BAR */}
        <div style={{
          height: '60px',
          background: '#121418',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 8px'
        }}>
          {[
            { id: 'home', label: 'Home', icon: <Home size={18} /> },
            { id: 'stay', label: 'Stay', icon: <Bed size={18} /> },
            { id: 'explore', label: 'Explore', icon: <Compass size={18} /> },
            { id: 'requests', label: 'Requests', icon: <ClipboardList size={18} /> },
            { id: 'profile', label: 'Profile', icon: <User size={18} /> },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id as any)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === nav.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.65rem'
              }}
            >
              {nav.icon}
              {nav.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
