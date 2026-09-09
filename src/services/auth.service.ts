import api from './api';

export interface LoginPayload {
    mobile: string;
    password?: string;
}

export const authService = {
    login: async (data: LoginPayload) => {
        const response = await api.post('/auth/signin', data);
        return response.data;
    }
};
