import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { createBookingApi, fetchInvoiceApi, type InvoiceDTO } from '../../api/bookings';
import { 
  Check, 
  CreditCard, 
  QrCode, 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  Download,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const { booking, setBooking, bookingStep, setBookingStep, setCurrentView, addToast } = useApp();
  const { user } = useAuth();
  
  const [activePaymentTab, setActivePaymentTab] = useState<'card' | 'upi' | 'netbanking' | 'pay_at_hotel'>('card');
  const [upiId, setUpiId] = useState('shashank@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('•••');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceDTO | null>(null);

  const room = booking.room;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(3);
  };

  const handleCompleteReservation = async () => {
    setIsSubmitting(true);
    try {
      const created = await createBookingApi({
        hotel_id: 'hotel-bengaluru-001',
        room_type_id: room?.id || 'rt-deluxe-king',
        check_in_date: booking.checkInDate,
        check_out_date: booking.checkOutDate,
        adults: booking.guests,
        children: 0,
        special_requests: booking.specialRequests,
        discount_code: booking.discountCode,
        payment_method: activePaymentTab
      });

      setBooking((prev) => ({
        ...prev,
        bookingRef: created.booking_reference,
        baseAmount: created.base_amount,
        taxAmount: created.tax_amount,
        discountAmount: created.discount_amount,
        totalAmount: created.total_amount,
        status: 'CONFIRMED',
        paymentMethod: activePaymentTab
      }));

      // Fetch official backend invoice
      try {
        const inv = await fetchInvoiceApi(created.id);
        setInvoiceData(inv);
      } catch (err) {
        // Fallback invoice if needed
      }

      setBookingStep(4);
      addToast('success', 'Booking Confirmed!', `Reservation ${created.booking_reference} created successfully.`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to create booking. Please check availability.';
      addToast('danger', 'Booking Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto 80px auto', padding: '0 24px' }}>
      {/* STEP INDICATOR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        {[
          { num: '01', label: 'Room' },
          { num: '02', label: 'Details' },
          { num: '03', label: 'Payment' },
          { num: '04', label: 'Confirmation' }
        ].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = bookingStep === stepNum;
          const isCompleted = bookingStep > stepNum;

          return (
            <React.Fragment key={step.num}>
              <div 
                onClick={() => isCompleted && setBookingStep(stepNum)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: isCompleted ? 'pointer' : 'default',
                  opacity: isActive || isCompleted ? 1 : 0.4
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isCompleted 
                    ? 'var(--accent-gold)' 
                    : isActive 
                      ? 'rgba(197, 160, 89, 0.2)' 
                      : 'var(--bg-surface)',
                  border: isActive 
                    ? '2px solid var(--accent-gold)' 
                    : isCompleted 
                      ? '1px solid var(--accent-gold)' 
                      : '1px solid var(--border-subtle)',
                  color: isCompleted ? '#0b0c0e' : isActive ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  {isCompleted ? <Check size={18} /> : step.num}
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                  {step.label}
                </span>
              </div>
              {idx < 3 && (
                <div style={{
                  width: '40px',
                  height: '1px',
                  background: bookingStep > stepNum ? 'var(--accent-gold)' : 'var(--border-subtle)'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 4: CONFIRMATION PAGE */}
      {bookingStep === 4 ? (
        <div className="glass-card animate-fade-in" style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '48px 36px',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          border: '1px solid var(--border-accent)',
          boxShadow: 'var(--shadow-card), 0 0 40px rgba(197, 160, 89, 0.1)'
        }}>
          {/* Animated Gold Check */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #e5c158, #c5a059 70%, #9e7a33)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            boxShadow: '0 0 30px rgba(197, 160, 89, 0.4)'
          }}>
            <CheckCircle2 size={42} color="#0b0c0e" />
          </div>

          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            YOUR RESERVATION IS CONFIRMED
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            Booking Reference: <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>#{booking.bookingRef}</span>
          </p>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'left',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>PROPERTY</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>StaySphere Grand Bengaluru</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>SUITE TYPE</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{room?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>DATES</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.checkInDate} → {booking.checkOutDate} ({booking.nights} nights)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>GUEST NAME</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.full_name || booking.guestName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>TOTAL AMOUNT</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '1.1rem' }}>₹{booking.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentView('guest_dashboard')}
              className="btn-gold"
              style={{ padding: '14px 28px' }}
            >
              View My Stay
            </button>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="btn-outline"
              style={{ padding: '14px 24px' }}
            >
              <Download size={16} />
              Download Invoice
            </button>
          </div>
        </div>
      ) : (
        /* TWO COLUMN LAYOUT FOR STEPS 02 & 03 */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* LEFT COLUMN: FORM CONTENT */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
            {bookingStep === 2 && (
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Guest Information</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                  Please confirm guest information to personalize your stay experience.
                </p>

                <form onSubmit={handleNextToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>FULL NAME *</label>
                    <input 
                      type="text" 
                      required
                      value={booking.guestName}
                      onChange={(e) => setBooking({ ...booking, guestName: e.target.value })}
                      className="input-field" 
                      placeholder="e.g. Shashank URS"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>EMAIL ADDRESS *</label>
                      <input 
                        type="email" 
                        required
                        value={booking.guestEmail}
                        onChange={(e) => setBooking({ ...booking, guestEmail: e.target.value })}
                        className="input-field" 
                        placeholder="shashank@example.com"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>PHONE NUMBER *</label>
                      <input 
                        type="tel" 
                        required
                        value={booking.guestPhone}
                        onChange={(e) => setBooking({ ...booking, guestPhone: e.target.value })}
                        className="input-field" 
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>SPECIAL REQUESTS & CONCIERGE NOTES</label>
                    <textarea 
                      rows={3}
                      value={booking.specialRequests}
                      onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                      className="input-field" 
                      placeholder="High floor, pillow preferences, anniversary setup..."
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <button 
                      type="button"
                      onClick={() => setCurrentView('room_discovery')}
                      className="btn-outline"
                    >
                      <ArrowLeft size={16} /> Back to Rooms
                    </button>

                    <button type="submit" className="btn-gold">
                      Continue to Payment <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {bookingStep === 3 && (
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Payment Method</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                  Select your preferred payment option for StaySphere Grand Bengaluru.
                </p>

                {/* Payment Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={15} /> },
                    { id: 'upi', label: 'Instant UPI', icon: <QrCode size={15} /> },
                    { id: 'pay_at_hotel', label: 'Pay at Hotel', icon: <Building2 size={15} /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActivePaymentTab(tab.id as any)}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: activePaymentTab === tab.id ? 600 : 400,
                        background: activePaymentTab === tab.id ? 'var(--accent-gold)' : 'var(--bg-surface)',
                        color: activePaymentTab === tab.id ? '#0b0c0e' : 'var(--text-secondary)',
                        border: activePaymentTab === tab.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activePaymentTab === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>CARD NUMBER (DEMO SECURE PAYMENT)</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input-field" 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>EXPIRY</label>
                        <input 
                          type="text" 
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CVC / CVV</label>
                        <input 
                          type="password" 
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activePaymentTab === 'upi' && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Enter your UPI VPA handle for instant payment mandate:
                    </p>
                    <input 
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="input-field"
                      style={{ textAlign: 'center', maxWidth: '300px', margin: '0 auto' }}
                    />
                  </div>
                )}

                {activePaymentTab === 'pay_at_hotel' && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      🔒 Zero payment required now. Payment will be collected at check-in counter at StaySphere Grand Bengaluru.
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                  <button onClick={() => setBookingStep(2)} className="btn-outline">
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button 
                    onClick={handleCompleteReservation} 
                    disabled={isSubmitting}
                    className="btn-gold" 
                    style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing API Booking...
                      </>
                    ) : (
                      <>Complete Reservation ₹{booking.totalAmount.toLocaleString('en-IN')}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY STICKY PANEL */}
          <div className="glass-card" style={{
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            position: 'sticky',
            top: '100px',
            border: '1px solid var(--border-medium)'
          }}>
            <h4 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Your Stay Summary
            </h4>

            {room && (
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
                <img src={room.image} alt={room.name} style={{ width: '80px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <h5 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{room.name}</h5>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{room.bedType} • {room.sizeSqFt} sq.ft.</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '2px' }}>₹{room.pricePerNight.toLocaleString('en-IN')} / night</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Check-In</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{booking.checkInDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Check-Out</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{booking.checkOutDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Duration</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{booking.nights} Nights</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Base Rate ({booking.nights} nights)</span>
                <span>₹{(room ? room.pricePerNight * booking.nights : 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success)' }}>
                <span>Luxury Discount (10%)</span>
                <span>-₹{booking.discountAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST & Service Tax (18%)</span>
                <span>+₹{booking.taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{
                borderTop: '1px dashed var(--border-medium)',
                marginTop: '12px',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                <span>Grand Total</span>
                <span className="gold-gradient-text">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {showInvoiceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#fff',
            color: '#111',
            borderRadius: '12px',
            padding: '36px',
            maxWidth: '620px',
            width: '100%',
            fontFamily: 'sans-serif'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #111', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>STAYSPHERE</h2>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>StaySphere Grand Bengaluru • Tax Invoice</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <p>Invoice #: {invoiceData?.invoice_number || `INV-${booking.bookingRef}`}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              <p><strong>Guest Name:</strong> {invoiceData?.guest_name || booking.guestName}</p>
              <p><strong>Guest Email:</strong> {invoiceData?.guest_email || booking.guestEmail}</p>
              <p><strong>Suite:</strong> {room?.name}</p>
              <p><strong>Check-in:</strong> {booking.checkInDate} | <strong>Check-out:</strong> {booking.checkOutDate}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Description</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Accommodation ({booking.nights} nights)</td>
                  <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>₹{(invoiceData?.base_amount || (room ? room.pricePerNight * booking.nights : 0)).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Luxury Promotional Discount</td>
                  <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>-₹{(invoiceData?.discount_amount || booking.discountAmount).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>GST & Hospitality Cess (18%)</td>
                  <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>+₹{(invoiceData?.tax_amount || booking.taxAmount).toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ fontWeight: 800 }}>
                  <td style={{ padding: '8px' }}>Total Paid / Payable</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>₹{(invoiceData?.grand_total || booking.totalAmount).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  window.print();
                  setShowInvoiceModal(false);
                }}
                style={{ padding: '8px 20px', borderRadius: '6px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--text-tertiary)',
  marginBottom: '6px'
};
