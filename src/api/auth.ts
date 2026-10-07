import { apiClient } from './client';

export interface UserDTO {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'GUEST' | 'STAFF' | 'ADMIN';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserDTO;
}

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (data: { full_name: string; email: string; password: string; phone?: string; role?: string }): Promise<UserDTO> => {
  const response = await apiClient.post<UserDTO>('/auth/register', data);
  return response.data;
};

export const getMeApi = async (): Promise<UserDTO> => {
  const response = await apiClient.get<UserDTO>('/auth/me');
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
