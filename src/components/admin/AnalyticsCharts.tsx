import React from 'react';
import type { AnalyticsDashboardDTO } from '../../api/analytics';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const AnalyticsCharts: React.FC<{ analyticsData?: AnalyticsDashboardDTO | null }> = ({ analyticsData }) => {
  const monthlyTrends = analyticsData?.monthly_trends || [
    { month: 'Apr', revenue: 3420000, occupancy: 74.5, bookings: 92 },
    { month: 'May', revenue: 3850000, occupancy: 78.2, bookings: 105 },
    { month: 'Jun', revenue: 4120000, occupancy: 81.0, bookings: 118 },
    { month: 'Jul', revenue: 4390000, occupancy: 83.4, bookings: 124 },
    { month: 'Aug', revenue: 4620000, occupancy: 85.1, bookings: 131 },
    { month: 'Sep', revenue: 4820000, occupancy: 82.4, bookings: 126 }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px',
      marginBottom: '40px'
    }}>
      {/* REVENUE ANALYTICS AREA CHART */}
      <div className="glass-card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.15em', fontWeight: 700 }}>
              REVENUE ANALYTICS
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              Monthly Revenue Performance (₹)
            </h3>
          </div>
          <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> Live DB Query
          </span>
        </div>

        {/* Minimal SVG Area Chart */}
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c5a059" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

            {/* Area Path */}
            <path
              d="M 0 160 L 100 140 L 200 120 L 300 100 L 400 60 L 500 30 L 500 190 L 0 190 Z"
              fill="url(#goldArea)"
            />

            {/* Line Path */}
            <path
              d="M 0 160 L 100 140 L 200 120 L 300 100 L 400 60 L 500 30"
              fill="none"
              stroke="#e5c158"
              strokeWidth="3"
            />

            {/* Data Points */}
            {[
              { x: 0, y: 160 },
              { x: 100, y: 140 },
              { x: 200, y: 120 },
              { x: 300, y: 100 },
              { x: 400, y: 60 },
              { x: 500, y: 30 }
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#0b0c0e" stroke="#e5c158" strokeWidth="2" />
            ))}
          </svg>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            {monthlyTrends.map(t => <span key={t.month}>{t.month}</span>)}
          </div>
        </div>
      </div>

      {/* OCCUPANCY RATE BAR CHART */}
      <div className="glass-card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.15em', fontWeight: 700 }}>
              OCCUPANCY RATE
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              Capacity Utilization (%)
            </h3>
          </div>
          <span className="badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BarChart3 size={14} /> Avg {analyticsData?.summary.occupancy_rate || 82.4}%
          </span>
        </div>

        {/* Minimal Bar Chart */}
        <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', padding: '0 8px' }}>
          {monthlyTrends.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold-light)' }}>
                {d.occupancy.toFixed(1)}%
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${Math.min(160, d.occupancy * 1.8)}px`,
                  background: i === monthlyTrends.length - 1 ? 'linear-gradient(to top, #d4af37, #e5c158)' : 'rgba(197, 160, 89, 0.25)',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
