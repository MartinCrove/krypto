<template>
  <div class="transaction-detail-container">
    <div v-if="!transaction._id" class="loading-message">
      <p>Cargando transacción...</p>
    </div>
    <div v-else class="transaction-card">
      <h2 class="detail-title">DETALLE DE TRANSACCIÓN</h2>
      
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">ID:</span>
          <span class="detail-value">{{ transaction._id }}</span>
        </div>
        
        <div class="detail-item">
          <span class="detail-label">CRIPTOMONEDA:</span>
          <span class="detail-value crypto-code">{{ transaction.crypto_code.toUpperCase() }}</span>
        </div>
        
        <div class="detail-item">
          <span class="detail-label">CANTIDAD:</span>
          <span class="detail-value">{{ transaction.crypto_amount }}</span>
        </div>
        
        <div class="detail-item">
          <span class="detail-label">PRECIO (ARS):</span>
          <span class="detail-value">${{ transaction.money }}</span>
        </div>
        
        <div class="detail-item">
          <span class="detail-label">ACCIÓN:</span>
          <span class="detail-value action-badge" :class="transaction.action">{{ transaction.action.toUpperCase() }}</span>
        </div>
        
        <div class="detail-item">
          <span class="detail-label">FECHA:</span>
          <span class="detail-value">{{ formatDate(transaction.datetime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/services/apiClient";
import { useRoute } from "vue-router";

const transaction = ref({
  _id: "",
  crypto_code: "",
  crypto_amount: "",
  money: "",
  action: "",
  datetime: "",
});
const route = useRoute();

const fetchTransactions = async () => {
  try {
    const response = await apiClient.get(`/transactions/${route.params.id}`);    
    transaction.value = response.data;     
  } catch (error) {
    console.log("Error al obtener la transacción:", error);
  }
};

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-AR', options);
};

onMounted(fetchTransactions);
</script>

<style scoped>
.transaction-detail-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.transaction-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.detail-title {
  color: #2d3748;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.detail-value {
  font-weight: 500;
  color: #2d3748;
  text-align: right;
}

.crypto-code {
  font-weight: 700;
  color: #4f46e5;
}

.action-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.action-badge.purchase {
  background-color: #ecfccb;
  color: #65a30d;
}

.action-badge.sale {
  background-color: #fee2e2;
  color: #dc2626;
}


</style>