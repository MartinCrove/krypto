import { defineStore } from 'pinia';
import apiClient from '@/services/apiClient';

export const useBalanceStore = defineStore('cryptoBalance', {
    state: () => ({
        balances: {
            btc: 0,
            eth: 0,
            usdt: 0,
        },
        error: null,
    }),

    actions: {
        async fetchBalances(username) {
            this.error = null;
            try {
                const response = await apiClient.get(`/transactions?q={"user_id": "${username}"}`);
                this.resetBalances();
                response.data.forEach(transaction => {
                    this.updateBalance(transaction.crypto_code, transaction.crypto_amount, transaction.action);
                });
            } catch (error) {
                this.error = 'Error al obtener las transacciones';
                console.error(error);
            }
        },
        resetBalances() {
            this.balances.btc = 0;
            this.balances.eth = 0;
            this.balances.usdt = 0;         
        },

        updateBalance(cryptoCode, amount, action) {
            const parsedAmount = parseFloat(amount);
            if (action === 'purchase') {
                this.balances[cryptoCode] += parsedAmount;
            } else if (action === 'sale') {
                this.balances[cryptoCode] -= parsedAmount;
                if (this.balances[cryptoCode] < 0) {
                    this.balances[cryptoCode] = 0;
                }
            }
        },
    },
});