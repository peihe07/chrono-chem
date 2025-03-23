<template>
    <div class="time-machine">
      <button v-for="era in eras" :key="era.id" @click="goToEra(era.id)">
        {{ era.title }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { eras } from '@/config/eras'
  
  const router = useRouter()
  const goToEra = (year: number) => {
    router.push(`/time/${year}`)
  }
  </script>