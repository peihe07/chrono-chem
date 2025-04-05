import { defineStore } from 'pinia'
import { eras } from '@/config/eras'

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChemistState {
  name: string;
  isActive: boolean;
  lastInteractionTime: number;
  chatHistory: ChatMessage[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number | null;
}

interface TimeTravelState {
  currentYear: number;
  selectedChemist: string | null;
  activeChemists: Record<string, ChemistState>;
  completedEvents: string[];
  isTransitioning: boolean;
  achievements: Achievement[];
  sceneLoaded: boolean;
}

export const useTimeTravelStore = defineStore('timeTravel', {
  state: (): TimeTravelState => ({
    currentYear: 1774,
    selectedChemist: null,
    activeChemists: {},
    completedEvents: [],
    isTransitioning: false,
    achievements: [
      {
        id: 'first_interaction',
        title: '初次相遇',
        description: '與第一位化學家對話',
        unlockedAt: null
      },
      {
        id: 'time_traveler',
        title: '時光旅人',
        description: '訪問所有歷史時期',
        unlockedAt: null
      },
      {
        id: 'chemistry_master',
        title: '化學大師',
        description: '完成所有化學實驗',
        unlockedAt: null
      }
    ],
    sceneLoaded: false
  }),

  getters: {
    currentEra: (state) => {
      return eras.find(era => era.year === state.currentYear)
    },
    isChemistActive: (state) => (name: string) => {
      return state.activeChemists[name]?.isActive || false
    },
    hasCompletedEvent: (state) => (eventId: string) => {
      return state.completedEvents.includes(eventId)
    },
    unlockedAchievements: (state) => {
      return state.achievements.filter(a => a.unlockedAt !== null)
    },
    chemistChatHistory: (state) => (name: string) => {
      return state.activeChemists[name]?.chatHistory || []
    }
  },

  actions: {
    setYear(year: number) {
      this.isTransitioning = true
      this.currentYear = year
      this.sceneLoaded = false
      // 重置化學家狀態
      this.selectedChemist = null
      this.activeChemists = {}
      // 模擬過渡動畫
      setTimeout(() => {
        this.isTransitioning = false
        this.sceneLoaded = true
      }, 1000)
    },

    selectChemist(name: string) {
      this.selectedChemist = name
      if (!this.activeChemists[name]) {
        this.activeChemists[name] = {
          name,
          isActive: true,
          lastInteractionTime: Date.now(),
          chatHistory: []
        }
      } else {
        this.activeChemists[name].isActive = true
        this.activeChemists[name].lastInteractionTime = Date.now()
      }
    },

    deselectChemist() {
      if (this.selectedChemist && this.activeChemists[this.selectedChemist]) {
        this.activeChemists[this.selectedChemist].isActive = false
        this.selectedChemist = null
      }
    },

    completeEvent(eventId: string) {
      if (!this.completedEvents.includes(eventId)) {
        this.completedEvents.push(eventId)
        this.checkAchievements()
      }
    },

    addChatMessage(chemistName: string, message: Omit<ChatMessage, 'timestamp'>) {
      if (this.activeChemists[chemistName]) {
        this.activeChemists[chemistName].chatHistory.push({
          ...message,
          timestamp: Date.now()
        })
        this.checkAchievements()
      }
    },

    unlockAchievement(achievementId: string) {
      const achievement = this.achievements.find(a => a.id === achievementId)
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = Date.now()
      }
    },

    checkAchievements() {
      // 檢查初次相遇成就
      if (Object.keys(this.activeChemists).length > 0) {
        this.unlockAchievement('first_interaction')
      }

      // 檢查時光旅人成就
      const visitedYears = new Set(
        this.completedEvents
          .map(eventId => this.currentYear)
          .filter((year): year is number => year !== null)
      )
      if (visitedYears.size >= eras.length) {
        this.unlockAchievement('time_traveler')
      }

      // 檢查化學大師成就
      if (this.completedEvents.length >= 5) { // 假設有5個實驗
        this.unlockAchievement('chemistry_master')
      }
    },

    resetProgress() {
      this.completedEvents = []
      this.activeChemists = {}
      this.selectedChemist = null
      this.achievements.forEach(a => a.unlockedAt = null)
    }
  }
})