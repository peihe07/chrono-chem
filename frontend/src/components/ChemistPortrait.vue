<template>
  <div class="chemist-portrait-container" :class="{ 'is-loading': isLoading }">
    <img
      :src="currentPortraitPath"
      :alt="name"
      class="chemist-portrait"
      @load="onImageLoad"
      @error="onImageError"
    />
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  portraitPath: string;
  name: string;
}>();

const isLoading = ref(true);
const hasError = ref(false);

const defaultPortrait = '/images/portraits/default-chemist.jpg';

const currentPortraitPath = computed(() => {
  return hasError.value ? defaultPortrait : props.portraitPath;
});

const onImageLoad = () => {
  isLoading.value = false;
};

const onImageError = () => {
  console.warn(`無法載入圖片: ${props.portraitPath}`);
  hasError.value = true;
  isLoading.value = false;
};
</script>

<style scoped>
.chemist-portrait-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chemist-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.chemist-portrait-container:hover .chemist-portrait {
  transform: scale(1.05);
  filter: brightness(1.05);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 