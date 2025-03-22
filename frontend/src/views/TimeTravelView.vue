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
    <div class="loading" v-if="isLoading">
      <div class="spinner"></div>
      <span>載入中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Scene } from '@/threejs/scene';
import { useRouter } from 'vue-router';
import { eras } from '@/config/eras';

const router = useRouter();
const sceneContainer = ref<HTMLElement | null>(null);
const currentEra = ref(1);
const isLoading = ref(false);
const totalEras = eras.length;

const currentEraData = computed(() => {
  return eras.find(era => era.id === currentEra.value);
});

let scene: Scene | null = null;

onMounted(() => {
  if (sceneContainer.value) {
    scene = new Scene(sceneContainer.value);
    loadEraModel(currentEra.value);
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  scene?.dispose();
});

const handleResize = () => {
  scene?.resize();
};

const loadEraModel = async (eraId: number) => {
  const era = eras.find(e => e.id === eraId);
  if (scene && era) {
    isLoading.value = true;
    try {
      scene.loadModel(
        era.modelPath,
        era.modelScale,
        era.cameraPosition
      );
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      isLoading.value = false;
    }
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
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scene-container {
  flex: 1;
  width: 100%;
}

.controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
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
</style>