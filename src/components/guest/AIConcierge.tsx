import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { chatConciergeApi } from '../../api/ai';
import type { ChatMessage } from '../../types';
import { Bot, Send, Sparkles, User } from 'lucide-react';

export const AIConcierge: React.FC = () => {
  const { booking, setCurrentView, addToast, triggerRefetch } = useApp();
  const { user } = useAuth();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const guestName = user?.full_name || booking.guestName;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'concierge',
      text: `Good evening, ${guestName.split(' ')[0]}. I am your StaySphere AI Concierge at StaySphere Grand Bengaluru. How may I elevate your stay today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'I need housekeeping for room 304',
        'Air conditioning not cooling',
        'Order two bottles of water',
        'What time is checkout?',
        'Show my room service menu'
      ]
    }
  ]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Call real FastAPI AI Concierge API
      const response = await chatConciergeApi(query, "304");

      const botMsg: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        sender: 'concierge',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggested_actions || []
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.action_taken) {
        addToast('success', 'Action Dispatched', `${response.action_taken.action_type.replace(/_/g, ' ')}`);
        triggerRefetch();
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'concierge',
        text: 'I apologize, I experienced a brief connection hiccup. Please try again or contact the front desk.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Show my room service menu' || suggestion === 'Browse Restaurant Menu') {
      setCurrentView('restaurant');
    } else if (suggestion === 'Download Invoice' || suggestion === 'View Invoices') {
      setCurrentView('booking_wizard');
    } else {
      handleSend(suggestion);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto 80px auto', padding: '0 24px' }}>
      <div className="glass-card" style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border-accent)',
        boxShadow: 'var(--shadow-card), 0 0 40px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        height: '700px'
      }}>
        {/* CONCIERGE HEADER */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(20, 22, 26, 0.95) 0%, rgba(11, 12, 14, 0.98) 100%)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #c5a059)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(197, 160, 89, 0.3)'
            }}>
              <Bot size={22} color="#0b0c0e" />
            </div>
            <div>
              <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                STAYSPHERE CONCIERGE AI
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={12} /> Live FastAPI Intent Engine • Room 304
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            StaySphere Grand Bengaluru
          </div>
        </div>

        {/* MESSAGES BODY */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'var(--bg-primary)'
        }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                {!isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(197, 160, 89, 0.15)',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={16} color="var(--accent-gold)" />
                  </div>
                )}

                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    background: isUser 
                      ? 'linear-gradient(135deg, #d4af37 0%, #c5a059 100%)' 
                      : 'var(--bg-surface)',
                    color: isUser ? '#0b0c0e' : 'var(--text-primary)',
                    padding: '14px 20px',
                    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    fontWeight: isUser ? 500 : 400,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}>
                    {msg.text}
                  </div>

                  <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-tertiary)',
                    marginTop: '4px',
                    textAlign: isUser ? 'right' : 'left'
                  }}>
                    {msg.timestamp}
                  </div>

                  {/* SUGGESTED ACTIONS CHIPS */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '12px'
                    }}>
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(action)}
                          style={{
                            background: 'rgba(197, 160, 89, 0.1)',
                            border: '1px solid rgba(197, 160, 89, 0.25)',
                            color: 'var(--accent-gold-light)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          + {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={16} color="var(--text-primary)" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.82rem' }}>
              <Sparkles size={14} className="animate-spin" />
              Concierge is processing intent & database action...
            </div>
          )}
        </div>

        {/* INPUT FOOTER */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '16px 24px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 'I need housekeeping for room 304' or 'What time is checkout?'"
            className="input-field"
            style={{ borderRadius: '30px', paddingLeft: '20px' }}
          />

          <button
            type="submit"
            className="btn-gold"
            style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0 }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
