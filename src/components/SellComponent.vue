<template>
    <div>
        <form @submit.prevent="submitTransaction" class="form">
            <label for="crypto">Criptomoneda:</label>
            <select v-model="crypto" @change="fetchCryptoPrice">
                <option value="" disabled>Seleccione una criptomoneda</option>
                <option value="btc">Bitcoin (BTC)</option>                
                <option value="eth">Ethereum (ETH)</option>
                <option value="usdt">Tether (USDT)</option>
          
            </select>

            <label for="amount">Cantidad:</label>
            <input type="number" v-model="amount" @input="updatePrice" step="0.00001"/>

            <label for="total">Total a recibir (ARS):</label>
            <input type="number" v-model="totalReceived" step="0.01" readonly />

            <button type="submit">Vender</button>
            <p v-if="formError" class="error-message">{{ formError }}</p>
        </form>

        <LoadingModal v-if="loading" />
        <SuccessModal v-if="successModal" @close="successModal = false" :message="successMessage" />
        <ErrorModal v-if="errorModal" @close="errorModal = false" :message="errorMessage" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useCryptoStore } from '@/stores/useCryptoStore';
import { useBalanceStore } from '@/stores/useBalanceStore';
import apiClient from '@/services/apiClient';


const userStore = useUserStore();
const username = computed(() => userStore.username);
const cryptoPricesStore = useCryptoStore();
const cryptoBalanceStore = useBalanceStore();

const crypto = ref('');
const amount = ref('');
const price = ref(0);
const totalReceived = ref(0);

const formError = ref('');

onMounted(async () => {
    try {
        await cryptoBalanceStore.fetchBalances(username.value);
    } catch (error) {
       console.log("error")
    }
});

const fetchCryptoPrice = async () => {
    if (!crypto.value) return;

    await cryptoPricesStore.fetchPrices();
    price.value = cryptoPricesStore.prices[crypto.value]?.bid;
    if (price.value) {
        updatePrice();
    } else {
        formError.value = 'Error al obtener el precio de la criptomoneda';
    }
};

const updatePrice = () => {
    if (amount.value && price.value) {
        totalReceived.value = (amount.value * price.value).toFixed(2);
    } else {
        totalReceived.value = 0;
    }
};

const resetForm = () => {
    crypto.value = '';
    amount.value = '';
    price.value = 0;
    totalReceived.value = 0;
    formError.value = '';
};

const submitTransaction = async () => {
    formError.value = '';

    if (amount.value <= 0 || totalReceived.value <= 0) {
        formError.value = 'Seleccione una criptomoneda y la cantidad a vender';
        return;
    }

    if (amount.value > cryptoBalanceStore.balances[crypto.value]) {
        formError.value = 'No tienes suficiente cantidad de la criptomoneda seleccionada';
        return;
    }

    const now = new Date();
    const formattedDatetime = now.toISOString();

    const transaction = {
        user_id: username.value,
        action: 'sale',
        crypto_code: crypto.value,
        crypto_amount: amount.value,
        money: totalReceived.value,
        datetime: formattedDatetime,
    };

  

    try {
        await apiClient.post('/transactions', transaction);
        cryptoBalanceStore.updateBalance(crypto.value, amount.value, 'sale');
       
        resetForm();
    } catch (error) {
        console.log(error)
    } 
};
</script>

