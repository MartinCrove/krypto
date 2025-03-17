<template>
    <nav class="nav-bar">
      <router-link to="/about">Precios</router-link> |
      <router-link to="/buy">Comprar</router-link> |
      <router-link to="/sell">Vender</router-link>
      
      <button class="btn"> {{username}}</button>
    </nav> 
   
    <router-view/>
</template>


 <script setup>
 import { useUserStore } from '@/stores/useUserStore';
 import {computed} from 'vue'

 const userStore = useUserStore()
 const username = computed(()=> userStore.username);

</script>

<style>


</style>




 





  

  