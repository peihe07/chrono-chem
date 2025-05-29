<template>
  <div v-if="show" class="dialog-content">
    <div class="dialog-header">
      <h2>{{ chemist.name }}</h2>
      <div class="header-actions">
        <button class="clear-button" @click="handleClearHistory" title="清除聊天記錄">
          <span class="icon">🗑️</span>
        </button>
        <button class="close-button" @click="close">×</button>
      </div>
    </div>
    <div class="dialog-body">
      <div class="chemist-portrait">
        <img :src="chemist.portrait_path" :alt="chemist.name">
      </div>
      <div class="chemist-details">
        <div class="chemist-years">{{ chemist.birth_year }} - {{ chemist.death_year }}</div>
        <p class="chemist-description" v-html="formatDescription(chemist.description)"></p>
        <div class="chemist-discoveries" v-if="chemist.events && chemist.events.length > 0">
          <h3>重要發現</h3>
          <ul>
            <li v-for="event in chemist.events" :key="event.id">
              {{ event.title }} ({{ event.year }})
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
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import type { Chemist } from '@/types/index';
import { sendMessage as sendChatMessage, getChatHistory, clearChatHistory } from '@/api/chemists';
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
const formatTime = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) {
    return '';
  }
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 載入聊天歷史記錄
const loadChatHistory = async () => {
  try {
    if (props.chemist.chat_history && props.chemist.chat_history.length > 0) {
      messages.value = props.chemist.chat_history.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toString()
      }));
    } else {
      const history = await getChatHistory(props.chemist.id);
      messages.value = history.data.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toString()
      }));
    }
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('載入聊天記錄失敗:', error);
  }
};

// 清除聊天記錄
const handleClearHistory = async () => {
  try {
    await clearChatHistory(props.chemist.id);
    messages.value = [];
    addWelcomeMessage();
  } catch (error) {
    console.error('清除聊天記錄失敗:', error);
  }
};

// 初始化歡迎訊息
const addWelcomeMessage = () => {
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: `您好，我是${props.chemist.name}。有什麼我可以幫助您的嗎？`,
      timestamp: Date.now().toString()
    });
  }
};

// 滾動到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 監聽化學家 ID 變動，切換時重載聊天紀錄
watch(() => props.chemist.id, async (newId, oldId) => {
  messages.value = [];
  if (props.show) {
    await loadChatHistory();
    addWelcomeMessage();
  }
});

// 監聽對話框顯示狀態
watch(() => props.show, async (newValue) => {
  if (newValue) {
    await loadChatHistory();
    addWelcomeMessage();
  }
});

// 組件掛載時初始化
onMounted(async () => {
  if (props.show) {
    await loadChatHistory();
    addWelcomeMessage();
  }
});

// 發送訊息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;
  
  const message = userInput.value.trim();
  userInput.value = '';
  
  // 添加用戶訊息
  const userMessage: ChatMessage = {
    role: 'user',
    content: message,
    timestamp: Date.now().toString()
  };
  messages.value.push(userMessage);
  
  // 設置載入狀態
  isLoading.value = true;
  
  try {
    // 發送訊息到 API
    const response = await sendChatMessage(props.chemist.id, message);
    console.log('API 響應:', response);
    
    // 添加化學家回應
    if (response.data && response.data.assistant_message) {
      messages.value.push({
        role: 'assistant',
        content: response.data.assistant_message.content,
        timestamp: response.data.assistant_message.timestamp.toString()
      });
    } else {
      throw new Error('API 響應格式不正確');
    }
    
    // 滾動到最新訊息
    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error('發送訊息失敗:', err);
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我現在無法回應您的問題。請稍後再試。',
      timestamp: Date.now().toString()
    });
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  emit('close');
};

// 格式化描述
const formatDescription = (desc: string) => {
  if (!desc) return '';
  return desc.replace(/\n/g, '<br>');
};
</script>

<style scoped>
.dialog-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
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

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
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
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  gap: 16px;
  max-height: 35vh;
  align-items: flex-start;
}

.chemist-portrait {
  width: 80px;
  height: 80px;
  margin: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #42b883;
  background: #f8f9fa;
  flex-shrink: 0;
}

.chemist-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.chemist-details {
  flex: 1;
  min-width: 0;
}

.chemist-years {
  font-size: 0.9rem;
  color: #42b883;
  margin-bottom: 8px;
  font-weight: 500;
}

.chemist-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2c3e50;
  margin: 8px 0;
  text-align: left;
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
  min-height: 250px;
  margin-top: 8px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 450px);
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

.clear-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.3s ease;
}

.clear-button:hover {
  color: #e74c3c;
}

.icon {
  font-size: 1.2rem;
}
</style> 