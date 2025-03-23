<template>
  <div class="time-travel-view">
    <div ref="sceneContainer" class="scene-container"></div>

    <div class="controls">
      <button @click="navigateToEra(currentEra - 1)" :disabled="currentEra <= 1">上一個時代</button>
      <div class="era-info">
        <span class="era-title">{{ currentEraData?.title }}</span>
        <span class="era-description">{{ currentEraData?.description }}</span>
      </div>
      <button @click="navigateToEra(currentEra + 1)" :disabled="currentEra >= totalEras">下一個時代</button>
    </div>

    <div class="era-data-toggle" @click="showPanel = !showPanel">
      {{ showPanel ? '📘 隱藏資訊' : '📖 顯示資訊' }}
    </div>

    <Transition name="slide">
      <div class="era-data-panel" v-if="showPanel">
        <div v-if="events.length === 0 && scientists.length === 0" class="empty-state">
          暫無相關資料
        </div>
        <div v-if="events.length > 0">
          <h3>🔬 相關事件 ({{ events.length }})</h3>
          <ul>
            <li v-for="event in events" :key="event.id">
              <strong>{{ event.title }}</strong>
              <div class="event-details">
                <span>📅 {{ event.year }}年</span>
                <span>📍 {{ event.location }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="scientists.length > 0">
          <h3>👩‍🔬 化學家</h3>
          <ul>
            <li v-for="scientist in scientists" :key="scientist.id">
              <strong>{{ scientist.name }}</strong>
              <div class="scientist-years">
                {{ scientist.birth_year }} - {{ scientist.death_year }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Transition>

    <div class="loading" v-if="isLoading">
      <div class="spinner"></div>
      <span>載入中...</span>
    </div>

    <div class="error-message" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Scene } from '@/threejs/scene';
import { useRouter } from 'vue-router';
import { eras } from '@/config/eras';
import { fetchEras, fetchEvents, fetchScientists } from '@/api';

const router = useRouter();
const sceneContainer = ref<HTMLElement | null>(null);
const currentEra = ref(1);
const isLoading = ref(false);
const totalEras = eras.length;

interface Event {
  id: number;
  title: string;
  year: number;
  location: string;
}

interface Scientist {
  id: number;
  name: string;
  birth_year: number;
  death_year: number;
}

const events = ref<Event[]>([]);
const scientists = ref<Scientist[]>([]);
const showPanel = ref(true);
const currentEraData = computed(() => {
  return eras.find(era => era.id === currentEra.value);
});

let scene: Scene | null = null;
const error = ref<string>('');

onMounted(async () => {
  if (sceneContainer.value) {
    scene = new Scene(sceneContainer.value);
    await loadEraModel(currentEra.value);
    window.addEventListener('resize', handleResize);
  }

  const response = await fetchEras();
  console.log('時代資料：', response.data);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  scene?.dispose();
});

const handleResize = () => {
  scene?.resize();
};

const loadEraModel = async (eraId: number) => {
  error.value = '';  // 重置錯誤訊息
  const era = eras.find(e => e.id === eraId);
  console.log('當前時代ID:', eraId, '找到的時代配置:', era);
  
  if (!scene || !era) {
    error.value = '無法載入場景';
    return;
  }

  isLoading.value = true;
  try {
    console.log('開始載入模型:', era.modelPath, '場景ID:', eraId);
    console.log('模型配置:', {
      scale: era.modelScale,
      cameraPosition: era.cameraPosition
    });
    
    await scene.loadModel(
      era.modelPath,
      era.modelScale,
      era.cameraPosition,
      era.cameraTarget
    );
    console.log('模型載入成功');
    
    try {
      console.log('開始載入相關資料');
      const [eventsRes, scientistsRes] = await Promise.all([
        fetchEvents(eraId),
        fetchScientists(eraId),
      ]);
      events.value = eventsRes.data as Event[];
      scientists.value = scientistsRes.data as Scientist[];
      console.log('資料載入成功:', {
        events: events.value.length,
        scientists: scientists.value.length
      });
    } catch (apiError) {
      console.error('API 請求錯誤:', apiError);
      error.value = '無法載入相關資料';
    }
  } catch (modelError: unknown) {
    console.error('模型載入失敗:', modelError);
    error.value = `模型 ${era.modelPath} 載入失敗: ${modelError instanceof Error ? modelError.message : '未知錯誤'}`;
  } finally {
    isLoading.value = false;
  }
};

const navigateToEra = (eraId: number) => {
  if (eraId >= 1 && eraId <= totalEras) {
    currentEra.value = eraId;
    loadEraModel(eraId);
    router.push(`/era/${eraId}`);
  }
};
</script>

<style scoped>
.time-travel-view {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  background: #000;
}

.scene-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.era-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
}

.era-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.era-description {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #3aa876;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.era-data-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #42b883;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.era-data-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.era-data-panel {
  position: fixed;
  top: 3.2rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 1.8rem;
  width: 380px;  /* 固定寬度 */
  max-height: calc(100vh - 10rem);
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 10;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.era-data-panel h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.era-data-panel ul {
  list-style: disc;
  padding-left: 1.2rem;
  margin-bottom: 1rem;
}

.era-data-panel li {
  padding: 0.8rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(66, 184, 131, 0.1);
}

.era-data-panel li:hover {
  background: rgba(66, 184, 131, 0.05);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.event-details {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.4rem;
  display: flex;
  gap: 1.2rem;
  padding-top: 0.4rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.scientist-years {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.4rem;
  padding-top: 0.4rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.error-message {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 87, 87, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 30;
}

/* 添加滾動條樣式 */
.era-data-panel::-webkit-scrollbar {
  width: 6px;
}

.era-data-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.era-data-panel::-webkit-scrollbar-thumb {
  background: rgba(66, 184, 131, 0.5);
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}
</style>