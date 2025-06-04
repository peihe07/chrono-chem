<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="app-title">ChronoChem</h1>
        <p class="tagline">探索化學發展的歷史，與偉大的化學家對話</p>
      </div>
      <img src="@/assets/logo.png" alt="ChronoChem Logo" class="logo" />
    </div>
  </header>
</template>

<script setup lang="ts">
// 移除不需要的程式碼
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
  overflow: visible;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  height: 75px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(44, 94, 44, 0.2));
  transition: all 0.3s ease;
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
}

.logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(44, 94, 44, 0.3));
}

.app-title {
  margin: 0;
  font-size: 1.8rem;
  color: #2c5e2c;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(44, 94, 44, 0.3);
}

.tagline {
  margin: 0;
  font-size: 1.2rem;
  color: #2c5e2c;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.8rem 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .logo {
    height: 65px;
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .app-title {
    font-size: 1.8rem;
  }

  .tagline {
    font-size: 0.9rem;
  }
}
</style> 