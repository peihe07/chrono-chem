import axios from 'axios'

export interface Chemist {
  id: number
  name: string
  era: number
  description: string
  birth_year: number
  death_year?: number
  portrait_path?: string
}

export interface HistoricalEvent {
  id: number
  title: string
  description: string
  year: number
  chemist: number
  event_type: string
  image_path?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatResponse {
  user_message: ChatMessage
  assistant_message: ChatMessage
}

export const getChemists = async (): Promise<Chemist[]> => {
  const response = await axios.get('/api/chemists/')
  return response.data
}

export const getEvents = async (year: number): Promise<HistoricalEvent[]> => {
  const response = await axios.get(`/api/events/?year=${year}`)
  return response.data
}

export const sendMessage = async (chemistId: number, content: string): Promise<ChatResponse> => {
  const response = await axios.post(`/api/chemists/${chemistId}/send_message/`, { content })
  return response.data
} 