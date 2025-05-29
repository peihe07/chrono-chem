import { ref } from 'vue'
import type { Chemist } from '@/types/index'

export function useInteraction() {
  const selectedChemist = ref<Chemist | null>(null)
  const isDetailVisible = ref(false)

  const handleChemistClick = (chemist: Chemist) => {
    selectedChemist.value = chemist
    isDetailVisible.value = true
  }

  const closeDetail = () => {
    isDetailVisible.value = false
    selectedChemist.value = null
  }

  const triggerAnimation = (type: 'discovery' | 'experiment') => {
    // TODO: 實作動畫邏輯
    console.log(`觸發${type}動畫`)
  }

  return {
    selectedChemist,
    isDetailVisible,
    handleChemistClick,
    closeDetail,
    triggerAnimation
  }
} 