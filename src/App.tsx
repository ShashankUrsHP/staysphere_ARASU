import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';
import { Hero } from './components/landing/Hero';
import { RoomDiscovery } from './components/landing/RoomDiscovery';
import { RoomDetailModal } from './components/booking/RoomDetailModal';
import { BookingWizard } from './components/booking/BookingWizard';
import { GuestDashboard } from './components/guest/GuestDashboard';
import { GuestMobileView } from './components/guest/GuestMobileView';
import { AIConcierge } from './components/guest/AIConcierge';
import { RestaurantView } from './components/restaurant/RestaurantView';
import { StaffConsole } from './components/staff/StaffConsole';
import { RoomStatusBoard } from './components/staff/RoomStatusBoard';
import { AdminConsole } from './components/admin/AdminConsole';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Engine Preview Switcher Bar */}
      <ViewSwitcher />

      {/* Admin console has its own integrated sidebar layout */}
      {currentView === 'admin_dashboard' ? (
        <AdminConsole />
      ) : (
        <>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            {currentView === 'landing' && (
              <>
                <Hero />
                <RoomDiscovery />
              </>
            )}
            {currentView === 'room_discovery' && <RoomDiscovery />}
            {currentView === 'booking_wizard' && <BookingWizard />}
            {currentView === 'guest_dashboard' && <GuestDashboard />}
            {currentView === 'guest_mobile' && <GuestMobileView />}
            {currentView === 'ai_concierge' && <AIConcierge />}
            {currentView === 'restaurant' && <RestaurantView />}
            {currentView === 'staff_console' && <StaffConsole />}
            {currentView === 'room_status' && <RoomStatusBoard />}
          </main>
          <Footer />
        </>
      )}

      {/* Global Modals & Notifications */}
      <RoomDetailModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
