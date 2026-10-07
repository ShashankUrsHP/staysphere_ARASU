import { apiClient } from './client';

export interface RoomTypeDTO {
  id: string;
  hotel_id: string;
  name: string;
  description: string;
  capacity: number;
  base_price: number;
  size_sqft: number;
  bed_type: string;
  amenities: string[];
  images: string[];
}

export interface RoomDTO {
  id: string;
  hotel_id: string;
  room_type_id: string;
  room_number: string;
  floor: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'RESERVED' | 'OUT_OF_SERVICE';
  current_guest_id?: string;
  room_type?: RoomTypeDTO;
}

export interface AvailableRoomTypeDTO {
  room_type: RoomTypeDTO;
  total_inventory: number;
  available_count: number;
  price_per_night: number;
}

export const fetchRoomTypesApi = async (): Promise<RoomTypeDTO[]> => {
  const res = await apiClient.get<RoomTypeDTO[]>('/rooms/types');
  return res.data;
};

export const fetchRoomsApi = async (status?: string): Promise<RoomDTO[]> => {
  const params = status ? { status } : {};
  const res = await apiClient.get<RoomDTO[]>('/rooms', { params });
  return res.data;
};

export const checkRoomAvailabilityApi = async (params: {
  check_in: string;
  check_out: string;
  adults?: number;
  children?: number;
}): Promise<AvailableRoomTypeDTO[]> => {
  const res = await apiClient.get<AvailableRoomTypeDTO[]>('/rooms/availability', { params });
  return res.data;
};

export const updateRoomStatusApi = async (roomId: string, status: string): Promise<RoomDTO> => {
  const res = await apiClient.put<RoomDTO>(`/rooms/${roomId}/status`, { status });
  return res.data;
};
