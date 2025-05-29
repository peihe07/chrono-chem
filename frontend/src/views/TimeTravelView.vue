<template>
  <div class="time-travel-view">
    <div ref="container" class="scene-container"></div>
    
    <div class="time-selector-container">
      <TimeSelector v-model:currentEraId="currentEra" />
    </div>
    
    <div class="camera-controls">
      <div class="control-panel" :class="{ expanded: isControlPanelExpanded }">
        <div class="panel-header" @click="toggleControlPanel">
          <span>相機控制</span>
          <button class="toggle-button">{{ isControlPanelExpanded ? '收起' : '展開' }}</button>
        </div>
        
        <div class="panel-content" v-if="isControlPanelExpanded">
          <div class="preset-buttons">
            <button 
              v-for="preset in cameraPresets" 
              :key="preset.name"
              @click="switchToPreset(preset.name)"
              class="preset-button"
            >
              {{ preset.name }}
            </button>
          </div>
          
          <button class="reset-button" @click="resetCamera">重置視角</button>
        </div>
      </div>
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
import { fetchEras, fetchEvents, fetchScientists } from '@/api';
import type { Chemist } from '@/types/index';
import TimeSelector from '@/components/TimeSelector.vue';
import ChemistDialog from '@/components/ChemistDialog.vue';
import type { ChemistModelConfig } from '@/threejs/ChemistModel';
import axios from 'axios';

const router = useRouter();
const container = ref<HTMLElement | null>(null);
const currentEra = ref<number>(1);
const isLoading = ref(false);
const showPanel = ref(true);
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
const cameraPresets = ref<CameraPreset[]>([]);
const isControlPanelExpanded = ref<boolean>(false);

// 化學家相關
const showChemistDialog = ref<boolean>(false);
const selectedChemist = ref<Chemist | null>(null);

// 全局錯誤處理
const handleError = (err: unknown, context: string) => {
  console.error(`${context} 錯誤:`, err);
  let errorMessage = '發生未知錯誤';
  
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  } else if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as { response?: { data?: any } };
    if (axiosError.response?.data) {
      if (typeof axiosError.response.data === 'string') {
        errorMessage = axiosError.response.data;
      } else if (typeof axiosError.response.data === 'object') {
        errorMessage = axiosError.response.data.message || axiosError.response.data.detail || '請求失敗';
      }
    }
  }
  
  error.value = `${context}: ${errorMessage}`;
  
  // 5秒後自動清除錯誤訊息
  setTimeout(() => {
    error.value = '';
  }, 5000);
};

