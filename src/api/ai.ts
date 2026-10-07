import { apiClient } from './client';

export interface ConciergeChatResponseDTO {
  reply: string;
  intent_detected: string;
  confidence: number;
  action_taken?: {
    action_type: string;
    details: Record<string, any>;
    entity_id?: string;
  };
  suggested_actions?: string[];
}

export interface AIInsightDTO {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  metric: string;
  action_text: string;
  category: string;
}

export const chatConciergeApi = async (message: string, room_number?: string): Promise<ConciergeChatResponseDTO> => {
  const res = await apiClient.post<ConciergeChatResponseDTO>('/ai/concierge', { message, room_number });
  return res.data;
};

export const fetchAIInsightsApi = async (): Promise<AIInsightDTO[]> => {
  const res = await apiClient.get<AIInsightDTO[]>('/ai/insights');
  return res.data;
};

export const fetchPricingRecommendationApi = async (params: {
  base_price?: number;
  occupancy_rate?: number;
  lead_days?: number;
}): Promise<any> => {
  const res = await apiClient.get('/ml/pricing-recommendation', { params });
  return res.data;
};
