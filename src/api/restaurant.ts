import { apiClient } from './client';

export interface MenuItemDTO {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  dietary_flags: string[];
  prep_time_minutes: number;
  is_available: boolean;
}

export interface OrderItemDTO {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  instructions?: string;
  menu_item?: MenuItemDTO;
}

export interface RestaurantOrderDTO {
  id: string;
  order_reference: string;
  guest_id: string;
  room_number: string;
  total_amount: number;
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  special_notes?: string;
  created_at: string;
  items: OrderItemDTO[];
}

export const fetchMenuItemsApi = async (): Promise<MenuItemDTO[]> => {
  const res = await apiClient.get<MenuItemDTO[]>('/restaurant/menu');
  return res.data;
};

export const fetchRestaurantOrdersApi = async (): Promise<RestaurantOrderDTO[]> => {
  const res = await apiClient.get<RestaurantOrderDTO[]>('/restaurant/orders');
  return res.data;
};

export const placeRestaurantOrderApi = async (data: {
  room_number: string;
  items: { menu_item_id: string; quantity: number; instructions?: string }[];
  special_notes?: string;
}): Promise<RestaurantOrderDTO> => {
  const res = await apiClient.post<RestaurantOrderDTO>('/restaurant/orders', data);
  return res.data;
};

export const updateOrderStatusApi = async (id: string, status: string): Promise<RestaurantOrderDTO> => {
  const res = await apiClient.put<RestaurantOrderDTO>(`/restaurant/orders/${id}/status`, { status });
  return res.data;
};
