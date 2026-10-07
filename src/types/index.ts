export type AppViewMode = 
  | 'landing' 
  | 'room_discovery' 
  | 'room_detail' 
  | 'booking_wizard' 
  | 'guest_dashboard' 
  | 'guest_mobile' 
  | 'ai_concierge' 
  | 'restaurant' 
  | 'staff_console' 
  | 'room_status' 
  | 'admin_dashboard';

export type RoomCategory = 'All' | 'Suites' | 'Villas' | 'Rooms';

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  tagline: string;
  description: string;
  pricePerNight: number; // in INR ₹
  image: string;
  gallery: string[];
  sizeSqFt: number;
  bedType: string;
  maxGuests: number;
  viewType: string;
  rating: number;
  reviewCount: number;
  floor: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'RESERVED';
  amenities: string[];
}

export interface BookingDetails {
  room: Room | null;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'pay_at_hotel';
  discountCode: string;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  bookingRef?: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Drinks' | 'Desserts';
  description: string;
  price: number;
  image: string;
  dietary: ('Vegan' | 'Gluten-Free' | 'Chef Special' | 'Vegetarian')[];
  prepTime: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  instructions?: string;
}

export interface StaffTask {
  id: string;
  type: 'Housekeeping' | 'Maintenance' | 'Restaurant';
  roomNumber: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedStaff: string;
  createdAt: string;
  scheduledTime?: string;
}

export interface AIInsight {
  id: string;
  type: 'FORECAST' | 'DEMAND' | 'PRICING' | 'SERVICE';
  title: string;
  description: string;
  confidence: number;
  metric: string;
  actionText: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  title: string;
  message?: string;
}
