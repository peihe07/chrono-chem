<template>
  <div ref="sceneContainer" class="w-full h-full" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initScene } from '@/threejs/scene';

const sceneContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (sceneContainer.value) {
    initScene(sceneContainer.value, '/models/priestley_lab.glb');
  }
});
</script>

<style scoped>
div {
  width: 100vw;
  height: 100vh;
}
</style>