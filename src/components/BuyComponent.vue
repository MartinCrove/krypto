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
      <input type="number" v-model="amount" @input="updatePrice" step="0.00001" />

      <label for="total">Total a pagar (ARS):</label>
      <input type="number" v-model="total" step="0.01" readonly />

      <button type="submit">Comprar</button>
      <p v-if="formError" class="error-message">{{ formError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { useBalanceStore } from "@/stores/useBalanceStore";
import apiClient from '@/services/apiClient'

const balanceStore = useBalanceStore()
const userStore = useUserStore();
const username = computed(() => userStore.username);
const cryptoPrices = useCryptoStore();


const crypto = ref("");
const amount = ref("");
const price = ref(0);
const total = ref(0);
const formError = ref("");

onMounted(async () => {
  try {
    await cryptoPrices.fetchPrices();
  } catch (error) {
    console.log(error);
  }
});

const fetchCryptoPrice = async () => {
  if (!crypto.value) return;

  await cryptoPrices.fetchPrices();
  price.value = cryptoPrices.prices[crypto.value]?.ask;
  if (price.value) {
    updatePrice();
  } else {
    console.log("Error");
  }
};
const updatePrice = () => {
  if (amount.value && price.value) {
    total.value = (amount.value * price.value).toFixed(2);
  } else {
    total.value = 0;
  }
};
const resetForm = () => {
  crypto.value = "";
  amount.value = "";
  price.value = 0;
  total.value = 0;
  formError.value = "";
};

const submitTransaction = async () => {
  formError.value = "";

  if (amount.value <= 0 || total.value <= 0) {
    formError.value = "Debe seleccionar la criptomoneda y la cantidad a comprar";
  }

  const now = new Date();
  const formattedDatetime = now.toISOString();

  const transaction = {
    user_id: username.value,
    action: 'purchase',
    crypto_code: crypto.value,
    crypto_amount: amount.value,
    money: total.value,
    datetime: formattedDatetime,
  };

  try {
    await apiClient.post('/transactions', transaction);
    balanceStore.updateBalance(crypto.value,amount.value, 'purchase')
    resetForm();
  } catch (error) {
    console.log("Error al enviar la transacción:", error.response?.data || error.message);

  }
};
</script>

<style scoped></style>
