<template>
  <Transition name="fade">
    <div v-if="show" class="chemist-dialog-overlay" @click="closeDialog">
      <div class="chemist-dialog" @click.stop>
        <div class="dialog-header">
          <div class="chemist-info">
            <h2 class="chemist-name">{{ chemist.name }}</h2>
            <div class="chemist-years">{{ chemist.birth_year }} - {{ chemist.death_year || '現今' }}</div>
          </div>
          <button class="close-button" @click="closeDialog">×</button>
        </div>
        
        <div class="dialog-content">
          <div class="chemist-portrait">
            <img :src="chemist.portrait_path || '/images/default-portrait.png'" :alt="chemist.name" />
          </div>
          
          <div class="chemist-bio">
            <p>{{ chemist.description }}</p>
          </div>
          
          <div class="chat-container">
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

        <!-- 錯誤提示 -->
        <div v-if="error" class="error-toast">
          <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">{{ error }}</span>
          </div>
          <button class="error-close" @click="error = ''">×</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { sendMessage as sendChatMessage } from '@/api/chemists';
import type { Chemist, ChatMessage } from '@/api/chemists';

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
const error = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

// 格式化時間戳
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 處理錯誤
const handleError = (err: unknown, context: string) => {
  console.error(`${context} 錯誤:`, err);
  let errorMessage = '發生未知錯誤';
  
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  } else if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as { response?: { data?: any } };
    if (axiosError.response?.data) {
      if (typeof axiosError.response.data === 'string') {
        errorMessage = axiosError.response.data;
      } else if (typeof axiosError.response.data === 'object') {
        errorMessage = axiosError.response.data.message || axiosError.response.data.detail || '請求失敗';
      }
    }
  }
  
  error.value = `${context}: ${errorMessage}`;
  
  // 5秒後自動清除錯誤訊息
  setTimeout(() => {
    error.value = '';
  }, 5000);
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
    error.value = ''; // 清除錯誤訊息
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
  error.value = ''; // 清除之前的錯誤
  
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
    handleError(err, '發送訊息失敗');
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我現在無法回應您的問題。請稍後再試。',
      timestamp: Date.now()
    });
  } finally {
    isLoading.value = false;
  }
};

// 關閉對話框
const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
.chemist-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.chemist-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #42b883;
  color: white;
}

.chemist-info {
  display: flex;
  flex-direction: column;
}

.chemist-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.chemist-years {
  font-size: 0.9rem;
  opacity: 0.9;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dialog-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.chemist-portrait {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #42b883;
}

.chemist-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chemist-bio {
  margin-bottom: 2rem;
  text-align: center;
  color: #666;
  line-height: 1.6;
}

.chat-container {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
}

.message {
  margin-bottom: 1rem;
  max-width: 80%;
}

.message.user-message {
  margin-left: auto;
}

.message-content {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-message .message-content {
  background: #42b883;
  color: white;
}

.message-time {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.3rem;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.chat-input button {
  padding: 0.8rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.chat-input button:hover:not(:disabled) {
  background: #3aa876;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.error-toast {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4d4f;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1.2rem;
}

.error-message {
  font-size: 0.9rem;
}

.error-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.error-close:hover {
  opacity: 1;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style> 