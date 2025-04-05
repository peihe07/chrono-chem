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
      v-model:show="showChemistDialog" 
      :chemist="selectedChemist" 
      @send-message="handleChemistMessage"
    />
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

interface Scientist {
  id: number;
  name: string;
  birth_year: number;
  death_year: number;
  bio?: string;
  portrait_path?: string;
  model_path?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

const events = ref<Event[]>([]);
const scientists = ref<Scientist[]>([]);
const currentEraData = computed(() => {
  return eras.find(era => era.id === currentEra.value);
});

let scene: Scene | null = null;
const error = ref<string>('');
const cameraPresets = ref<CameraPreset[]>([]);
const isControlPanelExpanded = ref<boolean>(false);

// 化學家相關
const showChemistDialog = ref<boolean>(false);
const selectedChemist = ref<ChemistModelConfig | null>(null);

// 全局錯誤處理
const handleError = (err: unknown, context: string) => {
  console.error(`${context} 錯誤:`, err);
  if (err instanceof Error) {
    error.value = `${context}: ${err.message}`;
  } else {
    error.value = `${context}: 未知錯誤`;
  }
  // 3秒後清除錯誤訊息
  setTimeout(() => {
    error.value = '';
  }, 3000);
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
    await loadScientists();
    
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

async function loadEraModel(eraId: number) {
  error.value = '';  // 重置錯誤訊息
  console.log('開始載入時代模型，ID:', eraId);
  
  const era = eras.find(e => e.id === eraId);
  console.log('找到的時代配置:', era);
  
  if (!scene) {
    const errorMsg = '場景未初始化';
    console.error(errorMsg);
    handleError(new Error(errorMsg), '載入場景失敗');
    return;
  }
  
  if (!era) {
    const errorMsg = `找不到時代ID: ${eraId}`;
    console.error(errorMsg);
    handleError(new Error(errorMsg), '載入場景失敗');
    return;
  }

  isLoading.value = true;
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
          return { data: [] };
        }),
      ]);
      
      if (eventsRes.data) {
        events.value = eventsRes.data as Event[];
        console.log('事件資料載入成功:', events.value.length, '條記錄');
      }
      
      if (scientistsRes.data) {
        scientists.value = scientistsRes.data as Scientist[];
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
const loadScientists = async () => {
  try {
    console.log('開始載入化學家數據，時代ID:', currentEra.value);
    const response = await fetchScientists(currentEra.value);
    console.log('API 響應:', response);
    console.log('API 響應數據類型:', typeof response.data);
    console.log('API 響應數據結構:', JSON.stringify(response.data, null, 2));
    
    if (!response.data) {
      console.error('API 響應中沒有 data 字段');
      scientists.value = [];
      return;
    }
    
    // 如果 response.data 是對象而不是數組，嘗試提取數組
    let dataArray = response.data;
    if (typeof response.data === 'object' && !Array.isArray(response.data)) {
      console.log('嘗試從響應對象中提取數組...');
      const data = response.data as Record<string, any>;
      // 檢查常見的數據結構模式
      if (data.results && Array.isArray(data.results)) {
        dataArray = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        dataArray = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        dataArray = data.items;
      } else {
        // 如果找不到數組，將對象轉換為數組
        dataArray = Object.values(data);
      }
    }
    
    if (!Array.isArray(dataArray)) {
      console.error('無法獲取有效的數組數據:', typeof dataArray);
      scientists.value = [];
      return;
    }
    
    scientists.value = dataArray;
    console.log('化學家數據載入成功:', {
      count: scientists.value.length,
      data: scientists.value
    });
  } catch (error) {
    console.error('載入化學家數據失敗:', error);
    handleError(error, '載入化學家數據');
    scientists.value = [];
  }
};

// 添加化學家模型
const addChemistModels = async () => {
  if (!scene) {
    console.error('場景未初始化，無法添加化學家模型');
    return;
  }
  
  console.log('化學家數據:', scientists.value);
  
  if (!Array.isArray(scientists.value)) {
    console.error('化學家數據格式錯誤，預期是數組但收到:', typeof scientists.value);
    scientists.value = [];  // 重置為空數組
    return;
  }
  
  if (scientists.value.length === 0) {
    console.log('沒有化學家數據，跳過添加化學家模型');
    return;
  }
  
  console.log('開始添加化學家模型，共', scientists.value.length, '個');
  
  for (const scientist of scientists.value) {
    try {
      if (!scientist || typeof scientist !== 'object') {
        console.error('無效的化學家數據:', scientist);
        continue;
      }
      
      console.log('添加化學家模型:', scientist.name);
      const chemistConfig: ChemistModelConfig = {
        id: scientist.id,
        name: scientist.name,
        position: new THREE.Vector3(
          scientist.position.x,
          scientist.position.y,
          scientist.position.z
        ),
        birth_year: scientist.birth_year,
        death_year: scientist.death_year,
        bio: scientist.bio || '',
        portraitPath: scientist.portrait_path || '',
        modelPath: scientist.model_path || ''
      };
      
      await scene.addChemist(chemistConfig);
      console.log('化學家模型添加成功:', scientist.name);
    } catch (error) {
      console.error(`添加化學家 ${scientist.name} 失敗:`, error);
      handleError(error, `添加化學家 ${scientist.name}`);
    }
  }
  
  console.log('化學家模型添加完成');
};

// 處理化學家選擇
const handleChemistSelected = (event: CustomEvent<ChemistModelConfig>) => {
  selectedChemist.value = event.detail;
  showChemistDialog.value = true;
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
    // TODO: 在對話框中顯示回應
  } catch (error) {
    console.error('發送訊息失敗:', error);
    // TODO: 顯示錯誤訊息給用戶
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