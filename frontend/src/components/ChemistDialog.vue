<template>
  <Transition name="fade">
    <div v-if="show" class="chemist-dialog-overlay" @click="closeDialog">
      <div class="chemist-dialog" @click.stop>
        <div class="dialog-header">
          <div class="chemist-info">
            <h2 class="chemist-name">{{ chemist.name }}</h2>
            <div class="chemist-years">{{ chemist.birth_year }} - {{ chemist.death_year }}</div>
          </div>
          <button class="close-button" @click="closeDialog">×</button>
        </div>
        
        <div class="dialog-content">
          <div class="chemist-portrait">
            <img :src="chemist.portraitPath || '/images/default-portrait.png'" :alt="chemist.name" />
          </div>
          
          <div class="chemist-bio">
            <p>{{ chemist.bio || '這位化學家為化學科學做出了重要貢獻。' }}</p>
          </div>
          
          <div class="chat-container">
            <div class="chat-messages" ref="messagesContainer">
              <div 
                v-for="(message, index) in messages" 
                :key="index" 
                class="message"
                :class="{ 'user-message': message.isUser }"
              >
                <div class="message-content">{{ message.text }}</div>
                <div class="message-time">{{ message.time }}</div>
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
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { sendMessage as sendChatMessage, getChatHistory, clearChatHistory } from '@/api/chat';
import type { ChemistModelConfig } from '@/threejs/ChemistModel';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

const props = defineProps<{
  show: boolean;
  chemist: ChemistModelConfig;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'send-message', message: string): void;
}>();

const userInput = ref('');
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// 初始化歡迎訊息
onMounted(async () => {
  if (props.show) {
    // 載入聊天歷史
    await loadChatHistory();
    
    // 如果沒有歷史訊息，添加歡迎訊息
    if (messages.value.length === 0) {
      addMessage(`您好，我是${props.chemist.name}。有什麼我可以幫助您的嗎？`, false);
    }
  }
});

// 監聽對話框顯示狀態
watch(() => props.show, async (newValue) => {
  if (newValue) {
    // 清空之前的對話
    messages.value = [];
    // 載入聊天歷史
    await loadChatHistory();
    
    // 如果沒有歷史訊息，添加歡迎訊息
    if (messages.value.length === 0) {
      addMessage(`您好，我是${props.chemist.name}。有什麼我可以幫助您的嗎？`, false);
    }
  }
});

// 載入聊天歷史
const loadChatHistory = async () => {
  try {
    const history = await getChatHistory(props.chemist.id);
    
    // 將歷史訊息添加到對話列表
    for (const msg of history) {
      addMessage(msg.user_message, true);
      addMessage(msg.scientist_response, false);
    }
  } catch (error) {
    console.error('載入聊天歷史失敗:', error);
  }
};

// 添加訊息到對話列表
const addMessage = (text: string, isUser: boolean) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  messages.value.push({
    text,
    isUser,
    time
  });
  
  // 滾動到最新訊息
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 發送訊息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;
  
  const message = userInput.value.trim();
  userInput.value = '';
  
  // 添加用戶訊息
  addMessage(message, true);
  
  // 設置載入狀態
  isLoading.value = true;
  
  try {
    // 發送訊息到 API
    const response = await sendChatMessage({
      scientist_id: props.chemist.id,
      message: message
    });
    
    // 添加化學家回應
    addMessage(response.message, false);
    
    // 觸發事件
    emit('send-message', message);
  } catch (error) {
    console.error('發送訊息失敗:', error);
    addMessage('抱歉，我現在無法回應您的問題。請稍後再試。', false);
  } finally {
    isLoading.value = false;
  }
};

// 關閉對話框
const closeDialog = () => {
  emit('update:show', false);
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chemist-portrait {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 3px solid #42b883;
}

.chemist-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chemist-bio {
  text-align: center;
  color: #555;
  line-height: 1.6;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
}

.message-content {
  padding: 0.8rem 1rem;
  border-radius: 18px;
  background: #f0f0f0;
  color: #333;
}

.user-message .message-content {
  background: #42b883;
  color: white;
}

.message-time {
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.3rem;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 0.8rem;
  border-top: 1px solid #eee;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border 0.3s;
}

.chat-input input:focus {
  border-color: #42b883;
}

.chat-input button {
  padding: 0.8rem 1.2rem;
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

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 