onMounted(async () => {
  console.log('開始初始化場景...');
  
  if (!container.value) {
    console.error('找不到容器元素');
    error.value = '無法初始化場景：找不到容器元素';
    return;
  }

  try {
    // 1. 初始化場景
    console.log('創建場景實例...');
    scene = new Scene(container.value);
    console.log('場景實例創建成功');
    
    // 2. 獲取相機預設值
    console.log('獲取相機預設值...');
    cameraPresets.value = scene.getCameraPresets();
    console.log('相機預設值:', cameraPresets.value);
    
    // 3. 載入時代資料
    console.log('載入時代資料...');
    let eraData;
    try {
      const response = await fetchEras();
      eraData = response.data;
      console.log('時代資料載入成功：', eraData);
    } catch (apiError) {
      console.error('載入時代資料失敗:', apiError);
      console.log('使用本地配置繼續...');
      eraData = eras;
    }
    
    // 4. 載入初始時代模型
    console.log('載入初始時代模型...');
    await loadEraModel(currentEra.value);
    
    // 5. 載入化學家數據
    console.log('載入化學家數據...');
    await loadScientists(currentEra.value);
    
    // 6. 添加化學家模型
    console.log('添加化學家模型...');
    await addChemistModels();
    
    // 7. 添加事件監聽器
    console.log('添加事件監聽器...');
    window.addEventListener('resize', handleResize);
    window.addEventListener('chemist-selected', (event: unknown) => {
      const customEvent = event as CustomEvent<ChemistModelConfig>;
      handleChemistSelected(customEvent);
    });
    
    console.log('場景初始化完成');
  } catch (err) {
    console.error('場景初始化失敗:', err);
    handleError(err, '場景初始化');
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  scene?.dispose();
  window.removeEventListener('chemist-selected', (event: unknown) => {
    const customEvent = event as CustomEvent<ChemistModelConfig>;
    handleChemistSelected(customEvent);
  });
});

const handleResize = () => {
  scene?.resize();
};

const startLoading = () => {
  isLoading.value = true;
  error.value = ''; // 清除之前的錯誤
};

const stopLoading = () => {
  isLoading.value = false;
};

async function loadEraModel(eraId: number) {
  startLoading();
  console.log('開始載入時代模型，ID:', eraId);
  
  const era = eras.find(e => e.id === eraId);
  console.log('找到的時代配置:', era);
  
  if (!scene) {
    const errorMsg = '場景未初始化';
    console.error(errorMsg);
    handleError(new Error(errorMsg), '載入場景失敗');
    stopLoading();
    return;
  }
  
  if (!era) {
    const errorMsg = `找不到時代ID: ${eraId}`;
    console.error(errorMsg);
    handleError(new Error(errorMsg), '載入場景失敗');
    stopLoading();
    return;
  }

  try {
    console.log('準備載入模型，配置:', {
      modelPath: era.modelPath,
      modelScale: era.modelScale,
      cameraPosition: era.cameraPosition,
      cameraTarget: era.cameraTarget
    });
    
    // 檢查模型文件是否存在
    let response: Response;
    try {
      console.log('檢查模型文件:', era.modelPath);
      response = await fetch(era.modelPath);
      if (!response.ok) {
        throw new Error(`模型文件不存在: ${era.modelPath} (${response.status})`);
      }
      console.log('模型文件存在，開始載入...');
      
      // 檢查文件大小
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const fileSize = parseInt(contentLength);
        console.log('模型文件大小:', fileSize, 'bytes');
        if (fileSize > 100 * 1024 * 1024) { // 100MB
          console.warn('模型文件較大，可能需要較長載入時間');
        }
      }
    } catch (fetchError) {
      console.error('檢查模型文件失敗:', fetchError);
      throw fetchError;
    }
    
    // 清除現有模型
    console.log('清除現有模型...');
    scene.clearScene();
    
    // 等待一小段時間確保場景已清除
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('開始載入新模型到場景...');
    try {
      await scene.loadModel(
        era.modelPath,
        era.modelScale,
        era.cameraPosition,
        era.cameraTarget
      );
      console.log('模型載入成功');
      
      // 移除重複的 currentEra 設置
      console.log('當前時代:', currentEra.value);
    } catch (modelLoadError) {
      console.error('模型載入到場景失敗:', modelLoadError);
      throw modelLoadError;
    }
    
    // 嘗試載入相關資料
    try {
      console.log('開始載入相關資料');
      const [eventsRes, scientistsRes] = await Promise.all([
        fetchEvents(eraId).catch(err => {
          console.error('載入事件資料失敗:', err);
          handleError(err, '載入事件資料');
          return { data: [] };
        }),
        fetchScientists(eraId).catch(err => {
          console.error('載入化學家資料失敗:', err);
          handleError(err, '載入化學家資料');
          return [];
        }),
      ]);
      
      if (eventsRes.data) {
        events.value = eventsRes.data as Event[];
        console.log('事件資料載入成功:', events.value.length, '條記錄');
      }
      
      if (Array.isArray(scientistsRes)) {
        scientists.value = scientistsRes as Chemist[];
        console.log('化學家資料載入成功:', scientists.value.length, '條記錄');
      }
      
      console.log('所有資料載入完成:', {
        events: events.value.length,
        scientists: scientists.value.length
      });
    } catch (apiError) {
      console.error('API 請求錯誤:', apiError);
      handleError(apiError, 'API 請求');
      console.log('使用空數據繼續...');
      events.value = [];
      scientists.value = [];
    }
  } catch (modelError: unknown) {
    console.error('模型載入失敗:', modelError);
    if (modelError instanceof Error) {
      handleError(modelError, '模型載入失敗');
    } else {
      handleError(new Error('未知錯誤'), '模型載入失敗');
    }
  } finally {
    isLoading.value = false;
  }
}

const navigateToEra = (eraId: number) => {
  if (eraId >= 1 && eraId <= totalEras) {
    currentEra.value = eraId;
    router.push(`/era/${eraId}`);
  }
};

const togglePanel = () => {
  showPanel.value = !showPanel.value;
};

