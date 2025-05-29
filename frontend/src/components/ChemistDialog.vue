<template>
  <div v-if="show" class="dialog-overlay" @click="close">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>{{ chemist.name }}</h2>
        <button class="close-button" @click="close">×</button>
      </div>
      <div class="dialog-body">
        <div class="chemist-portrait">
          <img :src="chemist.portrait_path" :alt="chemist.name">
        </div>
        <div class="chemist-details">
          <div class="chemist-years">{{ chemist.birth_year }} - {{ chemist.death_year }}</div>
          <p class="chemist-description">{{ chemist.description }}</p>
          <div class="chemist-discoveries" v-if="chemist.discoveries && chemist.discoveries.length > 0">
            <h3>重要發現</h3>
            <ul>
              <li v-for="discovery in chemist.discoveries" :key="discovery.id">
                {{ discovery.name }} ({{ discovery.year }})
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 對話區域 -->
      <div class="chat-section">
        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index" 
            class="message"
            :class="{ 'user-message': message.role === 'user' }"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <div class="chat-input">
          <input 
            v-model="userInput" 
            @keyup.enter="sendMessage"
            placeholder="輸入您的問題..."
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
            {{ isLoading ? '發送中...' : '發送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import type { Chemist } from '@/types/index';
import { sendMessage as sendChatMessage } from '@/api/chemists';
import type { ChatMessage } from '@/api/chemists';

const props = defineProps<{
  show: boolean;
  chemist: Chemist;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const userInput = ref('');
const messages = ref<ChatMessage[]>([]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// 格式化時間戳
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 初始化歡迎訊息
onMounted(() => {
  if (props.show) {
    addWelcomeMessage();
  }
});

// 監聽對話框顯示狀態
watch(() => props.show, (newValue) => {
  if (newValue) {
    messages.value = [];
    addWelcomeMessage();
  }
});

// 添加歡迎訊息
const addWelcomeMessage = () => {
  messages.value.push({
    role: 'assistant',
    content: `您好，我是${props.chemist.name}。有什麼我可以幫助您的嗎？`,
    timestamp: Date.now()
  });
};

// 發送訊息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;
  
  const message = userInput.value.trim();
  userInput.value = '';
  
  // 添加用戶訊息
  const userMessage: ChatMessage = {
    role: 'user',
    content: message,
    timestamp: Date.now()
  };
  messages.value.push(userMessage);
  
  // 設置載入狀態
  isLoading.value = true;
  
  try {
    // 發送訊息到 API
    const response = await sendChatMessage(props.chemist.id, message);
    
    // 添加化學家回應
    messages.value.push(response.assistant_message);
    
    // 滾動到最新訊息
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  } catch (err) {
    console.error('發送訊息失敗:', err);
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我現在無法回應您的問題。請稍後再試。',
      timestamp: Date.now()
    });
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: dialogFadeIn 0.3s ease;
}

.dialog-header {
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #42b883;
}

.dialog-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  gap: 24px;
  flex: 0 0 auto;
  max-height: none;
  overflow: visible;
}

.chemist-portrait {
  flex: 0 0 200px;
}

.chemist-portrait img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chemist-details {
  flex: 1;
  min-width: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.chemist-years {
  font-size: 1.1rem;
  color: #42b883;
  margin-bottom: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chemist-years::before {
  content: "•";
  color: #42b883;
  font-size: 1.5rem;
}

.chemist-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b883;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-height: none;
  overflow: visible;
}

.chemist-discoveries {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.chemist-discoveries h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chemist-discoveries h3::before {
  content: "•";
  color: #42b883;
  font-size: 1.5rem;
}

.chemist-discoveries ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chemist-discoveries li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chemist-discoveries li::before {
  content: "•";
  color: #42b883;
  font-size: 1.2rem;
}

.chemist-discoveries li:last-child {
  border-bottom: none;
}

/* 對話區域樣式 */
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 80%;
  align-self: flex-start;
}

.message.user-message {
  align-self: flex-end;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2c3e50;
}

.user-message .message-content {
  background: #42b883;
  color: white;
}

.message-time {
  font-size: 0.8rem;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.chat-input input:focus {
  outline: none;
  border-color: #42b883;
}

.chat-input button {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.chat-input button:hover:not(:disabled) {
  background: #3aa876;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .dialog-content {
    max-width: 95vw;
  }

  .dialog-header {
    padding: 8px 16px;
  }

  .dialog-header h2 {
    font-size: 1.1rem;
  }

  .close-button {
    font-size: 1.1rem;
  }

  .dialog-body {
    flex-direction: column;
  }

  .chemist-portrait {
    flex: 0 0 auto;
    max-width: 200px;
    margin: 0 auto;
  }
  
  .message {
    max-width: 90%;
  }
}

/* 自適應高度 */
@media (max-height: 600px) {
  .dialog-content {
    max-height: 95vh;
  }

  .dialog-header {
    padding: 8px 16px;
  }

  .dialog-header h2 {
    font-size: 1rem;
  }

  .close-button {
    font-size: 1rem;
  }

  .dialog-body {
    padding: 12px;
  }

  .chemist-portrait {
    flex: 0 0 150px;
  }
  
  .chat-messages {
    padding: 12px;
  }
  
  .chat-input {
    padding: 12px;
  }
}
</style> 