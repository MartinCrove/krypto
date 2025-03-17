<template>
 <div>
    <form @submit.prevent="access">
    <input v-model="username" type="text" placeholder="Username">
    <button>Log In</button>
    </form>
 </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import { useUserStore } from '@/stores/useUserStore';
import  {ref} from 'vue'




const router = useRouter()
const userStore = useUserStore()
const username = ref('')

const error = ref(false);
const lengthError = ref(false);
const uppercaseError = ref(false);

const access = () => {
   
    if (!username.value) {
        error.value = true;
        return;
    }

    if (username.value.length < 6) {
        lengthError.value = true;
        return;
    }

    if (!/[A-Z]/.test(username.value)) {
        lengthError.value = true;
        return;
    }
   
   error.value = false;
    lengthError.value = false;
    uppercaseError.value = false;

   userStore.setUsername(username.value)
   router.push({name: 'about'})

}

</script>

<style scoped>
</style>