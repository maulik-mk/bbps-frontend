import api from './api';

export interface Scheme {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SchemeCharge {
    category_id: number;
    category_name?: string;
    retailer_charge_type: 'flat' | 'percentage';
    retailer_charge: string | number;
    commission_type: 'flat' | 'percentage';
    md_comm: string | number;
    d_comm: string | number;
}

export const schemeService = {
    getSchemes: async () => {
        const response = await api.get('/schemes');
        return response.data;
    },

    createScheme: async (data: { name: string; status: string }) => {
        const response = await api.post('/schemes', data);
        return response.data;
    },

    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/schemes/${id}/status`, { status });
        return response.data;
    },

    getCharges: async (id: number, serviceId?: number) => {
        const url = serviceId ? `/schemes/${id}/charges?service_id=${serviceId}` : `/schemes/${id}/charges`;
        const response = await api.get(url);
        return response.data;
    },

    saveCharges: async (id: number, charges: SchemeCharge[]) => {
        const response = await api.post(`/schemes/${id}/charges`, { charges });
        return response.data;
    }
};
