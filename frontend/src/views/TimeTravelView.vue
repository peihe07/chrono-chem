<template>
  <div class="time-travel-view">
    <div class="main-content">
      <!-- 時間選擇器移到上方 -->
      <div class="time-selector-container">
        <TimeSelector v-model:currentEraId="currentEra" />
      </div>
      <!-- 場景上方顯示科學家對話框，靠右 -->
      <div v-if="selectedChemist" class="chemist-dialog-top-right">
        <button class="toggle-btn" @click="toggleDialog">
          {{ isDialogCollapsed ? '展開對話' : '收合對話' }}
        </button>
        <ChemistDialog
          v-show="!isDialogCollapsed"
          :show="true"
          :chemist="selectedChemist"
          :is-collapsed="isDialogCollapsed"
          @close="closeChemistDialog"
        />
      </div>
      <div ref="container" class="scene-container"></div>
    </div>
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
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as THREE from 'three';
import { Scene } from '@/threejs/scene';
import { eras } from '@/config/eras';
import type { Chemist, HistoricalEvent } from '@/types/index';
import type { ChatMessage } from '@/api/chemists';
import TimeSelector from '@/components/TimeSelector.vue';
import ChemistDialog from '@/components/ChemistDialog.vue';

const container = ref<HTMLElement | null>(null);
const currentEra = ref<number>(1);
const isLoading = ref(false);
const messages = ref<ChatMessage[]>([]);

