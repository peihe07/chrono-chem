import { Vector3 } from 'three'

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

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
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
  year: number
  description: string
}

export interface Chemist {
  id: number
  name: string
  description: string
  era: number
  birth_year: number
  death_year: number
  portrait_path: string
  model_path: string
  position: {
    x: number
    y: number
    z: number
  }
  discoveries: Discovery[]
  created_at: string
  updated_at: string
} 