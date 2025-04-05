<script setup lang="ts">
// 不需要額外的邏輯
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <img src="./assets/logo.png" alt="ChronoChem Logo" class="logo" />
        <h1 class="app-title">ChronoChem</h1>
      </div>
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F2F2F2;
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
  background: url('./assets/header-bg.png') no-repeat center center;
  background-size: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 90px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(to right, rgba(66, 184, 131, 0.95), rgba(38, 84, 124, 0.85));
  backdrop-filter: blur(5px);
}

.logo {
  height: 70px;
  width: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) brightness(1.2);
  transition: all 0.3s ease;
  opacity: 1;
  transform-origin: center;
}

.logo:hover {
  transform: scale(1.1);
  opacity: 1;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5)) brightness(1.3);
}

.app-title {
  font-family: 'Philosopher', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  top: 90px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 90px);
  z-index: 1;
}
</style>
