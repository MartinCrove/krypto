<template>
  <strong>KRYPTO</strong>
    <nav class="nav-bar">
      <router-link to="/initial">Precios</router-link> |
      <router-link to="/buy">Comprar</router-link> |
      <router-link to="/sell">Vender</router-link> |
      <router-link to="/transaction">Transacciones</router-link>
      
      <button class="btn"> {{username}}</button>
      <ul>
      <li>BTC {{ balance.btc.toFixed(5)}}</li>
      <li>ETH {{ balance.eth.toFixed(5) }}</li>
      <li>USDT {{ balance.usdt.toFixed(5)  }}</li>
      </ul>
    </nav> 
   
    <router-view/>
</template>


 <script setup>
 import { useUserStore } from '@/stores/useUserStore';
 import {computed} from 'vue'
 import { useBalanceStore } from '@/stores/useBalanceStore';

 const balanceStore = useBalanceStore()
 const userStore = useUserStore()
 const username = computed(()=> userStore.username);
 const balance = computed (() => balanceStore.balances )

</script>

<style>
li{
  list-style-type: none;
}

</style>




 





  

  