// 測試資料
const testScientists: Chemist[] = [
  {
    id: 1,
    name: "安東尼·拉瓦錫",
    era: 1,
    description: "法國化學家，被譽為「現代化學之父」，他徹底改變了人類對化學反應的理解。\n拉瓦錫最著名的貢獻是推翻了「燃素說」，並提出燃燒其實是一種與氧氣結合的反應。\n他首創化學反應的質量守恆定律：「在一個封閉系統中，反應前後的總質量保持不變」，為化學計算奠定基礎。\n拉瓦錫不僅是實驗科學家，也是一位制度改革者，推動標準化化學命名法，使化學語言更加科學與一致。\n不幸的是，他在法國大革命期間被處以死刑，但他的科學遺產至今仍深深影響著化學世界。",
    position_x: -2,
    position_y: 0,
    position_z: 0,
    model_path: "/models/chemists/lavoisier.glb",
    birth_year: 1743,
    death_year: 1827,
    portrait_path: "/images/portraits/lavoisier.jpg",
    events: [],
    chat_history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "德米特里·門捷列夫",
    era: 2,
    description: "俄羅斯化學家，被譽為元素週期表之父。\n他在1869年提出了第一張有系統的元素週期表，將已知元素按照原子量大小與化學性質週期性排列。\n令人驚訝的是，他大膽地預測了當時尚未發現的元素及其性質，如鍺、鎵與鍶，後來的實驗也證實了他的預測準確無誤。",
    position_x: 2,
    position_y: 0,
    position_z: 0,
    model_path: "/models/chemists/mendeleev.glb",
    birth_year: 1834,
    death_year: 1907,
    portrait_path: "/images/portraits/mendeleev.jpg",
    events: [],
    chat_history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "瑪麗·居禮",
    era: 3,
    description: "波蘭裔法國物理學家和化學家，以對放射性現象的開創性研究聞名於世。\n她是歷史上第一位獲得諾貝爾獎的女性，也是唯一一位同時獲得物理學獎（1903）與化學獎（1911）的科學家。\n瑪麗·居里與丈夫皮埃爾·居里一同發現了釙（Polonium）與鐳（Radium）兩種放射性元素，並開創了放射化學這個全新領域。",
    position_x: 0,
    position_y: 0,
    position_z: 0,
    model_path: "/models/chemists/curie.glb",
    birth_year: 1867,
    death_year: 1934,
    portrait_path: "/images/portraits/curie.jpg",
    events: [],
    chat_history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// 測試事件
const testEvents: HistoricalEvent[] = [
  {
    id: "1",
    title: "發現氧氣",
    description: "拉瓦錫通過實驗證明了氧氣在燃燒中的作用。",
    year: 1774,
    event_type: "discovery",
    image_path: "/images/events/oxygen.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "發表元素週期表",
    description: "門捷列夫發表了第一版元素週期表。",
    year: 1869,
    event_type: "publication",
    image_path: "/images/events/periodic_table.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "發現鐳元素",
    description: "瑪麗·居禮和皮埃爾·居禮發現了鐳元素。",
    year: 1898,
    event_type: "discovery",
    image_path: "/images/events/radium.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// 監聽 currentEra 的變化
watch(currentEra, async (newEraId) => {
  console.log('時代變更:', newEraId);
  await loadEraModel(newEraId);
});

const events = ref<HistoricalEvent[]>([]);
const scientists = ref<Chemist[]>([]);

let scene: Scene | null = null;
const error = ref<string>('');

// 化學家相關
const showChemistDialog = ref<boolean>(false);
const selectedChemist = ref<Chemist | null>(null);
const isDialogCollapsed = ref(false);

// 處理滾動事件
const handleScroll = () => {
  isDialogCollapsed.value = true;
};

// 載入聊天歷史記錄
const loadChatHistory = async () => {
  if (!selectedChemist.value) return;
  try {
    const response = await fetch(`/api/chemists/${selectedChemist.value.id}/chat-history/`);
    if (!response.ok) {
      throw new Error('載入聊天記錄失敗');
    }
    const data = await response.json();
    messages.value = data;
  } catch (err) {
    handleError(err, '載入聊天記錄');
  }
};

// 添加歡迎訊息
const addWelcomeMessage = () => {
  if (messages.value.length === 0 && selectedChemist.value) {
    messages.value.push({
      role: 'assistant',
      content: `您好，我是${selectedChemist.value.name}。有什麼我可以幫助您的嗎？`,
      timestamp: Date.now().toString()
    });
  }
};

// 切換對話框狀態
const toggleDialog = async () => {
  isDialogCollapsed.value = !isDialogCollapsed.value;
  if (!isDialogCollapsed.value && selectedChemist.value) {
    // 當展開對話框時，初始化聊天
    try {
      await loadChatHistory();
      addWelcomeMessage();
    } catch (err) {
      handleError(err, '初始化聊天');
    }
  }
};

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
      if (!container.value) {
        throw new Error('找不到場景容器元素');
      }
      scene = new Scene(container.value);
      console.log('場景已創建');
    }
    
    console.log('開始載入模型:', era.modelPath);
    
    // 調整相機設置
    const cameraPosition = new THREE.Vector3(
      era.cameraPosition.x,
      era.cameraPosition.y,
      era.cameraPosition.z
    );
    
    const cameraTarget = new THREE.Vector3(
      era.cameraTarget?.x || 0,
      era.cameraTarget?.y || 0,
      era.cameraTarget?.z || 0
    );
    
    // 調整模型縮放
    const modelScale = new THREE.Vector3(
      era.modelScale.x,
      era.modelScale.y,
      era.modelScale.z
    );
    
    await scene.loadModel(
      era.modelPath,
      modelScale,
      cameraPosition,
      cameraTarget
    );
    console.log('模型載入完成');
    
    // 根據當前時代過濾化學家
    scientists.value = testScientists.filter(s => s.era === eraId).map(s => ({
      id: s.id,
      name: s.name,
      era: s.era,
      description: s.description,
      position_x: s.position_x,
      position_y: s.position_y, 
      position_z: s.position_z,
      model_path: s.model_path,
      birth_year: s.birth_year,
      death_year: s.death_year,
      portrait_path: s.portrait_path,
      events: s.events,
      chat_history: s.chat_history,
      created_at: s.created_at,
      updated_at: s.updated_at
    }));

    events.value = testEvents.filter(e => {
      const chemist = testScientists.find(s => s.id === parseInt(e.id));
      return chemist && chemist.era === eraId;
    });
    
    // 載入完畢後立即顯示第一位化學家對話框
    if (scientists.value.length > 0) {
      const firstChemist = scientists.value[0];
      if (firstChemist) {
        selectChemist(firstChemist);
        isDialogCollapsed.value = false;
      }
    }
  } catch (modelError) {
    console.error('模型載入失敗:', modelError);
    handleError(modelError, '模型載入');
  } finally {
    isLoading.value = false;
  }
};

// 載入化學家數據

// 添加化學家模型

// 初始化
onMounted(async () => {
  try {
    // 初始化第一個化學家的對話框，但保持收合狀態
    const firstChemist = testScientists.find(s => s.era === currentEra.value);
    if (firstChemist) {
      selectedChemist.value = firstChemist;
      isDialogCollapsed.value = true; // 設置為收合狀態
    }

    // 載入初始時代模型
    await loadEraModel(currentEra.value);
    window.addEventListener('chemist-selected', chemistSelectedHandler as unknown as EventListener);
    window.addEventListener('scroll', handleScroll);
  } catch (err) {
    handleError(err, '初始化');
  }
});

// 清理
onUnmounted(() => {
  if (scene) {
    console.log('清理場景');
    scene.dispose();
    scene = null;
  }
  window.removeEventListener('chemist-selected', chemistSelectedHandler as unknown as EventListener);
  window.removeEventListener('scroll', handleScroll);
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
  isDialogCollapsed.value = false;
};

// 化學家選擇處理器
const chemistSelectedHandler = (event: CustomEvent) => {
  const chemist = event.detail;
  selectedChemist.value = chemist;
  isDialogCollapsed.value = true; // 確保對話框是收合的
  // 移除自動展開對話框的邏輯
};
</script>

<style scoped>
.time-travel-view {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa;
}

.main-content {
  position: relative;
  padding: 0;
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-selector-container {
  position: relative;
  width: 100%;
  padding: 16px 24px;
  margin: 0;
  height: 75px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-container {
  flex: 1;
  width: calc(100% - 48px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  margin: 0 24px 24px 24px;
  padding: 0;
  transition: all 0.3s ease;
}

.scene-container:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.chemist-dialog-top-right {
  width: auto;
  max-width: 580px;
  position: absolute;
  top: 90px;
  right: 20px;
  z-index: 3000;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
}

.toggle-btn {
  background: #fff;
  color: #42b883;
  border: 1px solid #42b883;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  z-index: 3100;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  writing-mode: vertical-lr;
  text-orientation: upright;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: #42b883;
  color: white;
  transform: translateX(-2px);
}

/* 新增對話框容器樣式 */
.chemist-dialog-top-right > :last-child {
  margin-right: 60px;
  margin-top: 27px;
  margin-left: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.error-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 87, 87, 0.95);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(255, 87, 87, 0.3);
  backdrop-filter: blur(4px);
}

.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
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
  padding: 0 8px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.error-close:hover {
  opacity: 1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>