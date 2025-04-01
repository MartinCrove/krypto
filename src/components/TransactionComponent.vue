<template>
  <div class="transactions-container">
    <div class="transactions-list">
      <div v-for="transaction in transactions" :key="transaction._id" class="transaction-card">
        <div class="transaction-details">
          <div class="crypto-code">{{ transaction.crypto_code.toUpperCase() }}</div>
          <div class="transaction-info">
            <span>Amount: {{ transaction.crypto_amount }}</span>
            <span>Price: ${{ transaction.money }} ARS</span>
          </div>
          <div class="transaction-action">{{ transaction.action.toUpperCase() }}</div>
        </div>
        <div class="transaction-actions">
          <button @click="ViewView(transaction._id)" class="view-btn">View</button>
          <button @click="EditView(transaction._id)" class="edit-btn">Edit</button>
          <button @click="deleteTransaction(transaction._id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useUserStore from "@/stores/useUserStore";
import apiClient from "@/services/apiClient";
import { ref, onMounted } from "vue";
import router from "@/router";

const userStore = useUserStore();
const transactions = ref([]);

// Fetch transactions from API
const fetchTransactions = async () => {
  try {
    const response = await apiClient.get(
      `/transactions?q={"user_id": "${userStore.username}"}`
    );
    transactions.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

// Navigate to view transaction
const ViewView = (id) => {
  router.push({ name: "view", params: { id } });
};

// Navigate to edit transaction
const EditView = (id) => {
  router.push({ name: "edit", params: { id } });
};

// Delete transaction and refetch data
const deleteTransaction = async (id) => {
  try {
    await apiClient.delete(`/transactions/${id}`);
    fetchTransactions();
  } catch (error) {
    console.log("Error al eliminar la transacción:", error);
  }
};

onMounted(fetchTransactions);
</script>

<style scoped>
/* Base styles */
.transactions-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.transaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.transaction-details {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.crypto-code {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.transaction-info {
  display: flex;
  gap: 1rem;
  color: #4a5568;
  font-size: 1.1rem;
}

.transaction-action {
  font-weight: 500;
  color: #4f46e5;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.transaction-actions {
  display: flex;
  border-top: 1px solid #e2e8f0;
  padding: 0.75rem;
  gap: 0.5rem;
}

button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.view-btn:hover {
  background-color: #c7d2fe;
}

.edit-btn {
  background-color: #ecfccb;
  color: #65a30d;
}

.edit-btn:hover {
  background-color: #d9f99d;
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #fecaca;
}


</style>
