import axios from 'axios';

export interface ChatMessage {
  id: number;
  scientist_id: number;
  user_message: string;
  scientist_response: string;
  timestamp: string;
}

export interface ChatRequest {
  scientist_id: number;
  message: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

/**
 * 發送訊息給化學家並獲取回應
 * @param request 聊天請求
 * @returns 化學家的回應
 */
export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await axios.post<ChatResponse>('/api/chat', request);
    return response.data;
  } catch (error) {
    console.error('發送訊息失敗:', error);
    throw error;
  }
};

/**
 * 獲取與特定化學家的聊天歷史
 * @param scientistId 化學家 ID
 * @returns 聊天歷史記錄
 */
export const getChatHistory = async (scientistId: number): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get<ChatMessage[]>(`/api/chat/history/${scientistId}`);
    return response.data;
  } catch (error) {
    console.error('獲取聊天歷史失敗:', error);
    throw error;
  }
};

/**
 * 清除與特定化學家的聊天歷史
 * @param scientistId 化學家 ID
 */
export const clearChatHistory = async (scientistId: number): Promise<void> => {
  try {
    await axios.delete(`/api/chat/history/${scientistId}`);
  } catch (error) {
    console.error('清除聊天歷史失敗:', error);
    throw error;
  }
}; 