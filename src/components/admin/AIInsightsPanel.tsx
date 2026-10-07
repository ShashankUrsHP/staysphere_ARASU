import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchAIInsightsApi, fetchPricingRecommendationApi, type AIInsightDTO } from '../../api/ai';
import { Bot, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export const AIInsightsPanel: React.FC = () => {
  const { addToast } = useApp();
  const [insights, setInsights] = useState<AIInsightDTO[]>([]);
  const [pricingModel, setPricingModel] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAiData = async () => {
      setLoading(true);
      try {
        const [ins, priceRec] = await Promise.all([
          fetchAIInsightsApi().catch(() => []),
          fetchPricingRecommendationApi({ base_price: 12500, occupancy_rate: 85, lead_days: 5 }).catch(() => null)
        ]);
        setInsights(ins);
        setPricingModel(priceRec);
      } catch (err) {
        console.error('Failed to load AI insights', err);
      } finally {
        setLoading(false);
      }
    };

    loadAiData();
  }, []);

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37, #c5a059)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Bot size={18} color="#0b0c0e" />
        </div>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          AI & ML Operations Insights
        </h3>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px auto', color: '#d4af37' }} />
          Loading AI insights and ML pricing recommendation...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {/* ML Pricing Recommendation Card */}
          {pricingModel && (
            <div
              className="glass-card card-hover-effect"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(20, 22, 26, 0.95) 100%)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge-gold" style={{ fontSize: '0.68rem' }}>
                    ML PRICING MODEL • RECOMMENDATION ONLY
                  </span>

                  <span style={{ fontSize: '0.78rem', color: '#d4af37', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Confidence: {Math.round(pricingModel.model_confidence * 100)}%
                  </span>
                </div>

                <h4 className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Dynamic ADR Optimization (Executive King)
                </h4>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {pricingModel.rationale}
                </p>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
                  Current ADR: <strong style={{ color: '#fff' }}>₹{pricingModel.current_adr.toLocaleString('en-IN')}</strong> → Recommended: <strong style={{ color: '#d4af37', fontSize: '1.05rem' }}>₹{pricingModel.recommended_adr.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => addToast('success', 'Price Recommendation Approved', `Rate updated to ₹${pricingModel.recommended_adr.toLocaleString('en-IN')}`)}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  Approve Price Adjustment <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* AI Operational Insights Cards */}
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="glass-card card-hover-effect"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(27, 30, 35, 0.8) 0%, rgba(20, 22, 26, 0.95) 100%)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge-gold" style={{ fontSize: '0.68rem' }}>
                    {insight.type} SIGNAL • {insight.category}
                  </span>

                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Confidence: {Math.round(insight.confidence * 100)}%
                  </span>
                </div>

                <h4 className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {insight.title}
                </h4>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {insight.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
                  Key Signal: <strong style={{ color: 'var(--text-primary)' }}>{insight.metric}</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => addToast('info', `AI Recommendation Applied`, `Executed action for ${insight.title}`)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  {insight.action_text} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
