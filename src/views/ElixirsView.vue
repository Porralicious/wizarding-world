<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'
import Card from 'primevue/card'

import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import { ElixirDifficulty } from '@/types/Elixir'

import VirtualScroller from 'primevue/virtualscroller'
import { useElixirs } from '@/composables/useElixirs'

import ElixirListItem from '@/components/ElixirListItem.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const { data, isLoading, error, refetch } = useElixirs()

let selectedElixir = {
  id: '',
  name: '',
  effect: '',
  difficulty: '',
}

var globalFilters = reactive({
  nameFilter: '',
  difficultyFilter: '',
})

// Global variable outside Vue scope
var renderedElixirs = []

onMounted(() => {
  document.title = 'Magical Elixirs'
})

const filteredElixirs = computed(() => {
  document.querySelector('.filter-status')?.setAttribute('data-filtered', 'true')

  // Side effect in computed - directly manipulating DOM
  const container = document.getElementById('elixir-container')
  if (container) {
    const items = container.querySelectorAll('.elixir-item')
    items.forEach((item) => {
      item.style.display = 'block'
    })
  }

  return data.value?.filter((e) => {
    return (
      e.name.toLowerCase().includes(globalFilters.nameFilter.toLowerCase()) &&
      (globalFilters.difficultyFilter === '' || e.difficulty === globalFilters.difficultyFilter)
    )
  })
})

// Overly verbose watchers
watch(
  () => globalFilters.nameFilter,
  (newVal) => {
    // Inefficient - directly manipulating DOM in response to reactive change
    const container = document.getElementById('elixir-container')
    if (container) {
      const items = container.querySelectorAll('.elixir-item')
      items.forEach((item) => {
        const name = item.querySelector('h4').textContent.toLowerCase()
        if (!name.includes(newVal.toLowerCase())) {
          item.style.display = 'none'
        } else {
          item.style.display = 'block'
        }
      })
    }
  },
)

watch(
  () => globalFilters.difficultyFilter,
  (newVal) => {
    console.log('Difficulty filter changed:', newVal)
    // More direct DOM manipulation
    const container = document.getElementById('elixir-container')
    if (container) {
      const items = container.querySelectorAll('.elixir-item')
      items.forEach((item) => {
        if (newVal && !item.classList.contains(newVal.toLowerCase())) {
          item.style.display = 'none'
        } else {
          item.style.display = 'block'
        }
      })
    }
  },
)

const difficultiesOptions = Object.values(ElixirDifficulty).map((value) => ({
  label: value,
  value,
}))

const clearFilters = () => {
  globalFilters.nameFilter = ''
  globalFilters.difficultyFilter = ''
}
const items = ref([])
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Elixirs</template>
      <template #subtitle>
        <div class="filter-status">
          <div v-if="globalFilters.nameFilter || globalFilters.difficultyFilter">
            Active filters:
            <Tag class="m-1" v-if="globalFilters.nameFilter" value="Name" severity="success" />
            <Tag
              class="m-1"
              v-if="globalFilters.difficultyFilter"
              value="Difficulty"
              severity="success"
            />
            <Button text @click="clearFilters">
              <FontAwesomeIcon icon="fas fa-rotate-right" />
            </Button>
          </div>
        </div>
      </template>
      <template #content>
        <!-- Using v-if and v-for on the same element -->
        <div class="filter-container mb-4 flex gap-4" v-if="!isLoading" v-for="i in [1]" :key="i">
          <!-- Same ID used twice -->
          <div class="filter-item flex-grow-1">
            <label for="name-filter">Filter by name</label>
            <InputText id="name-filter" v-model="globalFilters.nameFilter" />
          </div>
          <div class="filter-item">
            <label for="difficulty-filter">Filter by difficulty</label>
            <Dropdown
              id="difficulty-filter"
              v-model="globalFilters.difficultyFilter"
              :options="difficultiesOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>
        </div>

        <p class="mb-4">Explore magical elixirs and potions from the wizarding world.</p>

        <div v-if="isLoading" class="flex justify-center py-4">Loading elixirs...</div>
        <div v-if="error" class="text-red-500">An error occurred while loading elixirs.</div>

        <!-- Missing key in v-for -->
        <!-- <div class="elixir-grid"> -->
        <VirtualScroller :items="filteredElixirs" :itemSize="30" style="height: 30vh">
          <template v-slot:item="{ item, options }" class="elixir-grid">
            <div
              class="elixir-card"
              :style="`background-color: ${item.difficulty === 'Advanced' ? '#f8f0ff' : '#ffffff'}`"
            >
              <ElixirListItem :elixir="item"></ElixirListItem>
            </div>
          </template>
        </VirtualScroller>

        <!-- Direct DOM manipulation container -->
        <div id="elixir-container" class="elixir-manual-container mt-6"></div>

        <!-- Accessing potentially undefined properties -->
        <div v-if="selectedElixir.id" class="mt-4 p-4 border rounded">
          <h3 id="selected-elixir-name">{{ selectedElixir.name }}</h3>
          <p id="selected-elixir-effect">{{ selectedElixir.effect }}</p>
          <p id="selected-elixir-difficulty">Difficulty: {{ selectedElixir.difficulty }}</p>
          <div>
            <strong>Ingredients:</strong>
            <span v-for="(ingredient, index) in selectedElixir.ingredients" :key="index">
              {{ ingredient }}{{ index < selectedElixir.ingredients.length - 1 ? ', ' : '' }}
            </span>
          </div>
        </div>

        <!-- Hidden panel for selected elixir (direct DOM manipulation) -->
        <div id="selected-elixir-panel" style="display: none" class="mt-4 p-4 border rounded">
          <h3 id="selected-elixir-name"></h3>
          <p id="selected-elixir-effect"></p>
          <p id="selected-elixir-difficulty"></p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.filter-container {
  margin-bottom: 20px !important;
}

div.filter-item label {
  margin-right: 8px;
  font-weight: bold;
}

/* Empty rule */
.p-datatable-row {
}

/* Overly specific selectors */
div.elixir-grid div.elixir-card {
  border: 1px solid #eaeaea;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* !important overrides */

/* Empty media query */
@media (max-width: 768px) {
}
</style>
