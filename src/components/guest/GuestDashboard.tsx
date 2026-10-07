import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { fetchGuestRequestsApi, type GuestRequestDTO } from '../../api/guestRequests';
import { fetchNotificationsApi, type NotificationDTO } from '../../api/notifications';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Wrench, 
  Bot, 
  FileText, 
  Clock, 
  Flame,
  Key,
  Bell,
  Loader2
} from 'lucide-react';

export const GuestDashboard: React.FC = () => {
  const { booking, setCurrentView } = useApp();
  const { user } = useAuth();

  const [requests, setRequests] = useState<GuestRequestDTO[]>([]);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadGuestData = async () => {
      setLoading(true);
      try {
        const [reqs, notifs] = await Promise.all([
          fetchGuestRequestsApi().catch(() => []),
          fetchNotificationsApi().catch(() => [])
        ]);
        setRequests(reqs);
        setNotifications(notifs);
      } catch (err) {
        console.error('Error loading guest dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadGuestData();
  }, []);

  const guestDisplayName = user?.full_name || booking.guestName;

  return (
    <div style={{ maxWidth: '1240px', margin: '40px auto 80px auto', padding: '0 24px' }}>
      {/* Header Greeting */}
      <div style={{ marginBottom: '36px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
          GUEST CONCIERGE PORTAL
        </span>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
          Welcome, {guestDisplayName.split(' ')[0]}.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Welcome to StaySphere Grand Bengaluru. We are at your elevated service.
        </p>
      </div>

      {/* ACTIVE RESERVATION BANNER */}
      <div className="glass-card card-hover-effect" style={{
        padding: '32px',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(27, 30, 35, 0.9) 0%, rgba(20, 22, 26, 0.95) 100%)',
        border: '1px solid var(--border-accent)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.2em', fontWeight: 700 }}>
              YOUR CURRENT STAY • STAYSPHERE GRAND BENGALURU
            </span>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              {booking.room?.name || 'EXECUTIVE KING'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                <Key size={16} color="var(--accent-gold)" /> ROOM 304
              </span>
              <span>•</span>
              <span>{booking.checkInDate} → {booking.checkOutDate} ({booking.nights} Nights)</span>
              <span>•</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 500 }}>{booking.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setCurrentView('ai_concierge')}
              className="btn-gold"
            >
              <Bot size={16} /> AI Concierge
            </button>
            <button 
              onClick={() => setCurrentView('booking_wizard')}
              className="btn-outline"
            >
              View Reservation
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div style={{ marginBottom: '48px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'Room Service', icon: <UtensilsCrossed size={22} color="var(--accent-gold)" />, view: 'restaurant' },
            { label: 'Housekeeping', icon: <Sparkles size={22} color="var(--accent-gold)" />, view: 'ai_concierge' },
            { label: 'Dining Menu', icon: <Flame size={22} color="var(--accent-gold)" />, view: 'restaurant' },
            { label: 'Maintenance', icon: <Wrench size={22} color="var(--accent-gold)" />, view: 'ai_concierge' },
            { label: 'AI Concierge', icon: <Bot size={22} color="var(--accent-gold)" />, view: 'ai_concierge' },
            { label: 'Invoice & Bill', icon: <FileText size={22} color="var(--accent-gold)" />, view: 'booking_wizard' }
          ].map((action, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentView(action.view as any)}
              className="glass-card card-hover-effect"
              style={{
                padding: '24px 16px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(197, 160, 89, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(197, 160, 89, 0.2)'
              }}>
                {action.icon}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {action.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMN LOWER SECTION: YOUR LIVE REQUESTS & NOTIFICATIONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '32px'
      }}>
        {/* YOUR REQUESTS */}
        <div className="glass-card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Live Service Requests
            </h3>
            <button
              onClick={() => setCurrentView('ai_concierge')}
              style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
            >
              + New Request
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px auto', color: '#d4af37' }} />
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              No active service requests. Ask AI Concierge anytime!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.slice(0, 4).map((req) => (
                <div key={req.id} style={{
                  background: 'var(--bg-secondary)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>
                      {req.request_type.replace('_', ' ')} - {req.description.slice(0, 36)}...
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <Clock size={12} /> {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="glass-card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Notifications & Alerts
          </h3>

          {notifications.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              No new notifications.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} style={{
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <Bell size={18} color="#d4af37" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{notif.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
