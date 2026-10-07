import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Calendar, Users, MapPin, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, setSearchParams } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [destination, setDestination] = useState('StaySphere Grand Bengaluru');
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(threeDaysLater);
  const [adults, setAdults] = useState(2);
  const [childrenCount] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      checkIn,
      checkOut,
      adults,
      children: childrenCount
    });
    setCurrentView('room_discovery');
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px 80px 24px',
      overflow: 'hidden',
      marginTop: '-80px'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.65) contrast(1.05)'
      }} />

      {/* Cinematic Dark Gradient Layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: 'radial-gradient(circle at 50% 40%, rgba(11, 12, 14, 0.4) 0%, rgba(11, 12, 14, 0.85) 80%, rgba(11, 12, 14, 1) 100%)'
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1080px',
        textAlign: 'center',
        marginTop: '90px'
      }}>
        {/* Small Tagline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(197, 160, 89, 0.12)',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          marginBottom: '24px',
          backdropFilter: 'blur(8px)'
        }}>
          <Sparkles size={13} color="var(--accent-gold)" />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase'
          }}>
            STAYSPHERE GRAND BENGALURU • LUXURY RESIDENCES
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif" style={{
          fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
          lineHeight: 1.08,
          fontWeight: 500,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '24px',
          textShadow: '0 4px 30px rgba(0,0,0,0.8)'
        }}>
          STAY<br />
          <span className="gold-gradient-text">SOMEWHERE</span><br />
          UNFORGETTABLE.
        </h1>

        {/* Supporting Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '580px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6,
          fontWeight: 300
        }}>
          Real-time AI-powered hotel booking, automated guest concierge & luxury living in Indiranagar, Bengaluru.
        </p>

        {/* SEARCH PANEL */}
        <form 
          onSubmit={handleSearch}
          className="glass-card"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr)) auto',
            gap: '16px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-card), 0 0 30px rgba(0,0,0,0.6)',
            border: '1px solid var(--border-medium)',
            textAlign: 'left'
          }}
        >
          {/* Field 1: Where */}
          <div style={searchFieldBox}>
            <span style={searchLabelStyle}>HOTEL PROPERTY</span>
            <div style={inputContainerStyle}>
              <MapPin size={16} color="var(--accent-gold)" />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={inlineInputStyle}
                placeholder="StaySphere Grand Bengaluru"
              />
            </div>
          </div>

          {/* Field 2: Check-in */}
          <div style={searchFieldBox}>
            <span style={searchLabelStyle}>CHECK-IN</span>
            <div style={inputContainerStyle}>
              <Calendar size={16} color="var(--accent-gold)" />
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={inlineInputStyle}
              />
            </div>
          </div>

          {/* Field 3: Check-out */}
          <div style={searchFieldBox}>
            <span style={searchLabelStyle}>CHECK-OUT</span>
            <div style={inputContainerStyle}>
              <Calendar size={16} color="var(--accent-gold)" />
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={inlineInputStyle}
              />
            </div>
          </div>

          {/* Field 4: Guests */}
          <div style={searchFieldBox}>
            <span style={searchLabelStyle}>GUESTS</span>
            <div style={inputContainerStyle}>
              <Users size={16} color="var(--accent-gold)" />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                style={{ ...inlineInputStyle, cursor: 'pointer' }}
              >
                <option value={1} style={optionStyle}>1 Adult</option>
                <option value={2} style={optionStyle}>2 Adults</option>
                <option value={3} style={optionStyle}>3 Adults</option>
                <option value={4} style={optionStyle}>4 Adults</option>
              </select>
            </div>
          </div>

          {/* Search CTA */}
          <button 
            type="submit"
            className="btn-gold"
            style={{
              padding: '16px 28px',
              borderRadius: 'var(--radius-lg)',
              height: '100%',
              fontSize: '0.95rem'
            }}
          >
            <Search size={18} />
            Search Availability
          </button>
        </form>
      </div>
    </section>
  );
};

const searchFieldBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '6px 12px',
  borderRight: '1px solid var(--border-subtle)'
};

const searchLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--accent-gold)',
  textTransform: 'uppercase'
};

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const inlineInputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontWeight: 500,
  width: '100%',
  fontFamily: 'var(--font-sans)'
};

const optionStyle: React.CSSProperties = {
  backgroundColor: '#121620',
  color: '#fff'
};
