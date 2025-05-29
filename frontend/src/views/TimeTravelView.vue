<template>
  <div class="time-travel-view">
    <div class="main-content">
      <div ref="container" class="scene-container"></div>
      
      <div class="info-panel">
        <div class="chemist-list">
          <div v-for="scientist in scientists" 
               :key="scientist.id" 
               class="chemist-card"
               @click="selectChemist(scientist)">
            <img :src="scientist.portrait_path" :alt="scientist.name" class="chemist-portrait">
            <div class="chemist-info">
              <h3>{{ scientist.name }}</h3>
              <p>{{ scientist.description }}</p>
              <div class="chemist-years">{{ scientist.birth_year }} - {{ scientist.death_year }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="time-selector-container">
      <TimeSelector v-model:currentEraId="currentEra" />
    </div>
    
    <ChemistDialog 
      v-if="selectedChemist"
      :show="showChemistDialog" 
      :chemist="selectedChemist" 
      @close="closeChemistDialog"
    />

    <!-- 載入狀態 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">載入中...</div>
    </div>

    <!-- 錯誤提示 -->
    <div v-if="error" class="error-toast">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">{{ error }}</span>
      </div>
      <button class="error-close" @click="error = ''">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import * as THREE from 'three';
import { Scene } from '@/threejs/scene';
import type { CameraPreset } from '@/threejs/scene';
import { useRouter } from 'vue-router';
import { eras } from '@/config/eras';
import {  fetchEvents, fetchScientists } from '@/api';
import type { Chemist } from '@/types/index';
import TimeSelector from '@/components/TimeSelector.vue';
import ChemistDialog from '@/components/ChemistDialog.vue';
import type { ChemistModelConfig } from '@/threejs/ChemistModel';

const router = useRouter();
const container = ref<HTMLElement | null>(null);
const currentEra = ref<number>(1);
const isLoading = ref(false);
const totalEras = eras.length;

// 監聽 currentEra 的變化
watch(currentEra, async (newEraId) => {
  console.log('時代變更:', newEraId);
  await loadEraModel(newEraId);
});

interface Event {
  id: number;
  title: string;
  year: number;
  location: string;
}

const events = ref<Event[]>([]);
const scientists = ref<Chemist[]>([]);
const currentEraData = computed(() => {
  return eras.find(era => era.id === currentEra.value);
});

let scene: Scene | null = null;
const error = ref<string>('');

// 化學家相關
const showChemistDialog = ref<boolean>(false);
const selectedChemist = ref<Chemist | null>(null);

// 全局錯誤處理
const handleError = (err: unknown, context: string) => {
  console.error(`${context} 錯誤:`, err);
  let errorMessage = '發生未知錯誤';
  if (err instanceof Error) {
    errorMessage = err.message ? `${context} 錯誤: ${err.message}` : `${context} 錯誤: 未知錯誤`;
  } else {
    errorMessage = `${context} 錯誤: 未知錯誤`;
  }
  error.value = errorMessage;
};

// 載入時代模型
const loadEraModel = async (eraId: number) => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const era = eras.find(e => e.id === eraId);
    if (!era) {
      throw new Error(`找不到時代 ID: ${eraId}`);
    }
    
    if (!scene) {
      scene = new Scene(container.value!);
    }
    
    await scene.loadModel(
      era.modelPath,
      era.modelScale,
      era.cameraPosition,
      era.cameraTarget
    );
    
    // 直接使用測試資料
    const testScientists = [
      {
        id: 1,
        name: "安東尼·拉瓦錫",
        era: 1,
        description: "法國化學家，被稱為現代化學之父。",
        position: { x: -2, y: 0, z: 0 },
        model_path: "/models/chemists/lavoisier.glb",
        birth_year: 1743,
        death_year: 1827,
        portrait_path: "/images/portraits/lavoisier.jpg",
        discoveries: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "德米特里·門捷列夫",
        era: 2,
        description: "俄羅斯化學家，創建了元素週期表。",
        position: { x: 2, y: 0, z: 0 },
        model_path: "/models/chemists/mendeleev.glb",
        birth_year: 1834,
        death_year: 1907,
        portrait_path: "/images/portraits/mendeleev.jpg",
        discoveries: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: "瑪麗·居禮",
        era: 3,
        description: "波蘭裔法國物理學家和化學家，發現了鐳和釙元素。",
        position: { x: 0, y: 0, z: 0 },
        model_path: "/models/chemists/curie.glb",
        birth_year: 1867,
        death_year: 1934,
        portrait_path: "/images/portraits/curie.jpg",
        discoveries: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    const testEvents = [
      {
        id: 1,
        title: "發現氧氣",
        description: "拉瓦錫通過實驗證明了氧氣在燃燒中的作用。",
        year: 1774,
        chemist: 1,
        event_type: "discovery",
        location: "法國巴黎"
      },
      {
        id: 2,
        title: "發表元素週期表",
        description: "門捷列夫發表了第一版元素週期表。",
        year: 1869,
        chemist: 2,
        event_type: "publication",
        location: "俄羅斯聖彼得堡"
      },
      {
        id: 3,
        title: "發現鐳元素",
        description: "瑪麗·居禮和皮埃爾·居禮發現了鐳元素。",
        year: 1898,
        chemist: 3,
        event_type: "discovery",
        location: "法國巴黎"
      }
    ];
    
    // 根據當前時代過濾化學家
    scientists.value = testScientists.filter(s => s.era === eraId);
    events.value = testEvents.filter(e => {
      const chemist = testScientists.find(s => s.id === e.chemist);
      return chemist && chemist.era === eraId;
    });
    
    // 清除場景中的化學家模型
    if (scene) {
      scene.clearScene();
    }
    
    // 添加當前時代的化學家模型
    for (const scientist of scientists.value) {
      try {
        const config: ChemistModelConfig = {
          id: scientist.id,
          name: scientist.name,
          modelPath: scientist.model_path,
          position: new THREE.Vector3(scientist.position.x, scientist.position.y, scientist.position.z),
          scale: new THREE.Vector3(0.5, 0.5, 0.5),
          portraitPath: scientist.portrait_path,
          bio: scientist.description,
          birth_year: scientist.birth_year,
          death_year: scientist.death_year,
          era: scientist.era,
          description: scientist.description
        };
        
        scene.addChemist(config);
      } catch (error) {
        console.error('添加化學家模型失敗:', error);
        handleError(error, '添加化學家模型');
      }
    }
  } catch (modelError) {
    console.error('模型載入失敗:', modelError);
    handleError(modelError, '模型載入');
  } finally {
    isLoading.value = false;
  }
};

const navigateToEra = (eraId: number) => {
  if (eraId >= 1 && eraId <= totalEras) {
    currentEra.value = eraId;
    router.push(`/era/${eraId}`);
  }
};

const getCameraIndicatorStyle = (preset: CameraPreset) => {
  // 將相機位置轉換為預覽圖中的位置
  const scale = 0.1; // 縮放因子
  const centerX = 50; // 預覽圖中心點 X
  const centerY = 50; // 預覽圖中心點 Y
  
  const x = centerX + preset.position.x * scale;
  const y = centerY - preset.position.z * scale; // 注意 Y 和 Z 的轉換
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${Math.atan2(preset.position.x, preset.position.z) * (180 / Math.PI)}deg)`
  };
};

// 載入化學家數據
const loadScientists = async (eraId: number) => {
  try {
    console.log('開始載入化學家數據，時代ID:', eraId);
    const response = await fetchScientists(eraId);
    console.log('API 響應:', response);
    
    if (Array.isArray(response)) {
      console.log('化學家數據:', response);
      scientists.value = response as Chemist[];
      return response;
    } else {
      console.warn('API 響應格式不正確:', response);
      scientists.value = [];
      return [];
    }
  } catch (error) {
    console.error('載入化學家數據失敗:', error);
    handleError(error, '載入化學家數據');
    scientists.value = [];
    return [];
  }
};

// 添加化學家模型
const addChemistModel = async (chemist: Chemist) => {
  if (!scene) return;
  
  try {
    const config: ChemistModelConfig = {
      id: chemist.id,
      name: chemist.name,
      modelPath: chemist.model_path,
      position: new THREE.Vector3(chemist.position.x, chemist.position.y, chemist.position.z),
      scale: new THREE.Vector3(1, 1, 1),
      portraitPath: chemist.portrait_path,
      bio: chemist.description,
      birth_year: chemist.birth_year,
      death_year: chemist.death_year,
      era: chemist.era,
      description: chemist.description
    };
    
    await scene.addChemist(config);
  } catch (error) {
    console.error('添加化學家模型失敗:', error);
    handleError(error, '添加化學家模型');
  }
};

// 初始化
onMounted(async () => {
  try {
    await loadEraModel(currentEra.value);
  } catch (error) {
    console.error('初始化失敗:', error);
    handleError(error, '初始化');
  }
});

// 清理
onUnmounted(() => {
  if (scene) {
    scene.dispose();
  }
});

// 化學家對話框相關
const closeChemistDialog = () => {
  showChemistDialog.value = false;
  selectedChemist.value = null;
};

// 添加選擇化學家的方法
const selectChemist = (chemist: Chemist) => {
  selectedChemist.value = chemist;
  showChemistDialog.value = true;
};
</script>

<style scoped>
.time-travel-view {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.main-content {
  display: flex;
  height: calc(100vh - 100px); /* 減去時間選擇器的高度 */
  padding: 20px;
  gap: 20px;
}

.scene-container {
  flex: 1;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-panel {
  width: 300px;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 16px;
}

.chemist-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chemist-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chemist-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.chemist-portrait {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.chemist-info {
  flex: 1;
}

.chemist-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.chemist-info p {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chemist-years {
  font-size: 0.8rem;
  color: #42b883;
}

.time-selector-container {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1rem;
  color: white;
  font-size: 1.2rem;
}

.error-toast {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1.2rem;
}

.error-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 0.5rem;
}

.error-close:hover {
  opacity: 0.8;
}
</style>