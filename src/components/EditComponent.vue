<template>
  <div class="edit-container">
    <div v-if="transaction" class="edit-card">
      <h2 class="edit-title">EDITAR TRANSACCIÓN</h2>
      <form @submit.prevent="submitEdit" class="edit-form">
        <div class="form-group">
          <label for="crypto" class="form-label">Criptomoneda:</label>
          <select
            v-model="transaction.crypto_code"
            id="crypto"
            class="form-select"
            required
          >
            <option value="" disabled>Seleccione una criptomoneda</option>
            <option value="btc">Bitcoin (BTC)</option>
            <option value="eth">Ethereum (ETH)</option>
            <option value="usdt">Tether (USDT)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="amount" class="form-label">Cantidad:</label>
          <input
            v-model="transaction.crypto_amount"
            id="amount"
            type="number"
            step="0.00001"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="money" class="form-label">Precio (ARS):</label>
          <input
            v-model="transaction.money"
            id="money"
            type="number"
            step="0.01"
            class="form-input"
          />
        </div>

        <p v-if="errors" class="error-message">
          No puedes introducir valores menores a 0.
        </p>

        <div class="button-group">
          <button type="submit" class="btn-save">GUARDAR CAMBIOS</button>
          <button type="button" class="btn-cancel" @click="cancelEdit">CANCELAR</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/apiClient";

const route = useRoute();
const router = useRouter();
const transaction = ref(null);
const errors = ref(false);

const fetchTransaction = async () => {
  try {
    const response = await apiClient.get(`/transactions/${route.params.id}`);
    transaction.value = response.data;
  } catch (error) {
    console.error("Error al obtener la transacción:", error);
  }
};

const validate = () => {
  errors.value = transaction.value.crypto_amount < 0 || transaction.value.money < 0;
};

const submitEdit = async () => {
  validate();
  if (errors.value) {
    return;
  }

  try {
    await apiClient.patch(`/transactions/${route.params.id}`, {
      crypto_code: transaction.value.crypto_code,
      crypto_amount: transaction.value.crypto_amount,
      money: transaction.value.money,
    });
    router.push({ name: "transaction" });
  } catch (error) {
    console.error("Error al actualizar la transacción:", error);
  }
};

const cancelEdit = () => {
  router.push({ name: "transaction" });
};

onMounted(fetchTransaction);
</script>

<style scoped>
.edit-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.edit-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.edit-title {
  color: #2d3748;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
}

.form-input,
.form-select {
  padding: 0.85rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #c2a77a;
  box-shadow: 0 0 0 3px rgba(194, 167, 122, 0.2);
}

.form-select {
  appearance: none;
 
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-save {
  background-color: #c2a77a;
  color: white;
}

.btn-save:hover {
  background-color: #a58c5e;
  transform: translateY(-1px);
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
  transform: translateY(-1px);
}

.error-message {
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}


</style>
