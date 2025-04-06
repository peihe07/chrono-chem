import axios from 'axios'

export interface Chemist {
  id: number
  name: string
  birth_year: number
  death_year?: number
  description: string
  portrait_path?: string
  era: number
}

export interface HistoricalEvent {
  id: number
  title: string
  description: string
  year: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatResponse {
  assistant_message: ChatMessage
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const getChemists = async (era?: number): Promise<PaginatedResponse<Chemist>> => {
  const url = era ? `/api/chemists/?era=${era}` : '/api/chemists/'
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('獲取化學家數據失敗')
  }
  return response.json()
}

export const getEvents = async (year: number): Promise<PaginatedResponse<HistoricalEvent>> => {
  const response = await fetch(`/api/events/?year=${year}`)
  if (!response.ok) {
    throw new Error('獲取事件數據失敗')
  }
  return response.json()
}

export const sendMessage = async (chemistId: number, content: string): Promise<ChatResponse> => {
  const response = await axios.post(`/api/chemists/${chemistId}/send_message/`, { content })
  return response.data
} 