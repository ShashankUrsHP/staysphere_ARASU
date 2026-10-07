import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
  const { addToast, setCurrentView } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleSelection, setRoleSelection] = useState<'GUEST' | 'STAFF' | 'ADMIN'>('GUEST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        const u = await login(email, password);
        addToast('success', `Welcome back, ${u.full_name}!`);
        if (u.role === 'ADMIN') setCurrentView('admin_dashboard');
        else if (u.role === 'STAFF') setCurrentView('staff_console');
        else setCurrentView('guest_dashboard');
      } else {
        const u = await register(fullName, email, password, roleSelection);
        addToast('success', `Account created! Welcome, ${u.full_name}.`);
        if (u.role === 'ADMIN') setCurrentView('admin_dashboard');
        else if (u.role === 'STAFF') setCurrentView('staff_console');
        else setCurrentView('guest_dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, role: 'GUEST' | 'STAFF' | 'ADMIN') => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const u = await login(demoEmail, 'Password123!');
      addToast('success', `Logged in as ${u.full_name} (${u.role})`);
      if (role === 'ADMIN') setCurrentView('admin_dashboard');
      else if (role === 'STAFF') setCurrentView('staff_console');
      else setCurrentView('guest_dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(10, 12, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '1.5rem'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#121620',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden',
            padding: '2.5rem 2rem'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#f8fafc',
              marginBottom: '0.5rem'
            }}>
              {authModalMode === 'login' ? 'Sign In to StaySphere' : 'Create an Account'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              StaySphere Grand Bengaluru Portal
            </p>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {authModalMode === 'register' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.4)' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.4)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.4)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.4rem' }}>
                  Register As
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {(['GUEST', 'STAFF', 'ADMIN'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleSelection(r)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: roleSelection === r ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.15)',
                        backgroundColor: roleSelection === r ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        color: roleSelection === r ? '#d4af37' : '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: '#d4af37',
                color: '#0a0c10',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? 'Authenticating...' : authModalMode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Quick Demo Accounts (1-Click Login)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('guest@staysphere.com', 'GUEST')}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>Guest Account</span>
                <span style={{ fontSize: '0.7rem', color: '#d4af37' }}>guest@staysphere.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('staff@staysphere.com', 'STAFF')}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>Staff Account</span>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>staff@staysphere.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@staysphere.com', 'ADMIN')}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>Admin Command Center</span>
                <span style={{ fontSize: '0.7rem', color: '#c084fc' }}>admin@staysphere.com</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              onClick={() => {
                setAuthModalMode(authModalMode === 'login' ? 'register' : 'login');
                setErrorMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {authModalMode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
