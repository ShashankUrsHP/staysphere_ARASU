import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RoomCard } from './RoomCard';
import { checkRoomAvailabilityApi, type AvailableRoomTypeDTO } from '../../api/rooms';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Room } from '../../types';

export const RoomDiscovery: React.FC = () => {
  const { searchParams } = useApp();
  const [availableRooms, setAvailableRooms] = useState<AvailableRoomTypeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      try {
        const data = await checkRoomAvailabilityApi({
          check_in: searchParams.checkIn,
          check_out: searchParams.checkOut,
          adults: searchParams.adults,
          children: searchParams.children
        });
        setAvailableRooms(data);
      } catch (err) {
        console.error('Failed to load room availability from API', err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [searchParams]);

  // Convert DTOs to Room format for RoomCard rendering
  const mappedRooms: Room[] = availableRooms.map((item) => {
    const rt = item.room_type;
    const category: any = rt.name.includes('Suite') ? 'Suites' : rt.name.includes('Villa') ? 'Villas' : 'Rooms';
    return {
      id: rt.id,
      name: rt.name,
      category,
      tagline: `${item.available_count} of ${item.total_inventory} available for selected dates`,
      description: rt.description,
      pricePerNight: item.price_per_night,
      image: rt.images && rt.images.length > 0 ? rt.images[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
      gallery: rt.images || [],
      sizeSqFt: rt.size_sqft,
      bedType: rt.bed_type,
      maxGuests: rt.capacity,
      viewType: 'City Skyline & Garden View',
      rating: 4.9,
      reviewCount: 84,
      floor: 3,
      status: item.available_count > 0 ? 'AVAILABLE' : 'OCCUPIED',
      amenities: rt.amenities || []
    };
  });

  const filteredRooms = activeCategory === 'All'
    ? mappedRooms
    : mappedRooms.filter((r) => r.category === activeCategory);

  return (
    <section style={{ padding: '80px 24px', maxWidth: '1320px', margin: '0 auto' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-gold)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} /> LIVE INVENTORY • STAYSPHERE GRAND BENGALURU
        </div>
        <h2 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
          Discover Exceptional Sanctuaries
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '12px auto 0 auto', fontSize: '0.95rem' }}>
          Checking date overlap ({searchParams.checkIn} to {searchParams.checkOut}) against real database inventory.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        {['All', 'Suites', 'Villas', 'Rooms'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeCategory === cat 
                ? 'var(--accent-gold)' 
                : 'var(--bg-surface)',
              color: activeCategory === cat 
                ? '#0b0c0e' 
                : 'var(--text-secondary)',
              border: activeCategory === cat 
                ? '1px solid var(--accent-gold)' 
                : '1px solid var(--border-subtle)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255, 255, 255, 0.6)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#d4af37' }} />
          <p>Calculating real room inventory & dates availability...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '32px'
        }}>
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </section>
  );
};
