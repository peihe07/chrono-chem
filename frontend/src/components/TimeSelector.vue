<template>
  <div class="time-selector">
    <div class="time-display">
      <span class="year">{{ currentYear }}</span>
      <span class="era-title">{{ currentEraTitle }}</span>
    </div>
    
    <div class="time-slider-container">
      <div class="time-markers">
        <div 
          v-for="era in eras" 
          :key="era.id" 
          class="time-marker"
          :class="{ active: era.id === currentEraId }"
          :style="{ left: `${(era.id - 1) * 100 / (eras.length - 1)}%` }"
          @click="selectEra(era.id)"
        >
          <div class="marker-dot"></div>
          <div class="marker-year">{{ era.year }}</div>
        </div>
      </div>
      
      <div class="time-slider">
        <input 
          type="range" 
          min="1" 
          :max="eras.length" 
          v-model="sliderValue" 
          @input="handleSliderChange"
          @change="handleSliderChange"
        />
      </div>
    </div>
    
    <div class="time-navigation">
      <button 
        @click="navigateToEra(currentEraId - 1)" 
        :disabled="currentEraId <= 1"
        class="nav-button prev"
      >
        <span class="nav-icon">◀</span>
        <span class="nav-text">上一個時代</span>
      </button>
      
      <button 
        @click="navigateToEra(currentEraId + 1)" 
        :disabled="currentEraId >= eras.length"
        class="nav-button next"
      >
        <span class="nav-text">下一個時代</span>
        <span class="nav-icon">▶</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { eras } from '@/config/eras';

const props = defineProps<{
  currentEraId: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentEraId', value: number): void;
}>();

const router = useRouter();
const sliderValue = ref(props.currentEraId);

// 監聽 props 變化，更新滑塊值
watch(() => props.currentEraId, (newValue) => {
  sliderValue.value = newValue;
});

// 計算當前年份
const currentYear = computed(() => {
  const era = eras.find(e => e.id === props.currentEraId);
  return era ? era.year : '';
});

// 計算當前時代標題
const currentEraTitle = computed(() => {
  const era = eras.find(e => e.id === props.currentEraId);
  return era ? era.title.split(' - ')[1] : '';
});

// 處理滑塊變化
const handleSliderChange = () => {
  const eraId = parseInt(sliderValue.value.toString());
  selectEra(eraId);
};

// 選擇時代
const selectEra = (eraId: number) => {
  emit('update:currentEraId', eraId);
  router.push(`/era/${eraId}`);
};

// 導航到指定時代
const navigateToEra = (eraId: number) => {
  if (eraId >= 1 && eraId <= eras.length) {
    selectEra(eraId);
  }
};
</script>

<style scoped>
.time-selector {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.year {
  font-size: 2.5rem;
  font-weight: 700;
  color: #42b883;
  margin-bottom: 0.5rem;
}

.era-title {
  font-size: 1.2rem;
  color: #2c3e50;
  text-align: center;
}

.time-slider-container {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.time-markers {
  position: relative;
  height: 40px;
  margin-bottom: 10px;
}

.time-marker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #ccc;
  border-radius: 50%;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.time-marker.active .marker-dot {
  background: #42b883;
  transform: scale(1.2);
}

.marker-year {
  font-size: 0.8rem;
  color: #666;
  transition: all 0.3s ease;
}

.time-marker.active .marker-year {
  color: #42b883;
  font-weight: 600;
}

.time-slider {
  width: 100%;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #42b883;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.nav-button:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-2px);
}

.nav-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.nav-icon {
  font-size: 1rem;
}

.prev {
  justify-content: flex-start;
}

.next {
  justify-content: flex-end;
}
</style> 