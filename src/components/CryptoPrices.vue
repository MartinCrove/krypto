<template>
  <div class="crypto-container">
    <div v-for="(price, crypto) in prices" :key="crypto" class="crypto-item">
      <div class="crypto-list">
        <strong class="crypto-name">{{ crypto.toUpperCase() }}</strong>
        <div class="price-container">
          <span class="price-label venta">VENTA:</span>
          <span class="price-value">${{ price.ask }} Ars</span>
        </div>
        <div class="price-container">
          <span class="price-label compra">COMPRA:</span>
          <span class="price-value">${{ price.bid }} Ars</span>
        </div>
      </div>
    </div>
    <StateComponent/>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCryptoStore } from "@/stores/useCryptoStore";
import StateComponent from "./StateComponent.vue";

const cryptoStore = useCryptoStore();
const { prices, fetchPrices } = cryptoStore;

onMounted(async () => {
  await fetchPrices();
});
</script>

<style scoped>
.crypto-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

.crypto-item {
  margin-bottom: 0.5rem;
}

.crypto-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.crypto-name {
  font-size: 1rem;
  color: #2d3748;
  width: 80px;
  text-align: left;
}

.price-container {
  
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.price-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.price-label.venta {
  color: #dc2626; 
}

.price-label.compra {
  color: #16a34a; 
}

.price-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
}


</style>
