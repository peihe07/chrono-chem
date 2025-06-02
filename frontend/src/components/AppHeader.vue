<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">ChronoChem</h1>
      <div class="header-actions">
        <button class="theme-button" @click="toggleTheme" title="切換主題">
          <span class="icon">🌓</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isDarkTheme = ref(false);

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  // 這裡可以添加切換主題的邏輯
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #f0f4f0;
  border-bottom: 2px solid #2c5e2c;
  z-index: 1000;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(44, 94, 44, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 1.8rem;
  color: #2c5e2c;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(44, 94, 44, 0.3);
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.theme-button {
  background: none;
  border: 1px solid #2c5e2c;
  font-size: 1.2rem;
  color: #2c5e2c;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.theme-button:hover {
  background: rgba(44, 94, 44, 0.1);
  text-shadow: 0 0 5px rgba(44, 94, 44, 0.3);
}

.icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.8rem 1rem;
  }

  .app-title {
    font-size: 1.5rem;
  }
}
</style> 