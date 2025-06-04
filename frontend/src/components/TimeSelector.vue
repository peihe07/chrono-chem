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
  position: relative;
  background: rgba(60, 120, 60, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 2rem;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 4rem auto 0;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 160px;
  flex-shrink: 0;
}

.year {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
}

.era-title {
  font-size: 1rem;
  color: #ffffff;
  white-space: nowrap;
}

.time-slider-container {
  flex: 1;
  margin: 0 1rem;
  position: relative;
  min-width: 0;
}

.time-markers {
  position: relative;
  height: 32px;
  margin-bottom: 6px;
}

.time-marker {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateX(-50%);
  gap: 4px;
}

.marker-dot {
  display: none;
}

.time-marker.active .marker-dot {
  display: none;
}

.marker-year {
  font-size: 1.1rem;
  color: #ffffff;
  transition: all 0.3s ease;
  white-space: nowrap;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.time-marker.active .marker-year {
  color: #ffffff;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  font-size: 1.2rem;
}

.time-slider {
  width: 100%;
  margin-top: 2px;
}

input[type="range"] {
  width: 100%;
  height: 3px;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #2c5e2c;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(44, 94, 44, 0.2);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-navigation {
  display: flex;
  gap: 0.4rem;
  min-width: 160px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.nav-button {
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  white-space: nowrap;
  color: #ffffff;
}

.nav-button:disabled {
  color: rgba(255, 255, 255, 0.5);
}

.nav-icon {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .time-selector {
    padding: 0.4rem 1rem;
    height: 50px;
    gap: 0.5rem;
  }

  .time-display {
    min-width: 120px;
    gap: 0.5rem;
  }

  .year {
    font-size: 1.4rem;
  }

  .era-title {
    font-size: 0.9rem;
  }

  .time-navigation {
    min-width: 120px;
}

  .nav-button {
    padding: 0.15rem 0.4rem;
    font-size: 0.8rem;
}

.nav-icon {
    font-size: 0.8rem;
  }

  .marker-year {
    font-size: 0.9rem;
  }

  .time-marker.active .marker-year {
  font-size: 1rem;
}

  .time-markers {
    height: 28px;
    margin-bottom: 4px;
}
}
</style> 