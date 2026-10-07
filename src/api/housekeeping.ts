import { apiClient } from './client';

export interface HousekeepingTaskDTO {
  id: string;
  room_id: string;
  assigned_staff_id?: string;
  task_type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  description?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  room?: any;
  assigned_staff?: any;
}

export const fetchHousekeepingTasksApi = async (): Promise<HousekeepingTaskDTO[]> => {
  const res = await apiClient.get<HousekeepingTaskDTO[]>('/housekeeping');
  return res.data;
};

export const updateHousekeepingStatusApi = async (id: string, status: string): Promise<HousekeepingTaskDTO> => {
  const res = await apiClient.put<HousekeepingTaskDTO>(`/housekeeping/${id}/status`, { status });
  return res.data;
};
