<template>
  <div class="about">
    <h1>{{ username }}</h1>
  </div>
</template>

<script setup>
import  {useUserStore} from '@/stores/useUserStore'
import {computed} from 'vue'


const userStore = useUserStore()

const username = computed(() => userStore.username)








</script>