const switchToPreset = (presetName: string) => {
  scene?.switchToPreset(presetName);
};

const resetCamera = () => {
  scene?.resetCamera();
};

const toggleControlPanel = () => {
  isControlPanelExpanded.value = !isControlPanelExpanded.value;
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
const addChemistModels = async () => {
  if (!scene) {
    console.error('場景未初始化');
    return;
  }

  console.log('添加化學家模型，數量:', scientists.value.length);
  
  for (const chemist of scientists.value) {
    console.log('處理化學家:', chemist);
    
    const chemistConfig: ChemistModelConfig = {
      id: chemist.id,
      name: chemist.name,
      position: new THREE.Vector3(
        chemist.position.x,
        chemist.position.y,
        chemist.position.z
      ),
      modelPath: chemist.model_path,
      portraitPath: chemist.portrait_path,
      bio: chemist.description,
      birth_year: chemist.birth_year,
      death_year: chemist.death_year,
      era: chemist.era,
      description: chemist.description
    };

    try {
      await scene.addChemist(chemistConfig);
      console.log('化學家模型添加成功:', chemist.name);
    } catch (error) {
      console.error('添加化學家模型失敗:', error);
      handleError(error, `添加化學家模型 ${chemist.name}`);
    }
  }
};

// 處理化學家選擇
const handleChemistSelected = (event: CustomEvent<ChemistModelConfig>) => {
  const chemist = scientists.value.find(s => s.id === event.detail.id);
  if (chemist) {
    selectedChemist.value = chemist;
    showChemistDialog.value = true;
  }
};

// 處理化學家訊息
const handleChemistMessage = async (message: string) => {
  if (!selectedChemist.value) return;
  
  try {
    console.log('發送訊息給化學家:', selectedChemist.value.name);
    const response = await axios.post(`/api/chemists/${selectedChemist.value.id}/send_message/`, {
      message: message
    });
    
    console.log('化學家回應:', response.data);
  } catch (error) {
    console.error('發送訊息失敗:', error);
  }
};

const closeChemistDialog = () => {
  showChemistDialog.value = false;
  selectedChemist.value = null;
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
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: url('../assets/header-bg.png') no-repeat center center;
  background-size: cover;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, rgba(38, 84, 124, 0.95), rgba(38, 84, 124, 0.85));
  backdrop-filter: blur(5px);
}

.logo {
  height: 40px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
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

.toggle-panel {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.98);
  padding: 0.8rem 0.4rem;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 11;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: none;
  transition: all 0.3s ease;
}

.toggle-panel:hover {
  background: rgba(255, 255, 255, 1);
}

.toggle-icon {
  font-size: 1.2rem;
  color: #42b883;
  display: block;
  transition: transform 0.3s ease;
}

.toggle-panel:hover .toggle-icon {
  transform: scale(1.1);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.era-data-panel {
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px 0 0 12px;
  padding: 1.8rem;
  width: 380px;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.15);
  z-index: 10;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: none;
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

.camera-controls {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 2;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 200px;
}

.camera-controls.collapsed {
  width: auto;
}

.camera-controls-header {
  padding: 0.8rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  user-select: none;
}

.camera-controls-title {
  font-weight: 600;
  color: #2c3e50;
}

.toggle-icon {
  color: #42b883;
  transition: transform 0.3s ease;
}

.camera-controls.collapsed .toggle-icon {
  transform: rotate(-90deg);
}

.camera-controls-content {
  padding: 1rem;
}

.camera-presets {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preset-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-item:hover {
  transform: translateX(5px);
}

.preset-preview {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.camera-indicator {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #42b883;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.camera-indicator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.camera-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 2px;
  background: #42b883;
  transform-origin: left center;
}

.camera-indicator.reset {
  background: #666;
}

.preset-button, .reset-button {
  flex: 1;
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.preset-button:hover, .reset-button:hover {
  background: #3aa876;
  transform: translateY(-1px);
}

.reset-button {
  background: #666;
}

.reset-button:hover {
  background: #555;
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

.control-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 200px;
  transition: all 0.3s ease;
}

.control-panel.expanded {
  width: 250px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #42b883;
  color: white;
  cursor: pointer;
}

.toggle-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.panel-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.preset-button {
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-button:hover {
  background: #e0e0e0;
}

.reset-button {
  padding: 8px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-button:hover {
  background: #3aa876;
}
</style>