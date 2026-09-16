import api from './api';

export const reportService = {
    getTransactions: async (first?: number, limit: number = 10, type?: string, filters?: any) => {
        let url = `/reports/transactions?limit=${limit}`;
        if (first !== undefined) url += `&first=${first}`;
        if (type) url += `&type=${encodeURIComponent(type)}`;
        if (filters?.status) url += `&status=${encodeURIComponent(filters.status)}`;
        if (filters?.category) url += `&category=${encodeURIComponent(filters.category)}`;
        if (filters?.dateRange) url += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
        if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
        const response = await api.get(url);
        return response.data.data;
    },

    getLedger: async (first?: number, limit: number = 10, filters?: any) => {
        let url = `/reports/ledger?limit=${limit}`;
        if (first !== undefined) url += `&first=${first}`;
        if (filters?.dateRange) url += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
        if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
        const response = await api.get(url);
        return response.data.data;
    },

    getCommissionDistribution: async (first?: number, limit: number = 10, filters?: any) => {
        let url = `/reports/commissions-distribution?limit=${limit}`;
        if (first !== undefined) url += `&first=${first}`;
        if (filters?.dateRange) url += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
        if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
        const response = await api.get(url);
        return response.data.data;
    },

    getCategories: async () => {
        const response = await api.get(`/reports/categories`);
        return response.data.data;
    }
};
