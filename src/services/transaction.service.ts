import api from './api';

export const transactionService = {
    processPayment: async (payload: { category_id: number; amount: string; biller_name: string; consumer_number: string; api_response?: any }) => {
        const response = await api.post('/transactions/process', payload);
        return response.data;
    },

    getTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    getReceipt: async (txnId: string) => {
        const response = await api.get(`/transactions/${encodeURIComponent(txnId)}/receipt`);
        return response.data;
    }
};
