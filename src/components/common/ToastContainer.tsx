import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%'
    }}>
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let color = '#34d399';
        let borderColor = 'rgba(16, 185, 129, 0.3)';

        if (toast.type === 'info') {
          Icon = Info;
          color = '#60a5fa';
          borderColor = 'rgba(59, 130, 246, 0.3)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          color = '#fbbf24';
          borderColor = 'rgba(245, 158, 11, 0.3)';
        } else if (toast.type === 'danger') {
          Icon = XCircle;
          color = '#f87171';
          borderColor = 'rgba(239, 68, 68, 0.3)';
        }

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              background: 'rgba(20, 22, 26, 0.95)',
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              color: 'var(--text-primary)'
            }}
          >
            <Icon size={18} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{toast.title}</div>
              {toast.message && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
