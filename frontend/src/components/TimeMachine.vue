<!-- TimeMachine.vue -->
<template>
    <div class="time-machine">
      <button
        v-for="era in eras"
        :key="era.id"
        class="era-btn"
        @click="goToEra(era.id)"
      >
        {{ era.title }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { eras } from '@/config/eras'
  
  const router = useRouter()
  
  function goToEra(year: number) {
    router.push(`/time/${year}`)
  }
  </script>
  
  <style scoped>
  .time-machine {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }
  .era-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #aaa;
    border-radius: 8px;
    background-color: #f0f0f0;
    cursor: pointer;
  }
  </style>