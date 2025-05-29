import { Vector3 } from 'three'
import type { ChatMessage } from '@/api/chemists'

export interface ChemistModelConfig {
  name: string
  era: number
  description: string
  position: Vector3
  birth_year: number
  death_year: number
  portrait_path: string
  model_path: string
  bio?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: number | null
}

export interface HistoricalEvent {
  id: string
  title: string
  description: string
  year: number
  event_type: 'discovery' | 'publication' | 'experiment'
  image_path: string
  created_at: string
  updated_at: string
}

export interface Discovery {
  id: number
  name: string
  year: number
  description: string
}

export interface Chemist {
  id: number
  name: string
  era: number
  description: string
  position_x: number
  position_y: number
  position_z: number
  birth_year: number
  death_year: number
  portrait_path: string
  model_path: string
  events: HistoricalEvent[]
  chat_history: ChatMessage[]
  created_at: string
  updated_at: string
}