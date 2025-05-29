<!-- TimeMachine.vue -->
<template>
  <div class="time-machine">
    <div class="time-slider">
      <input
        type="range"
        :min="minYear"
        :max="maxYear"
        :step="1"
        v-model="selectedYear"
        @input="handleYearChange"
        class="year-slider"
      />
      <div class="year-labels">
        <span v-for="era in eras" :key="era.year" class="year-label">
          {{ era.year }}
        </span>
      </div>
    </div>
    <div class="era-buttons">
      <button
        v-for="era in eras"
        :key="era.id"
        class="era-btn"
        :class="{ active: selectedYear === era.year }"
        @click="goToEra(era.year)"
      >
        {{ era.title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { eras } from '@/config/eras'

const router = useRouter()
const route = useRoute()
const selectedYear = ref(1774)

const minYear = computed(() => Math.min(...eras.map(era => era.year)))
const maxYear = computed(() => Math.max(...eras.map(era => era.year)))

onMounted(() => {
  const year = parseInt(route.params.id as string)
  if (!isNaN(year)) {
    selectedYear.value = year
  }
})

function handleYearChange() {
  const closestEra = eras.reduce((prev, curr) => {
    return Math.abs(curr.year - selectedYear.value) < Math.abs(prev.year - selectedYear.value) ? curr : prev
  })
  goToEra(closestEra.year)
}

function goToEra(year: number) {
  selectedYear.value = year
  router.push(`/era/${year}`)
}
</script>

<style scoped>
.time-machine {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
}

.time-slider {
  margin-bottom: 1rem;
}

.year-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.year-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #4a90e2;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.year-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 10px;
}

.year-label {
  font-size: 0.8rem;
  color: #666;
}

.era-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.era-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #4a90e2;
  border-radius: 8px;
  background-color: white;
  color: #4a90e2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.era-btn:hover {
  background-color: #4a90e2;
  color: white;
}

.era-btn.active {
  background-color: #4a90e2;
  color: white;
}
</style>