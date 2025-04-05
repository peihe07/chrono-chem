<template>
  <div class="era-view">
    <div class="era-content" v-if="store.sceneLoaded">
      <h1>1898 年 - 居里的時代</h1>
      <div class="scene-description">
        <p>這是瑪麗·居里發現鐳元素的時代。在這裡，您可以看到她進行放射性研究的實驗室。</p>
      </div>
      <div class="chemist-interaction">
        <div v-if="store.selectedChemist === '瑪麗·居里'" class="interaction-area">
          <ChemistDialog
            :show="true"
            :chemist="chemistConfig"
            @update:show="handleDialogClose"
            @send-message="handleSendMessage"
          />
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <p>正在載入場景...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTimeTravelStore } from '@/store/timeTravel'
import ChemistDialog from '@/components/ChemistDialog.vue'
import type { ChemistModelConfig } from '@/types'
import { Vector3 } from 'three'

const store = useTimeTravelStore()

const chemistConfig: ChemistModelConfig = {
  name: '瑪麗·居里',
  era: 1898,
  description: '波蘭裔法國物理學家和化學家，發現了鐳和釙元素，是第一位獲得諾貝爾獎的女性。',
  position: new Vector3(-2, 0, 0),
  birth_year: 1867,
  death_year: 1934,
  portrait_path: 'portraits/curie.jpg',
  model_path: 'models/curie.glb'
}

const handleDialogClose = (show: boolean) => {
  if (!show) {
    store.deselectChemist()
  }
}

const handleSendMessage = (message: string) => {
  store.addChatMessage('瑪麗·居里', {
    role: 'user',
    content: message
  })
}

onMounted(() => {
  store.setYear(1898)
})
</script>

<style scoped>
.era-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.era-content {
  padding: 2rem;
}

.scene-description {
  margin: 2rem 0;
  font-size: 1.2rem;
  line-height: 1.6;
}

.chemist-interaction {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  color: #666;
}
</style> 