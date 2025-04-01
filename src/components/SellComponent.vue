<template>
  <div class="form-container">
    <form @submit.prevent="submitTransaction" class="crypto-form">
      <div class="form-group">
        <label for="crypto">Criptomoneda:</label>
        <select v-model="crypto" @change="fetchCryptoPrice" class="form-input">
          <option value="" disabled>Seleccione una criptomoneda</option>
          <option value="btc">Bitcoin (BTC)</option>
          <option value="eth">Ethereum (ETH)</option>
          <option value="usdt">Tether (USDT)</option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Cantidad:</label>
        <input
          type="number"
          v-model="amount"
          @input="updatePrice"
          step="0.00001"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="total">Total a recibir (ARS):</label>
        <input
          type="number"
          v-model="totalReceived"
          step="0.01"
          readonly
          class="form-input readonly"
        />
      </div>

      <button type="submit" class="submit-btn">Vender</button>

      <p v-if="formError" class="error-message">{{ formError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { useBalanceStore } from "@/stores/useBalanceStore";
import apiClient from "@/services/apiClient";

const userStore = useUserStore();
const username = computed(() => userStore.username);
const cryptoPricesStore = useCryptoStore();
const cryptoBalanceStore = useBalanceStore();

const crypto = ref("");
const amount = ref("");
const price = ref(0);
const totalReceived = ref(0);

const formError = ref("");

onMounted(async () => {
  try {
    await cryptoBalanceStore.fetchBalances(username.value);
  } catch (error) {
    console.log("error");
  }
});

const fetchCryptoPrice = async () => {
  if (!crypto.value) return;

  await cryptoPricesStore.fetchPrices();
  price.value = cryptoPricesStore.prices[crypto.value]?.bid;
  if (price.value) {
    updatePrice();
  } else {
    formError.value = "Error al obtener el precio de la criptomoneda";
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
  crypto.value = "";
  amount.value = "";
  price.value = 0;
  totalReceived.value = 0;
  formError.value = "";
};

const submitTransaction = async () => {
  formError.value = "";

  if (amount.value <= 0 || totalReceived.value <= 0) {
    formError.value = "Seleccione una criptomoneda y la cantidad a vender";
    return;
  }

  if (amount.value > cryptoBalanceStore.balances[crypto.value]) {
    formError.value = "No tienes suficiente cantidad de la criptomoneda seleccionada";
    return;
  }

  const now = new Date();
  const formattedDatetime = now.toISOString();

  const transaction = {
    user_id: username.value,
    action: "sale",
    crypto_code: crypto.value,
    crypto_amount: amount.value,
    money: totalReceived.value,
    datetime: formattedDatetime,
  };

  try {
    await apiClient.post("/transactions", transaction);
    cryptoBalanceStore.updateBalance(crypto.value, amount.value, "sale");

    resetForm();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 2rem auto;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.crypto-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid #e2e8f0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.form-input {
  padding: 0.85rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #c2a77a;
  box-shadow: 0 0 0 3px rgba(194, 167, 122, 0.2);
}

.readonly {
  background-color: #f1f5f9;
  color: #64748b;
  font-weight: 500;
}

.submit-btn {
  padding: 1rem;
  background-color: #c2a77a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-btn:hover {
  background-color: #a58c5e;
  transform: translateY(-1px);
}

.error-message {
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  padding: 0.5rem;
  background: #fee2e2;
  border-radius: 6px;
}


</style>
