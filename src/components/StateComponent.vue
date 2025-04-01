<template>
  <div class="crypto-balance">
    <h2 v-if="totalValueInPesos !== '0.00'" class="balance-title">
      Tienes ARS: ${{ totalValueInPesos }}  en KRYPTO
    </h2>
    <p v-else class="empty-message">Cargando datos o sin criptomonedas disponibles.</p>

    <div v-if="Object.keys(filteredBalances).length > 0" class="balance-table-container">
      <table class="balance-table">
        <thead>
          <tr>
            <th class="crypto-header">Criptomoneda</th>
            <th class="amount-header">Cantidad</th>
            <th class="value-header">Valor de Venta (ARS)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(balance, crypto) in filteredBalances" :key="crypto">
            <td class="crypto-cell">{{ crypto.toUpperCase() }}</td>
            <td class="amount-cell">{{ balance }}</td>
            <td class="value-cell">${{ getCryptoValueInPesos(crypto, balance) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useBalanceStore } from "@/stores/useBalanceStore";
import { useCryptoStore } from "@/stores/useCryptoStore";

const userStore = useUserStore();
const cryptoBalanceStore = useBalanceStore();
const cryptoPricesStore = useCryptoStore();

onMounted(async () => {
  try {
    if (!userStore.username) {
      console.error("Error: userName no está definido.");
      return;
    }

    console.log("Obteniendo balances para:", userStore.username);
    await cryptoBalanceStore.fetchBalances(userStore.username);
    console.log("Balances obtenidos:", cryptoBalanceStore.balances);

    await cryptoPricesStore.fetchPrices();
    console.log("Precios obtenidos:", cryptoPricesStore.prices);
  } catch (error) {
    console.error("Error al obtener balances o precios:", error);
  }
});

const filteredBalances = computed(() => {
  const balances = cryptoBalanceStore.balances || {};
  return Object.fromEntries(Object.entries(balances).filter(([, amount]) => amount > 0));
});

const getCryptoValueInPesos = (crypto, amount) => {
  const price = cryptoPricesStore.prices[crypto]?.bid || 0;
  return (price * amount).toFixed(2);
};

const totalValueInPesos = computed(() => {
  return Object.entries(filteredBalances.value)
    .reduce((total, [crypto, amount]) => {
      const valueInPesos = getCryptoValueInPesos(crypto, amount);
      return total + parseFloat(valueInPesos);
    }, 0)
    .toFixed(2);
});
</script>

<style scoped>
.crypto-balance {
  max-width: 800px;
  margin: 1.5rem auto;
  padding: 0 1rem;
  font-family: "Inter", sans-serif;
}

.balance-title {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.empty-message {
  color: #64748b;
  font-size: 1rem;
}

.balance-table-container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.balance-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.balance-table th {
  background-color: #c2a77a;
  color: white;
  font-weight: 600;
  text-align: center;
  padding: 0.85rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.balance-table td {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
}

.crypto-header {
  width: 33%;
  text-align: left;
  padding-left: 1.5rem;
}

.amount-header,
.value-header {
  width: 33%;
}

.crypto-cell {
  font-weight: 500;
  text-align: left;
  padding-left: 1.5rem;
}

.amount-cell {
  font-weight: 500;
}

.value-cell {
  font-weight: 600;
  color: #16a34a; /* Verde para valores positivos */
}

.balance-table tr:last-child td {
  border-bottom: none;
}

.balance-table tr:hover {
  background-color: #f8fafc;
}


</style>
