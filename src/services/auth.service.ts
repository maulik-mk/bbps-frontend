import api from './api';

export interface LoginPayload {
  mobile: string;
  password?: string;
}

export interface SignupPayload {
  mobile: string;
  email?: string;
  password?: string;
  role?: string;
  created_by?: string;
}

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },
  
  signup: async (data: SignupPayload) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }
};
