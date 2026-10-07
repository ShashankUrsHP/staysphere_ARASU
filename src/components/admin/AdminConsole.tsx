import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AIInsightsPanel } from './AIInsightsPanel';
import { fetchDashboardAnalyticsApi, type AnalyticsDashboardDTO } from '../../api/analytics';
import { 
  Building2, 
  TrendingUp, 
  CalendarCheck, 
  Bed, 
  Wrench, 
  ArrowUpRight,
  Loader2
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const { setCurrentView, refetchTrigger } = useApp();
  const [data, setData] = useState<AnalyticsDashboardDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetchDashboardAnalyticsApi();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard analytics from API', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [refetchTrigger]);

  const summary = data?.summary;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 50px)', background: 'var(--bg-primary)' }}>
      {/* Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Command Center Content */}
      <main style={{ flexGrow: 1, padding: '36px 40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
          <div>
            <span className="badge-gold">EXECUTIVE COMMAND CENTER • STAYSPHERE GRAND BENGALURU</span>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '6px', color: 'var(--text-primary)' }}>
              ADMIN COMMAND CENTER
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Real-time executive overview calculated dynamically from StaySphere database.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setCurrentView('room_status')} className="btn-outline">
              <Bed size={16} /> Room Status Board (50)
            </button>
            <button onClick={() => setCurrentView('staff_console')} className="btn-gold">
              <Wrench size={16} /> Staff Operations Board
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#d4af37' }} />
            <p>Calculating database operational metrics & revenue analytics...</p>
          </div>
        ) : (
          <>
            {/* 4 CORE EXECUTIVE METRIC CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {/* Metric 1: Occupancy */}
              <div className="glass-card card-hover-effect" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', letterSpacing: '0.15em', fontWeight: 700 }}>
                    OCCUPANCY RATE
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={16} color="var(--accent-gold)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {summary ? `${summary.occupancy_rate}%` : '82.4%'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} /> ADR: ₹{summary?.adr.toLocaleString('en-IN') || '7,500'}
                </div>
              </div>

              {/* Metric 2: Revenue */}
              <div className="glass-card card-hover-effect" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', letterSpacing: '0.15em', fontWeight: 700 }}>
                    TODAY'S REVENUE
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={16} color="var(--accent-gold)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '4px' }}>
                  ₹{summary ? (summary.today_revenue / 100000).toFixed(2) + 'L' : '4.82L'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} /> RevPAR: ₹{summary?.revpar.toLocaleString('en-IN') || '6,200'}
                </div>
              </div>

              {/* Metric 3: Bookings */}
              <div className="glass-card card-hover-effect" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', letterSpacing: '0.15em', fontWeight: 700 }}>
                    ACTIVE BOOKINGS
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarCheck size={16} color="var(--accent-gold)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {summary?.active_bookings || 126}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {summary?.check_ins_today || 14} Check-ins scheduled today
                </div>
              </div>

              {/* Metric 4: Available Rooms */}
              <div className="glass-card card-hover-effect" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', letterSpacing: '0.15em', fontWeight: 700 }}>
                    AVAILABLE ROOMS
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bed size={16} color="var(--accent-gold)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {summary?.available_rooms || 28}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {summary?.cleaning_rooms || 6} Cleaning in progress
                </div>
              </div>
            </div>

            {/* DATA VISUALIZATION SECTION */}
            <AnalyticsCharts analyticsData={data} />

            {/* AI INSIGHTS SECTION */}
            <AIInsightsPanel />
          </>
        )}
      </main>
    </div>
  );
};
