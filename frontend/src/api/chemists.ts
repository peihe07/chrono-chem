import axios from 'axios'

// 設置 axios 的基礎 URL
axios.defaults.baseURL = 'http://localhost:8002/api/v1'

// 化學家介面
export interface Chemist {
  id: number
  name: string
  birth_year: number
  death_year: number
  nationality: string
  major_achievements: string
  discoveries: string[]
  image_url: string
  model_url: string
  era: number
}

// 歷史事件介面
export interface HistoricalEvent {
  id: number
  year: number
  title: string
  description: string
  significance: string
  related_chemists: number[]
}

// 聊天訊息介面
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// 聊天回應介面
export interface ChatResponse {
  status: string
  data: {
    assistant_message: {
      role: 'assistant'
      content: string
      timestamp: number
    }
  }
  message: string
}

// 聊天歷史回應介面
export interface ChatHistoryResponse {
  status: string
  data: ChatMessage[]
}

// 獲取化學家列表
export const getChemists = async (): Promise<Chemist[]> => {
  try {
    const response = await axios.get('/chemists/')
    return response.data
  } catch (error) {
    console.error('獲取化學家列表失敗:', error)
    throw error
  }
}

// 獲取特定年份的事件
export const getEvents = async (year: number): Promise<HistoricalEvent[]> => {
  try {
    const response = await axios.get(`/events/?year=${year}`)
    return response.data
  } catch (error) {
    console.error('獲取歷史事件失敗:', error)
    throw error
  }
}

// 發送訊息給化學家
export const sendMessage = async (chemistId: number, message: string): Promise<ChatResponse> => {
  try {
    const response = await axios.post(`/scientist/${chemistId}/send_message/`, {
      message
    })
    return response.data
  } catch (error) {
    console.error('發送訊息失敗:', error)
    throw error
  }
}

// 獲取聊天歷史
export const getChatHistory = async (chemistId: number): Promise<ChatHistoryResponse> => {
  try {
    const response = await axios.get(`/scientist/${chemistId}/chat_history/`)
    return response.data
  } catch (error) {
    console.error('獲取聊天歷史失敗:', error)
    throw error
  }
}

// 清除聊天歷史
export const clearChatHistory = async (chemistId: number): Promise<void> => {
  try {
    await axios.delete(`/scientist/${chemistId}/clear_history/`)
  } catch (error) {
    console.error('清除聊天歷史失敗:', error)
    throw error
  }
} 