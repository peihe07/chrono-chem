<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <h1>隱私政策</h1>
      <div class="last-updated">最後更新日期：2025年6月</div>

      <section class="privacy-section">
        <h2>1. 資料收集</h2>
        <p>ChronoChem 致力於保護您的隱私。我們收集的資料包括：</p>
        <ul>
          <li>基本使用數據（如訪問時間、瀏覽頁面）</li>
          <li>您提供的個人資料（如註冊時填寫的資訊）</li>
          <li>與化學家對話的內容（用於改進服務品質）</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>2. 資料使用</h2>
        <p>我們使用收集的資料來：</p>
        <ul>
          <li>提供和改進我們的服務</li>
          <li>分析使用模式以優化用戶體驗</li>
          <li>回應您的問題和請求</li>
          <li>發送重要的服務更新通知</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>3. 資料保護</h2>
        <p>我們採取以下措施保護您的資料：</p>
        <ul>
          <li>使用加密技術保護資料傳輸</li>
          <li>定期更新安全措施</li>
          <li>限制員工對個人資料的訪問權限</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>4. Cookie 使用</h2>
        <p>我們使用 Cookie 來：</p>
        <ul>
          <li>記住您的偏好設定</li>
          <li>分析網站使用情況</li>
          <li>提供更個人化的體驗</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>5. 您的權利</h2>
        <p>您有權：</p>
        <ul>
          <li>訪問您的個人資料</li>
          <li>更正不準確的資料</li>
          <li>要求刪除您的資料</li>
          <li>選擇退出某些資料收集</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>6. 聯絡我們</h2>
        <p>如果您對我們的隱私政策有任何疑問，請透過以下方式聯絡我們：</p>
        <ul>
          <li>電子郵件：y450376@gmail.com</li>
          <li>聯絡表單：<a href="/contact">聯絡我們</a></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 目前不需要額外的邏輯
</script>

<style scoped>
.privacy-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.privacy-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c5e2c;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.last-updated {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.privacy-section {
  margin-bottom: 2rem;
}

h2 {
  color: #2c5e2c;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f4f0;
  padding-bottom: 0.5rem;
}

p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  color: #333;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

a {
  color: #2c5e2c;
  text-decoration: none;
  transition: all 0.3s ease;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-page {
    padding: 1rem;
  }

  .privacy-container {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.3rem;
  }
}
</style> 