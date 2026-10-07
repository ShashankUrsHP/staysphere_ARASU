import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchRoomsApi, updateRoomStatusApi, type RoomDTO } from '../../api/rooms';
import { ShieldCheck, UserCheck, Sparkles, Wrench, Calendar, Loader2 } from 'lucide-react';

export const RoomStatusBoard: React.FC = () => {
  const { addToast, refetchTrigger } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await fetchRoomsApi();
      setRooms(data);
    } catch (err) {
      console.error('Failed loading room status board', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [refetchTrigger]);

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await updateRoomStatusApi(roomId, newStatus);
      addToast('success', 'Room Status Updated', `Room status changed to ${newStatus}`);
      loadRooms();
    } catch (err) {
      addToast('danger', 'Update Failed', 'Failed to update room status on backend');
    }
  };

  const filteredRooms = filterStatus === 'ALL'
    ? rooms
    : rooms.filter((r) => r.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', icon: <ShieldCheck size={14} />, label: 'AVAILABLE' };
      case 'OCCUPIED':
        return { color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)', icon: <UserCheck size={14} />, label: 'OCCUPIED' };
      case 'CLEANING':
        return { color: '#e5c158', bg: 'rgba(229, 193, 88, 0.15)', icon: <Sparkles size={14} />, label: 'CLEANING' };
      case 'MAINTENANCE':
        return { color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', icon: <Wrench size={14} />, label: 'MAINTENANCE' };
      case 'RESERVED':
      default:
        return { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', icon: <Calendar size={14} />, label: status };
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '40px auto 80px auto', padding: '0 24px' }}>
      {/* Board Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
        <div>
          <span className="badge-gold">REAL-TIME INVENTORY • STAYSPHERE GRAND BENGALURU</span>
          <h1 className="font-serif" style={{ fontSize: '2.4rem', marginTop: '6px' }}>
            Visual Room Status Board (50 Rooms)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Live status of all hotel room units across 5 floors, active guest occupancy, and cleaning states.
          </p>
        </div>

        {/* Status Legend & Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE', 'RESERVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: filterStatus === st ? 600 : 400,
                background: filterStatus === st ? 'var(--accent-gold)' : 'var(--bg-surface)',
                color: filterStatus === st ? '#0b0c0e' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#d4af37' }} />
          <p>Fetching 50 operational room statuses from FastAPI backend...</p>
        </div>
      ) : (
        /* ROOM GRID */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {filteredRooms.map((room) => {
            const badge = getStatusBadge(room.status);

            return (
              <div
                key={room.id}
                className="glass-card card-hover-effect"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${badge.color}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ROOM {room.room_number}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Floor {room.floor}</span>
                    </div>

                    <span style={{
                      background: badge.bg,
                      color: badge.color,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: `1px solid ${badge.color}40`
                    }}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {room.room_type?.name || 'Deluxe Room'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {room.room_type?.bed_type || 'King Bed'} • {room.room_type?.size_sqft || 420} sq.ft. • ₹{(room.room_type?.base_price || 7500).toLocaleString('en-IN')}/night
                  </p>
                </div>

                {/* Status Switcher Selector */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px' }}>
                    CHANGE ROOM STATUS
                  </span>
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value)}
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="CLEANING">CLEANING</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
