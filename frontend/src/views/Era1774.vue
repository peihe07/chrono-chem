<template>
  <div class="era-view">
    <div class="era-content" v-if="store.sceneLoaded">
      <h1>1774 年 - 拉瓦錫的時代</h1>
      <div class="scene-description">
        <p>這是安東尼·拉瓦錫發現氧氣的時代。在這裡，您可以看到他進行著名的燃燒實驗。</p>
      </div>
      <div class="chemist-interaction">
        <div v-if="store.selectedChemist === '安東尼·拉瓦錫'" class="interaction-area">
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
import { onMounted, ref } from 'vue'
import { useTimeTravelStore } from '@/store/timeTravel'
import ChemistDialog from '@/components/ChemistDialog.vue'
import type { ChemistModelConfig } from '@/types'
import { Vector3 } from 'three'

const store = useTimeTravelStore()

const chemistConfig: ChemistModelConfig = {
  name: '安東尼·拉瓦錫',
  era: 1774,
  description: '法國化學家，被稱為現代化學之父。他發現了氧氣在燃燒中的作用，並建立了質量守恆定律。',
  position: new Vector3(0, 0, 0),
  birth_year: 1743,
  death_year: 1827,
  portrait_path: 'portraits/lavoisier.jpg',
  model_path: 'models/lavoisier.glb'
}

const handleDialogClose = (show: boolean) => {
  if (!show) {
    store.deselectChemist()
  }
}

const handleSendMessage = (message: string) => {
  store.addChatMessage('安東尼·拉瓦錫', {
    role: 'user',
    content: message
  })
}

onMounted(() => {
  store.setYear(1774)
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