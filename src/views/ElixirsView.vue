<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'
import { useWizardingWorldStore } from '@/stores/wizardingWorld'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import { ElixirDifficulty } from '@/types/Elixir'
import type { Elixir } from '@/types/Elixir'
import VirtualScroller from 'primevue/virtualscroller'
const store = useWizardingWorldStore()
const elixirs = computed(() => store.elixirs)
const loading = false

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

  // window.addEventListener('resize', () => {
  //   console.log('Window resized')
  //   refreshTable()
  // })

  // Immediately render initial elixirs to DOM directly
})

// Direct DOM manipulation instead of using Vue's templating
// function addElixirToDOM(elixir) {
//   const container = document.getElementById('elixir-container')
//   if (!container) return

//   const div = document.createElement('div')
//   div.id = 'elixir-' + elixir.id // Creating duplicate IDs potentially
//   div.className = 'elixir-item ' + elixir.difficulty.toLowerCase()

//   // Using innerHTML instead of safer methods
//   div.innerHTML = `
//     <h4>${elixir.name}</h4>
//     <p>Effect: ${elixir.effect}</p>
//     <p>Difficulty: ${elixir.difficulty}</p>
//     <div class="buttons">
//       <button onclick="window.selectElixirById('${elixir.id}')">View</button>
//       <button onclick="window.deleteElixirById('${elixir.id}')">Delete</button>
//     </div>
//   `

//   container.appendChild(div)
// }

const filteredElixirs = computed(() => {
  console.log('Filtering elixirs...')
  document.querySelector('.filter-status')?.setAttribute('data-filtered', 'true')

  // Side effect in computed - directly manipulating DOM
  const container = document.getElementById('elixir-container')
  if (container) {
    const items = container.querySelectorAll('.elixir-item')
    items.forEach((item) => {
      item.style.display = 'block'
    })
  }

  return elixirs.value.filter((e) => {
    return (
      e.name.toLowerCase().includes(globalFilters.nameFilter.toLowerCase()) &&
      (globalFilters.difficultyFilter === '' || e.difficulty === globalFilters.difficultyFilter)
    )
  })
})

// Exposing functions to window - bad practice
window.selectElixirById = function (id) {
  const elixir = elixirs.value.find((e) => e.id === id)
  if (elixir) {
    // Direct assignment instead of using reactive
    selectedElixir = elixir

    // Update DOM directly
    document.getElementById('selected-elixir-name').textContent = elixir.name
    document.getElementById('selected-elixir-effect').textContent = elixir.effect
    document.getElementById('selected-elixir-difficulty').textContent = elixir.difficulty

    document.getElementById('selected-elixir-panel').style.display = 'block'
  }
}

window.deleteElixirById = function (id) {
  // Modify the array directly
  elixirs.value = elixirs.value.filter((e) => e.id !== id)

  // Remove from DOM directly
  const element = document.getElementById('elixir-' + id)
  if (element) {
    element.parentNode.removeChild(element)
  }
}

const loadElixirs = async () => {
  try {
    await store.fetchElixirs()
  } catch (error) {
    console.error('Failed to load elixirs:', error)
  }
}
onMounted(() => {
  if (store.spells.length === 0) {
    loadElixirs()
  }
})

// Overly verbose watchers
watch(
  () => globalFilters.nameFilter,
  (newVal) => {
    console.log('Name filter changed:', newVal)
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

// const { data, isLoading, error } = useQuery({
//   queryKey: ['elixirs'],
//   queryFn: fetchElixirs,
// })

// Directly mutating an object
function selectElixir(elixir) {
  selectedElixir = elixir
}

// Using both DOM API and Vue reactivity - inconsistent
function refreshTable() {
  nextTick(() => {
    // Direct DOM manipulation
    const rows = document.querySelectorAll('.elixir-item')
    rows.forEach((row) => {
      row.style.opacity = '0.8'
      setTimeout(() => {
        row.style.opacity = '1'
      }, 300)
    })

    // Re-render after manipulation
    renderElixirsDirectly()
  })
}
const difficultiesOptions = Object.values(ElixirDifficulty).map((value) => ({
  label: value,
  value,
}))

const items = ref([])

function deleteElixir(id) {
  console.log('Deleting elixir', id)
  elixirs.value = elixirs.value.filter((e) => e.id !== id)
}
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Elixirs</template>
      <template #subtitle>
        <div class="filter-status">
          <div v-if="globalFilters.nameFilter || globalFilters.difficultyFilter">
            Active filters
          </div>
        </div>
      </template>
      <template #content>
        <!-- Using v-if and v-for on the same element -->
        <div class="filter-container mb-4 flex gap-4" v-if="!isLoading" v-for="i in [1]" :key="i">
          <!-- Same ID used twice -->
          <div class="filter-item">
            <label for="name-filter">Filter by name</label>
            <InputText id="name-filter" v-model="globalFilters.nameFilter" />
          </div>
          <div class="filter-item">
            <label for="name-filter">Filter by difficulty</label>
            <Dropdown
              id="name-filter"
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
              <h3 v-html="item.name"></h3>
              <p v-html="`Effect: ${item.effect}`"></p>
              <p>Difficulty: {{ item.difficulty }}</p>
              <div class="action-buttons">
                <Button severity="info" @click="selectElixir(item)">
                  <font-awesome-icon icon="fas fa-circle-info" />
                </Button>
                <Button icon="pi pi-trash" severity="danger" @click="deleteElixir(item.id)">
                  <font-awesome-icon icon="fas fa-trash" />
                </Button>
              </div>
            </div>
          </template>
        </VirtualScroller>
        <!-- Mixing v-if, v-show and v-for on same element -->
        <!-- <div
            v-for="elixir in filteredElixirs"
            v-show="elixir.id !== 'hidden'"
            class="elixir-card"
            :style="`background-color: ${elixir.difficulty === 'Advanced' ? '#f8f0ff' : '#ffffff'}`"
          >
            <h3 v-html="elixir.name"></h3>
            <p v-html="`Effect: ${elixir.effect}`"></p>
            <p>Difficulty: {{ elixir.difficulty }}</p>
            <div class="action-buttons">
              <Button severity="info" @click="selectElixir(elixir)">
                <font-awesome-icon icon="fas fa-circle-info" />
              </Button>
              <Button icon="pi pi-trash" severity="danger" @click="deleteElixir(elixir.id)">
                <font-awesome-icon icon="fas fa-trash" />
              </Button>
            </div>
          </div> -->
        <!-- </div> -->

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

:deep(.p-button) {
  background: #6366f1 !important;
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
.elixir-card h3 {
  color: #4338ca !important;
  font-size: 18px !important;
}

/* Inline important */
.elixir-manual-container {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 10px !important;
}

/* Duplicate selectors with different rules */
.elixir-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
}

.elixir-item {
  width: calc(33% - 10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Contradictory rules */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons {
  display: block;
}

/* Empty media query */
@media (max-width: 768px) {
}
</style>
