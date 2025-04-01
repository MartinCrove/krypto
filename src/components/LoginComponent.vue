<template>
  <div class="login-container">
    <form @submit.prevent="access" class="login-form">
      <h2 class="login-title">INICIAR SESIÓN</h2>

      <div class="input-group">
        <input
          v-model="username"
          type="text"
          placeholder="Nombre de usuario"
          class="login-input"
          @input="clearErrors"
        />
      </div>

      <button type="submit" class="login-btn">INGRESAR</button>

      <div class="error-messages">
        <p v-if="error" class="error-message">*Debe ingresar un nombre de usuario</p>
        <p v-if="lengthError" class="error-message">
          *El nombre de usuario debe ser de al menos 6 caracteres
        </p>
        <p v-if="uppercaseError" class="error-message">
          *Debe contener al menos una mayúscula
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { ref } from "vue";

const router = useRouter();
const userStore = useUserStore();
const username = ref("");

const error = ref(false);
const lengthError = ref(false);
const uppercaseError = ref(false);

const clearErrors = () => {
  error.value = false;
  lengthError.value = false;
  uppercaseError.value = false;
};

const access = () => {
  clearErrors();

  if (!username.value) {
    error.value = true;
    return;
  }

  if (username.value.length < 6) {
    lengthError.value = true;
    return;
  }

  if (!/[A-Z]/.test(username.value)) {
    uppercaseError.value = true;
    return;
  }

  userStore.setUsername(username.value);
  router.push({ name: "initial" });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  padding-top: 100px;
  background-color: #86888a;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 380px;
  border: 1px solid #e2e8f0;
}

.login-title {
  color: #2d3748;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-group {
  margin-bottom: 20px;
  padding: 0 10px; /* Añadido para separar del borde */
}

.login-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: #f8fafc;
}

.login-input:focus {
  outline: none;
  border-color: #c2a77a;
}

.login-btn {
  width: calc(100% - 20px); /* Ajustado para considerar el padding */
  margin: 0 10px;
  padding: 12px;
  background-color: #c2a77a;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}

.login-btn:hover {
  background-color: #a58c5e;
}

.error-messages {
  margin-top: 15px;
  padding: 0 10px; /* Añadido para alinear con los inputs */
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
}
</style>
