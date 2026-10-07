import { apiClient } from './client';

export interface GuestRequestDTO {
  id: string;
  guest_id: string;
  room_id?: string;
  booking_id?: string;
  request_type: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  room?: any;
}

export const fetchGuestRequestsApi = async (): Promise<GuestRequestDTO[]> => {
  const res = await apiClient.get<GuestRequestDTO[]>('/guest-requests');
  return res.data;
};

export const createGuestRequestApi = async (data: {
  request_type: string;
  description: string;
  priority?: string;
  room_number?: string;
}): Promise<GuestRequestDTO> => {
  const res = await apiClient.post<GuestRequestDTO>('/guest-requests', data);
  return res.data;
};

export const updateGuestRequestStatusApi = async (id: string, status: string): Promise<GuestRequestDTO> => {
  const res = await apiClient.put<GuestRequestDTO>(`/guest-requests/${id}/status`, { status });
  return res.data;
};
