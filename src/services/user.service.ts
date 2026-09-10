import api from './api';

export interface UserData {
    name: string;
    mobile: string;
    email?: string;
    role: string;
    shopname: string;
    aadharcard: string;
    pancard: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    scheme_id: number;
    bankname?: string;
    accountnumber?: string;
    ifsccode?: string;
}

export const userService = {
    getUsers: async (role?: string) => {
        const response = await api.get(`/users${role ? `?role=${encodeURIComponent(role)}` : ''}`);
        return response.data;
    },

    createUser: async (userData: UserData) => {
        const response = await api.post('/users/create-account', userData);
        return response.data;
    }
};
