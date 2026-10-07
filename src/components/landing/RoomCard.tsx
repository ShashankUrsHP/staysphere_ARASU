import React, { useState } from 'react';
import type { Room } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, Maximize2, Users, Bed, Star, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { setSelectedRoom, setShowRoomDetailModal, startBookingForRoom } = useApp();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleOpenDetail = () => {
    setSelectedRoom(room);
    setShowRoomDetailModal(true);
  };

  return (
    <div 
      className="glass-card card-hover-effect"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Room Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
        <img 
          src={room.image} 
          alt={room.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="room-img-hover"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11, 12, 14, 0.9) 0%, transparent 60%)'
        }} />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(11, 12, 14, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isFavorite ? '#ef4444' : 'var(--text-primary)',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span className="badge-gold">
            {room.category}
          </span>
          <div style={{
            background: 'rgba(11, 12, 14, 0.7)',
            backdropFilter: 'blur(6px)',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Star size={12} fill="#e5c158" color="#e5c158" />
            {room.rating} ({room.reviewCount})
          </div>
        </div>
      </div>

      {/* Room Details Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {room.name}
          </h3>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            {room.tagline}
          </p>

          {/* Key Features Line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-tertiary)',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bed size={14} color="var(--accent-gold)" /> {room.bedType}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="var(--accent-gold)" /> {room.maxGuests} Guests
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Maximize2 size={14} color="var(--accent-gold)" /> {room.sizeSqFt} sq.ft.
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
              Starting From
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{room.pricePerNight.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}> / night</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleOpenDetail}
              className="btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              Details
            </button>

            <button 
              onClick={() => startBookingForRoom(room)}
              className="btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              Book
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
