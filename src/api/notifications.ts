import { apiClient } from './client';

export interface NotificationDTO {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const fetchNotificationsApi = async (): Promise<NotificationDTO[]> => {
  const res = await apiClient.get<NotificationDTO[]>('/notifications');
  return res.data;
};

export const markNotificationReadApi = async (id: string): Promise<NotificationDTO> => {
  const res = await apiClient.put<NotificationDTO>(`/notifications/${id}/read`);
  return res.data;
};
