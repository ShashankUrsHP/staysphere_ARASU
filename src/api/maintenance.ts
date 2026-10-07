import { apiClient } from './client';

export interface MaintenanceRequestDTO {
  id: string;
  room_id: string;
  reported_by?: string;
  assigned_staff_id?: string;
  issue_type: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
  resolved_at?: string;
  room?: any;
}

export const fetchMaintenanceRequestsApi = async (): Promise<MaintenanceRequestDTO[]> => {
  const res = await apiClient.get<MaintenanceRequestDTO[]>('/maintenance');
  return res.data;
};

export const updateMaintenanceStatusApi = async (id: string, status: string): Promise<MaintenanceRequestDTO> => {
  const res = await apiClient.put<MaintenanceRequestDTO>(`/maintenance/${id}/status`, { status });
  return res.data;
};
