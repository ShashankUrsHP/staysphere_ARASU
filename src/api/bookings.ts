import { apiClient } from './client';

export interface BookingDTO {
  id: string;
  booking_reference: string;
  guest_id: string;
  hotel_id: string;
  room_id?: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  base_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  payment_status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  booking_source: string;
  special_requests?: string;
  created_at: string;
  room?: any;
  guest?: any;
}

export interface InvoiceDTO {
  invoice_number: string;
  booking_reference: string;
  guest_name: string;
  guest_email: string;
  hotel_name: string;
  room_number?: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  room_rate_per_night: number;
  base_amount: number;
  restaurant_charges: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  payment_status: string;
  created_at: string;
}

export const createBookingApi = async (data: {
  hotel_id: string;
  room_type_id: string;
  check_in_date: string;
  check_out_date: string;
  adults?: number;
  children?: number;
  special_requests?: string;
  discount_code?: string;
  payment_method?: string;
}): Promise<BookingDTO> => {
  const res = await apiClient.post<BookingDTO>('/bookings', data);
  return res.data;
};

export const fetchBookingsApi = async (status?: string): Promise<BookingDTO[]> => {
  const params = status ? { status } : {};
  const res = await apiClient.get<BookingDTO[]>('/bookings', { params });
  return res.data;
};

export const fetchBookingByIdApi = async (id: string): Promise<BookingDTO> => {
  const res = await apiClient.get<BookingDTO>(`/bookings/${id}`);
  return res.data;
};

export const cancelBookingApi = async (id: string): Promise<BookingDTO> => {
  const res = await apiClient.post<BookingDTO>(`/bookings/${id}/cancel`);
  return res.data;
};

export const checkInBookingApi = async (id: string): Promise<BookingDTO> => {
  const res = await apiClient.post<BookingDTO>(`/bookings/${id}/check-in`);
  return res.data;
};

export const checkOutBookingApi = async (id: string): Promise<BookingDTO> => {
  const res = await apiClient.post<BookingDTO>(`/bookings/${id}/check-out`);
  return res.data;
};

export const fetchInvoiceApi = async (id: string): Promise<InvoiceDTO> => {
  const res = await apiClient.get<InvoiceDTO>(`/bookings/${id}/invoice`);
  return res.data;
};
