import { defineStore } from 'pinia'
import type { House } from '@/types/House'
import type { Spell } from '@/types/Spell'
import type { Elixir } from '@/types/Elixir'
import type { Ingredient } from '@/types/Ingredient'
import type { Wizard } from '@/types/Wizard'
import axios from 'axios'

export const useWizardingWorldStore = defineStore('wizardingWorld', {
  state: () => ({
    houses: [] as House[],
    spells: [] as Spell[],
    ingredients: [] as Ingredient[],
    elixirs: [] as Elixir[],
    wizards: [] as Wizard[],
    selectedHouse: null as House | null,
    loading: {
      houses: false,
      spells: false,
      ingredients: false,
      elixirs: false,
      wizards: false,
    },
    errors: {
      houses: null as string | null,
      spells: null as string | null,
      ingredients: null as string | null,
      elixirs: null as string | null,
      wizards: null as string | null,
    },
  }),

  getters: {
    getHouse: (state) => {
      return (houseId: string) => state.houses.find((house: House) => house.id === houseId)
    },
    getSpell: (state) => {
      return (spellId: string) => state.spells.find((spell: Spell) => spell.id === spellId)
    },
    getIngredient: (state) => {
      return (ingredientId: string) =>
        state.ingredients.find((ingredient: Ingredient) => ingredient.id === ingredientId)
    },
    getElixir: (state) => {
      return (elixirId: string) => state.elixirs.find((elixir: Elixir) => elixir.id === elixirId)
    },
    getWizard: (state) => {
      return (wizardId: string) => state.wizards.find((wizard: Wizard) => wizard.id === wizardId)
    },
    isLoading: (state) => {
      return Object.values(state.loading).some((loading) => loading)
    },
  },

  actions: {
    async fetchHouses() {
      this.loading.houses = true
      this.errors.houses = null
      try {
        const response = await axios.get('https://wizard-world-api.herokuapp.com/Houses')
        this.houses = response.data
      } catch (error) {
        this.errors.houses = error instanceof Error ? error.message : 'Failed to fetch houses'
        throw error
      } finally {
        this.loading.houses = false
      }
    },

    async fetchSpells() {
      this.loading.spells = true
      this.errors.spells = null
      try {
        const response = await axios.get('https://wizard-world-api.herokuapp.com/Spells')
        this.spells = response.data
      } catch (error) {
        this.errors.spells = error instanceof Error ? error.message : 'Failed to fetch spells'
        throw error
      } finally {
        this.loading.spells = false
      }
    },

    async fetchIngredients() {
      this.loading.ingredients = true
      this.errors.ingredients = null
      try {
        const response = await axios.get('https://wizard-world-api.herokuapp.com/Ingredients')
        this.ingredients = response.data
      } catch (error) {
        this.errors.ingredients =
          error instanceof Error ? error.message : 'Failed to fetch ingredients'
        throw error
      } finally {
        this.loading.ingredients = false
      }
    },

    async fetchElixirs() {
      this.loading.elixirs = true
      this.errors.elixirs = null
      try {
        const response = await axios.get('https://wizard-world-api.herokuapp.com/Elixirs')
        this.elixirs = response.data
      } catch (error) {
        this.errors.elixirs = error instanceof Error ? error.message : 'Failed to fetch elixirs'
        throw error
      } finally {
        this.loading.elixirs = false
      }
    },

    async fetchWizards() {
      this.loading.wizards = true
      this.errors.wizards = null
      try {
        const response = await axios.get('https://wizard-world-api.herokuapp.com/Wizards')
        this.wizards = response.data
      } catch (error) {
        this.errors.wizards = error instanceof Error ? error.message : 'Failed to fetch wizards'
        throw error
      } finally {
        this.loading.wizards = false
      }
    },

    async fetchAll() {
      await Promise.allSettled([
        this.fetchHouses(),
        this.fetchSpells(),
        this.fetchIngredients(),
        this.fetchElixirs(),
        this.fetchWizards(),
      ])
    },

    setSelectedHouse(house: House | null) {
      this.selectedHouse = house
    },

    clearErrors() {
      this.errors = {
        houses: null,
        spells: null,
        ingredients: null,
        elixirs: null,
        wizards: null,
      }
    },
  },
})
