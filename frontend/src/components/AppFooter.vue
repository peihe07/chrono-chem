<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>關於 ChronoChem</h3>
        <p>探索化學發展的歷史，與偉大的化學家對話。</p>
      </div>
      <div class="footer-section">
        <h3>快速連結</h3>
        <ul>
          <li><a href="/about">關於我們</a></li>
          <li><a href="/contact">聯絡我們</a></li>
          <li><a href="/privacy">隱私政策</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>社群媒體</h3>
        <div class="social-links">
          <a href="#" class="social-link" title="Facebook">📘</a>
          <a href="#" class="social-link" title="Twitter">🐦</a>
          <a href="#" class="social-link" title="Instagram">📸</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} ChronoChem. 保留所有權利。</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background: #f0f4f0;
  border-top: 2px solid #2c5e2c;
  padding: 2rem 0 1rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-section h3 {
  color: #2c5e2c;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(44, 94, 44, 0.3);
}

.footer-section p {
  color: #2c5e2c;
  line-height: 1.6;
  margin: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #2c5e2c;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-section ul li a:hover {
  text-shadow: 0 0 5px rgba(44, 94, 44, 0.3);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #2c5e2c;
  font-size: 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  text-shadow: 0 0 5px rgba(44, 94, 44, 0.3);
  transform: translateY(-2px);
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1rem 2rem 0;
  border-top: 1px solid rgba(44, 94, 44, 0.2);
  text-align: center;
}

.footer-bottom p {
  color: #2c5e2c;
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .footer-section {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-bottom {
    padding: 1rem 1rem 0;
  }
}
</style> 