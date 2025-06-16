import { defineStore } from 'pinia'
import type { House } from '@/types/House'

export const useWizardingWorldStore = defineStore('wizardingWorld', {
  state: () => ({
    selectedHouse: null as House | null,
  }),

  getters: {
  },

  actions: {
    setSelectedHouse(house: House | null) {
      this.selectedHouse = house
    },
  },
})
