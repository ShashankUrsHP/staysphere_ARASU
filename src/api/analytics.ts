import { apiClient } from './client';

export interface AnalyticsSummaryDTO {
  occupancy_rate: number;
  today_revenue: number;
  active_bookings: number;
  available_rooms: number;
  occupied_rooms: number;
  cleaning_rooms: number;
  maintenance_rooms: number;
  check_ins_today: number;
  check_outs_today: number;
  adr: number;
  revpar: number;
}

export interface AnalyticsDashboardDTO {
  summary: AnalyticsSummaryDTO;
  monthly_trends: { month: string; revenue: number; occupancy: number; bookings: number }[];
  booking_sources: { source: string; count: number; percentage: number }[];
  room_performance: { room_type: string; occupancy: number; revenue: number; adr: number }[];
}

export const fetchDashboardAnalyticsApi = async (): Promise<AnalyticsDashboardDTO> => {
  const res = await apiClient.get<AnalyticsDashboardDTO>('/analytics/dashboard');
  return res.data;
};
