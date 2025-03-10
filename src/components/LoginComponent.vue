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


const access = () => {
   userStore.setUsername(username.value)
   router.push({name: 'about'})

}

</script>

<style scoped>
</style>