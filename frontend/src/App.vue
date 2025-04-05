<script setup lang="ts">
// 不需要額外的邏輯
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">ChronoChem</h1>
    </header>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* 全局樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
}

.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #42b883;
  text-align: center;
  letter-spacing: 0.5px;
}

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 確保 TimeTravelView 可以全屏顯示 */
.time-travel-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

/* 調整 TimeTravelView 的內容位置，避免被標題遮擋 */
.time-travel-view .scene-container {
  padding-top: 4rem;
}
</style>
