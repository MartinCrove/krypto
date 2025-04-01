<template>
  <nav>
    <strong>KRYPTO</strong>
    <div class="nav-bar">
      <router-link to="/initial">Precios</router-link>
      <router-link to="/buy">Comprar</router-link>
      <router-link to="/sell">Vender</router-link>
      <router-link to="/transaction">Transacciones</router-link>

      <div>     
      
        <p class="user">{{ username }}</p>
        <button class="btn" @click="LogOut">Cerrar Sesion</button>
      </div>
    </div>
  </nav>
  

  <router-view />
</template>

<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { computed } from "vue";

import { useRouter } from "vue-router";




const userStore = useUserStore();
const username = computed(() => userStore.username);
const router = useRouter();







const LogOut = () => {
  userStore.setUsername(""),
  localStorage.removeItem("username")
  router.push({name: 'home'})

}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  padding: 15px 30px;
  color: white;
  font-weight: bold;
}


.nav-bar {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-bar a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
}

.nav-bar a:hover {
  color: #c2a77a;
}

.btn {
  background-color: #c2a77a;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background-color: #a68b5c;
}

ul {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: #292929;
  padding: 10px;
  margin: 20px auto;
  max-width: 400px;
  color: white;
}

li {
  list-style: none;
  font-size: 16px;
}

</style>
