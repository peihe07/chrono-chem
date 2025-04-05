import { defineStore } from 'pinia'
import { eras } from '@/config/eras'

interface ChemistState {
  name: string;
  isActive: boolean;
  lastInteractionTime: number;
}

interface TimeTravelState {
  currentYear: number;
  selectedChemist: string | null;
  activeChemists: Record<string, ChemistState>;
  completedEvents: string[];
  isTransitioning: boolean;
}

export const useTimeTravelStore = defineStore('timeTravel', {
  state: (): TimeTravelState => ({
    currentYear: 1774,
    selectedChemist: null,
    activeChemists: {},
    completedEvents: [],
    isTransitioning: false
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
    }
  },

  actions: {
    setYear(year: number) {
      this.isTransitioning = true
      this.currentYear = year
      // 重置化學家狀態
      this.selectedChemist = null
      this.activeChemists = {}
      // 模擬過渡動畫
      setTimeout(() => {
        this.isTransitioning = false
      }, 1000)
    },

    selectChemist(name: string) {
      this.selectedChemist = name
      if (!this.activeChemists[name]) {
        this.activeChemists[name] = {
          name,
          isActive: true,
          lastInteractionTime: Date.now()
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
      }
    },

    resetProgress() {
      this.completedEvents = []
      this.activeChemists = {}
      this.selectedChemist = null
    }
  }
})