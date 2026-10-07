import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchMenuItemsApi, placeRestaurantOrderApi, type MenuItemDTO } from '../../api/restaurant';
import { ShoppingBag, Clock, Plus, Trash2, Loader2 } from 'lucide-react';
import type { MenuItem } from '../../types';

export const RestaurantView: React.FC = () => {
  const { cart, addToCart, removeFromCart, cartTotal, clearCart, addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      try {
        const items = await fetchMenuItemsApi();
        setMenuItems(items);
      } catch (err) {
        console.error('Failed to load menu items', err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleCheckoutCart = async () => {
    setIsSubmittingOrder(true);
    try {
      const order = await placeRestaurantOrderApi({
        room_number: '304',
        items: cart.map((c) => ({
          menu_item_id: c.menuItem.id,
          quantity: c.quantity
        })),
        special_notes: 'Room service delivery to Suite 304'
      });

      addToast('success', 'Order Placed!', `In-room dining order ${order.order_reference} sent to kitchen. Estimated delivery: 25 mins.`);
      clearCart();
      setShowCartDrawer(false);
    } catch (err: any) {
      addToast('danger', 'Order Failed', err.response?.data?.detail || 'Failed to place order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const mappedItems: MenuItem[] = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: (item.category_name as any) || 'Dinner',
    description: item.description,
    price: item.price,
    image: item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    dietary: (item.dietary_flags as any) || ['Chef Special'],
    prepTime: `${item.prep_time_minutes} min`
  }));

  const filteredItems = activeCategory === 'All'
    ? mappedItems
    : mappedItems.filter((item) => item.category === activeCategory);

  return (
    <div style={{ maxWidth: '1320px', margin: '40px auto 80px auto', padding: '0 24px' }}>
      {/* Editorial Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
            EDITORIAL DINING • STAYSPHERE GRAND BENGALURU
          </span>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            The Culinary Residence
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '540px' }}>
            Michelin-inspired dishes and authentic Coorg roasts delivered directly to your suite or reserved at our oceanfront salon.
          </p>
        </div>

        {/* Floating Cart Trigger Button */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="btn-gold"
          style={{ padding: '12px 24px', borderRadius: '30px' }}
        >
          <ShoppingBag size={18} />
          Order Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)}) • ₹{cartTotal.toLocaleString('en-IN')}
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '40px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {['All', 'Breakfast', 'Dinner', 'Drinks', 'Desserts'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '10px 22px',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontWeight: activeCategory === cat ? 600 : 400,
              background: activeCategory === cat ? 'var(--accent-gold)' : 'var(--bg-surface)',
              color: activeCategory === cat ? '#0b0c0e' : 'var(--text-secondary)',
              border: activeCategory === cat ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#d4af37' }} />
          <p>Fetching menu from StaySphere kitchen API...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '32px'
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card card-hover-effect"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Item Image */}
                <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11, 12, 14, 0.8) 0%, transparent 50%)'
                  }} />

                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}>
                    {item.dietary.map((tag, idx) => (
                      <span key={idx} className="badge-gold" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    background: 'rgba(11,12,14,0.7)',
                    backdropFilter: 'blur(6px)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} /> {item.prepTime}
                  </div>
                </div>

                {/* Item Details */}
                <div style={{ padding: '20px' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Add Button */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  className="btn-gold"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  <Plus size={15} /> Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CART DRAWER SLIDE-OVER */}
      {showCartDrawer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div className="animate-fade-in" style={{
            maxWidth: '450px',
            width: '100%',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-medium)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Room Service Cart</h3>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>
                  <p>NO ORDERS YET</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>"Something delicious is waiting."</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.menuItem.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-surface)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{cartItem.menuItem.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                          {cartItem.quantity} x ₹{cartItem.menuItem.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(cartItem.menuItem.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
                  <span>Total Amount</span>
                  <span className="gold-gradient-text">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handleCheckoutCart}
                  disabled={isSubmittingOrder}
                  className="btn-gold"
                  style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isSubmittingOrder ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting Order to Kitchen...
                    </>
                  ) : (
                    'Confirm Room Service Order'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
