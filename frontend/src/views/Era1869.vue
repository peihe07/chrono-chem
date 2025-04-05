<template>
  <div class="era-view">
    <div class="era-content" v-if="store.sceneLoaded">
      <h1>1869 年 - 門捷列夫的時代</h1>
      <div class="scene-description">
        <p>這是德米特里·門捷列夫發表元素週期表的時代。在這裡，您可以看到他如何組織和預測元素。</p>
      </div>
      <div class="chemist-interaction">
        <div v-if="store.selectedChemist === '德米特里·門捷列夫'" class="interaction-area">
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
  name: '德米特里·門捷列夫',
  era: 1869,
  description: '俄羅斯化學家，創建了元素週期表，為現代化學奠定了基礎。',
  position: new Vector3(2, 0, 0),
  birth_year: 1834,
  death_year: 1907,
  portrait_path: 'portraits/mendeleev.jpg',
  model_path: 'models/mendeleev.glb'
}

const handleDialogClose = (show: boolean) => {
  if (!show) {
    store.deselectChemist()
  }
}

const handleSendMessage = (message: string) => {
  store.addChatMessage('德米特里·門捷列夫', {
    role: 'user',
    content: message
  })
}

onMounted(() => {
  store.setYear(1869)
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