import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Bed, Users, Maximize2, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export const RoomDetailModal: React.FC = () => {
  const { selectedRoom, showRoomDetailModal, setShowRoomDetailModal, startBookingForRoom } = useApp();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!showRoomDetailModal || !selectedRoom) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(5, 6, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '960px',
        width: '100%',
        maxHeight: '90vh',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-card), 0 0 50px rgba(0,0,0,0.8)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setShowRoomDetailModal(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            background: 'rgba(11, 12, 14, 0.8)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--text-primary)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ overflowY: 'auto', padding: '0 0 32px 0' }}>
          {/* Main Image Gallery */}
          <div style={{ position: 'relative', height: '380px', width: '100%', background: '#000' }}>
            <img 
              src={selectedRoom.gallery[activeImgIndex] || selectedRoom.image} 
              alt={selectedRoom.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-surface) 0%, transparent 40%)'
            }} />

            {/* Gallery Thumbnails Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '24px',
              display: 'flex',
              gap: '10px'
            }}>
              {selectedRoom.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  style={{
                    width: '64px',
                    height: '44px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: activeImgIndex === idx ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    opacity: activeImgIndex === idx ? 1 : 0.6,
                    padding: 0
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Details Body */}
          <div style={{ padding: '32px 32px 0 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {selectedRoom.category} • FLOOR {selectedRoom.floor}
                </span>
                <h2 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
                  {selectedRoom.name}
                </h2>
                <p style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginTop: '4px' }}>
                  {selectedRoom.tagline}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
                  Rate per night
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{selectedRoom.pricePerNight.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> + taxes</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              background: 'var(--bg-secondary)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '32px'
            }}>
              <div style={specItemStyle}>
                <Maximize2 size={18} color="var(--accent-gold)" />
                <div>
                  <div style={specLabelStyle}>ROOM SIZE</div>
                  <div style={specValueStyle}>{selectedRoom.sizeSqFt} sq.ft.</div>
                </div>
              </div>

              <div style={specItemStyle}>
                <Bed size={18} color="var(--accent-gold)" />
                <div>
                  <div style={specLabelStyle}>BEDDING</div>
                  <div style={specValueStyle}>{selectedRoom.bedType}</div>
                </div>
              </div>

              <div style={specItemStyle}>
                <Users size={18} color="var(--accent-gold)" />
                <div>
                  <div style={specLabelStyle}>CAPACITY</div>
                  <div style={specValueStyle}>Up to {selectedRoom.maxGuests} Guests</div>
                </div>
              </div>

              <div style={specItemStyle}>
                <Compass size={18} color="var(--accent-gold)" />
                <div>
                  <div style={specLabelStyle}>VIEW TYPE</div>
                  <div style={specValueStyle}>{selectedRoom.viewType}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '10px' }}>
                OVERVIEW
              </h4>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {selectedRoom.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '16px' }}>
                INCLUDED AMENITIES
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                {selectedRoom.amenities.map((amenity, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)'
                  }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'rgba(197, 160, 89, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} color="var(--accent-gold)" />
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Action Footer inside Modal */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-medium)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <ShieldCheck size={18} color="var(--status-success)" />
                Best rate guaranteed & free cancellation up to 48 hours prior.
              </div>

              <button
                onClick={() => {
                  setShowRoomDetailModal(false);
                  startBookingForRoom(selectedRoom);
                }}
                className="btn-gold"
                style={{ padding: '14px 32px', fontSize: '0.95rem' }}
              >
                Reserve Your Stay
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const specItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const specLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--text-tertiary)',
  letterSpacing: '0.1em',
  fontWeight: 600
};

const specValueStyle: React.CSSProperties = {
  fontSize: '0.88rem',
  fontWeight: 500,
  color: 'var(--text-primary)'
};
