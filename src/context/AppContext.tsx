import React, { createContext, useContext, useState } from 'react';
import type { AppViewMode, Room, BookingDetails, MenuItem, CartItem, StaffTask, AIInsight, Toast } from '../types';
import { INITIAL_ROOMS, INITIAL_STAFF_TASKS, INITIAL_AI_INSIGHTS } from '../data/mockData';

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface AppContextType {
  currentView: AppViewMode;
  setCurrentView: (view: AppViewMode) => void;
  
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;

  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  showRoomDetailModal: boolean;
  setShowRoomDetailModal: (show: boolean) => void;

  booking: BookingDetails;
  setBooking: React.Dispatch<React.SetStateAction<BookingDetails>>;
  bookingStep: number;
  setBookingStep: (step: number) => void;
  startBookingForRoom: (room: Room) => void;

  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;

  tasks: StaffTask[];
  updateTaskStatus: (taskId: string, newStatus: StaffTask['status']) => void;
  updateRoomStatus: (roomId: string, newStatus: Room['status']) => void;

  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  aiInsights: AIInsight[];
  refetchTrigger: number;
  triggerRefetch: () => void;
}

const todayStr = new Date().toISOString().split('T')[0];
const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

const initialBooking: BookingDetails = {
  room: INITIAL_ROOMS[0],
  checkInDate: todayStr,
  checkOutDate: threeDaysLater,
  nights: 3,
  guests: 2,
  guestName: 'Shashank URS',
  guestEmail: 'guest@staysphere.com',
  guestPhone: '+91 98765 43210',
  specialRequests: 'High floor, extra feather pillows, quiet room.',
  paymentMethod: 'card',
  discountCode: 'LUXURY10',
  discountAmount: 3750,
  taxAmount: 6075,
  totalAmount: 39825,
  bookingRef: 'STY-10482',
  status: 'CONFIRMED'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppViewMode>('landing');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    checkIn: todayStr,
    checkOut: threeDaysLater,
    adults: 2,
    children: 0
  });

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(INITIAL_ROOMS[0]);
  const [showRoomDetailModal, setShowRoomDetailModal] = useState<boolean>(false);

  const [booking, setBooking] = useState<BookingDetails>(initialBooking);
  const [bookingStep, setBookingStep] = useState<number>(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [tasks, setTasks] = useState<StaffTask[]>(INITIAL_STAFF_TASKS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [aiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const triggerRefetch = () => setRefetchTrigger(prev => prev + 1);

  const addToast = (type: Toast['type'], title: string, message?: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const startBookingForRoom = (room: Room) => {
    const nights = Math.max(1, Math.round((new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) / 86400000));
    const basePrice = room.pricePerNight * nights;
    const discountAmount = Math.round(basePrice * 0.1);
    const taxAmount = Math.round((basePrice - discountAmount) * 0.18);
    const totalAmount = basePrice - discountAmount + taxAmount;

    setBooking((prev) => ({
      ...prev,
      room,
      checkInDate: searchParams.checkIn,
      checkOutDate: searchParams.checkOut,
      nights,
      discountAmount,
      taxAmount,
      totalAmount,
      bookingRef: 'STY-' + Math.floor(10000 + Math.random() * 90000)
    }));
    setSelectedRoom(room);
    setBookingStep(2);
    setCurrentView('booking_wizard');
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    addToast('success', `${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const updateTaskStatus = (taskId: string, newStatus: StaffTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    addToast('info', `Task status updated to ${newStatus.replace('_', ' ')}`);
  };

  const updateRoomStatus = (roomId: string, newStatus: Room['status']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    );
    addToast('success', `Room status updated to ${newStatus}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        searchParams,
        setSearchParams,
        rooms,
        selectedRoom,
        setSelectedRoom,
        showRoomDetailModal,
        setShowRoomDetailModal,
        booking,
        setBooking,
        bookingStep,
        setBookingStep,
        startBookingForRoom,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        tasks,
        updateTaskStatus,
        updateRoomStatus,
        toasts,
        addToast,
        removeToast,
        aiInsights,
        refetchTrigger,
        triggerRefetch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
