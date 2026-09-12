import api from './api';

export const reportService = {
    getTransactions: async (cursor?: string, limit: number = 10, type?: string) => {
        let url = `/reports/transactions?limit=${limit}`;
        if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
        if (type) url += `&type=${encodeURIComponent(type)}`;
        const response = await api.get(url);
        return response.data.data;
    },

    getLedger: async (cursor?: string, limit: number = 10) => {
        let url = `/reports/ledger?limit=${limit}`;
        if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
        const response = await api.get(url);
        return response.data.data;
    },

    getCommissionDistribution: async (cursor?: string, limit: number = 10) => {
        let url = `/reports/commissions-distribution?limit=${limit}`;
        if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
        const response = await api.get(url);
        return response.data.data;
    }
};
