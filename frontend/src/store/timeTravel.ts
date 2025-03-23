import { defineStore } from 'pinia'

export const useTimeTravelStore = defineStore('timeTravel', {
  state: () => ({
    currentYear: 1774,
    selectedChemist: null as string | null
  }),
  actions: {
    setYear(year: number) {
      this.currentYear = year
    },
    selectChemist(name: string) {
      this.selectedChemist = name
    }
  }
})