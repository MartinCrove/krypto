<template>
  <div>
    <div v-for="(price, crypto) in prices" :key="crypto">
      <div class="crypto-list">
        <strong class="cryto-name">{{ crypto.toUpperCase() }}</strong>
        <p>VENTA: {{ price.ask }} Ars</p>
        <p>COMPRA: {{ price.bid }} Ars</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCryptoStore } from "@/stores/useCryptoStore";

const cryptoStore = useCryptoStore();
const { prices, fetchPrices } = cryptoStore;

onMounted(async () => {
  await fetchPrices();
});
</script>

<style scoped>
.crypto-list {
  justify-content: space-around;
  align-items: center;
  border: 1px solid;
  border-radius: 10px;
}
</style>
