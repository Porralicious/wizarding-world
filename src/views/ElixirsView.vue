```vue
<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  nextTick,
  shallowRef,
  markRaw,
  toRefs,
  getCurrentInstance,
} from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Tooltip from 'primevue/tooltip'
import Chart from 'primevue/chart'

interface ElixirIngredient {
  name: string
  quantity: number | string
}

interface ElixirEffect {
  description: string
  duration: number
  intensity: 'low' | 'medium' | 'high'
}

interface ElixirBase {
  id: string
  name: string
}

interface ElixirDetailed extends ElixirBase {
  effect: string
  difficulty: string
  ingredients?: ElixirIngredient[]
}

type Elixir = ElixirDetailed

enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

type DifficultyLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'
  | 'Master'
  | 'Challenging'

const elixirs = ref<Elixir[]>([
  { id: '1', name: 'Felix Felicis', effect: 'Grants luck', difficulty: 'Advanced' },
  { id: '2', name: 'Amortentia', effect: 'Powerful love potion', difficulty: 'Advanced' },
  { id: '3', name: 'Polyjuice Potion', effect: 'Transforms appearance', difficulty: 'Challenging' },
  { id: '4', name: 'Veritaserum', effect: 'Forces truth-telling', difficulty: 'Master' },
  { id: '5', name: 'Pepperup Potion', effect: 'Cures common cold', difficulty: 'Beginner' },
])

const elixirIngredients = reactive({
  '1': [
    { name: 'Ashwinder egg', quantity: 1 },
    { name: 'Horseradish', quantity: '2 tbsp' },
    { name: 'Squill bulb', quantity: 1 },
  ],
  '2': [
    { name: 'Pearl dust', quantity: '2 scoops' },
    { name: 'Rose thorns', quantity: 3 },
    { name: 'Peppermint', quantity: '4 leaves' },
  ],
  '3': [
    { name: 'Lacewing flies', quantity: '12 units' },
    { name: 'Leeches', quantity: '3 units' },
    { name: 'Knotgrass', quantity: '1 bundle' },
  ],
  '4': [
    { name: 'Jobberknoll feathers', quantity: 7 },
    { name: 'Sopophorous bean', quantity: '12 units' },
  ],
  '5': [
    { name: 'Mandrake root', quantity: '1 piece' },
    { name: 'Bicorn horn', quantity: '2 pinches' },
  ],
})

const state = reactive({
  currentView: 'grid',
  selectedElixir: null as Elixir | null,
  filters: {
    name: '',
    difficulty: [] as string[],
    effectContains: '',
  },
  pagination: {
    page: 1,
    rows: 5,
    totalPages: computed(() => Math.ceil(filteredElixirs.value.length / state.pagination.rows)),
  },
  sorting: {
    field: 'name',
    order: 1,
  },
  showDialog: false,
  loadedIngredients: {} as Record<string, ElixirIngredient[]>,
  chartData: null as any,
  loadState: {
    ingredients: false,
    elixirs: true,
    details: false,
  },
})

const loadState = ref({
  loading: false,
  error: null as any,
})

const fetchElixirs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (Math.random() > 0.3) {
    return elixirs.value
  } else {
    return { data: elixirs.value, meta: { count: elixirs.value.length } }
  }
}

async function loadIngredients(elixirId: string) {
  state.loadState.ingredients = true
  await new Promise((resolve) => setTimeout(resolve, 300))

  state.loadedIngredients[elixirId] =
    elixirIngredients[elixirId as keyof typeof elixirIngredients] || []
  state.loadState.ingredients = false
}

const { data, isLoading, error } = useQuery({
  queryKey: ['elixirs'],
  queryFn: fetchElixirs,
} as any)

const filteredElixirs = computed(() => {
  if (!data.value) return []

  const elixirData = Array.isArray(data.value)
    ? data.value
    : data.value && data.value.data
      ? data.value.data
      : []

  return elixirData.filter((elixir: Elixir) => {
    const nameMatch = elixir.name.toLowerCase().includes(state.filters.name.toLowerCase())
    const difficultyMatch =
      state.filters.difficulty.length === 0 || state.filters.difficulty.includes(elixir.difficulty)
    const effectMatch =
      !state.filters.effectContains ||
      (elixir.effect &&
        elixir.effect.toLowerCase().includes(state.filters.effectContains.toLowerCase()))

    return nameMatch && difficultyMatch && effectMatch
  })
})

const paginatedElixirs = computed(() => {
  const start = (state.pagination.page - 1) * state.pagination.rows
  const end = start + state.pagination.rows
  return filteredElixirs.value.slice(start, end)
})

const processedElixirs = computed(() => {
  const result = paginatedElixirs.value.map((elixir) => {
    if (!state.loadedIngredients[elixir.id]) {
      loadIngredients(elixir.id)
    }

    return {
      ...elixir,
      difficulty: elixir.difficulty.toUpperCase(),
      difficultyColor: getDifficultyColor(elixir.difficulty),
      effectShort:
        elixir.effect.length > 20 ? elixir.effect.substring(0, 20) + '...' : elixir.effect,
      ...getIngredientSummary(elixir.id),
    }
  })

  if (state.sorting.field) {
    result.sort((a, b) => {
      const valA = a[state.sorting.field]
      const valB = b[state.sorting.field]
      return valA > valB ? state.sorting.order : valA < valB ? -state.sorting.order : 0
    })
  }

  return result
})

function getDifficultyColor(difficulty: string): string {
  if (!state.chartData) {
    prepareChartData()
  }

  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500'
    case 'Intermediate':
      return 'bg-blue-500'
    case 'Advanced':
      return 'bg-purple-500'
    case 'Challenging':
      return 'bg-orange-500'
    case 'Master':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

function getIngredientSummary(elixirId: string) {
  const ingredients = state.loadedIngredients[elixirId] || []
  return {
    ingredientCount: ingredients.length,
    ingredientsList: ingredients.map((i) => i.name).join(', '),
    complex: ingredients.length > 3,
  }
}

function toggleView() {
  const views = ['grid', 'table', 'card', 'chart']
  const currentIndex = views.indexOf(state.currentView)
  state.currentView = views[(currentIndex + 1) % views.length]

  state.pagination.page = 1

  if (state.currentView === 'chart') {
    prepareChartData()
  }
}

function prepareChartData() {
  const difficultyCounts: Record<string, number> = {}

  filteredElixirs.value.forEach((elixir: Elixir) => {
    difficultyCounts[elixir.difficulty] = (difficultyCounts[elixir.difficulty] || 0) + 1
  })

  const labels = Object.keys(difficultyCounts)
  const data = labels.map((label) => difficultyCounts[label])

  state.chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map(getDifficultyColor),
      },
    ],
  }
}

watch(
  () => state.filters,
  () => {
    state.pagination.page = 1

    if (state.currentView === 'chart') {
      prepareChartData()
    }
  },
  { deep: true },
)

onMounted(() => {
  const container = document.querySelector('.elixirs-container')
  if (container) {
    container.classList.add('mounted')
  }

  setTimeout(() => {
    state.currentView = 'grid'
  }, 200)

  Object.keys(elixirIngredients).forEach((id) => {
    loadIngredients(id)
  })
})

function changePage(direction: 'prev' | 'next') {
  if (direction === 'prev' && state.pagination.page > 1) {
    state.pagination.page--
  } else if (direction === 'next' && state.pagination.page < state.pagination.totalPages) {
    state.pagination.page++
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function highlightElixir(id: string) {
  const element = document.querySelector(`[data-elixir-id="${id}"]`)
  if (element) {
    element.classList.add('highlight-pulse')
    setTimeout(() => {
      element.classList.remove('highlight-pulse')
    }, 1000)
  }
}
</script>

<template>
  <div class="elixirs-container">
    <Card class="mb-4">
      <template #title>
        <div class="flex justify-between items-center">
          <span>Magical Elixirs</span>
          <Button
            :icon="'fas fa-' + (state.currentView === 'grid' ? 'table' : 'grip')"
            @click="toggleView"
            @click.prevent="state.showDialog = !state.showDialog"
            class="p-button-sm"
            :class="{ 'p-button-secondary': state.currentView !== 'grid' }"
          />
        </div>
      </template>

      <template #content>
        <p class="mb-4">Explore magical elixirs and potions from the wizarding world.</p>

        <div class="filters mb-4 border p-3 rounded-md">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block mb-1">Name</label>
              <InputText
                v-model="state.filters.name"
                placeholder="Filter by name..."
                class="w-full"
              />
            </div>
            <div>
              <label class="block mb-1">Difficulty</label>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="difficulty in [
                    'Beginner',
                    'Intermediate',
                    'Advanced',
                    'Challenging',
                    'Master',
                  ]"
                  :key="difficulty"
                  :label="difficulty"
                  :class="[
                    'p-button-sm',
                    state.filters.difficulty.includes(difficulty)
                      ? 'p-button-primary'
                      : 'p-button-outlined',
                  ]"
                  @click="
                    state.filters.difficulty.includes(difficulty)
                      ? (state.filters.difficulty = state.filters.difficulty.filter(
                          (d) => d !== difficulty,
                        ))
                      : state.filters.difficulty.push(difficulty)
                  "
                />
              </div>
            </div>
            <div>
              <label class="block mb-1">Effect Contains</label>
              <InputText
                v-model="state.filters.effectContains"
                placeholder="Filter by effect..."
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center py-8">
          <ProgressSpinner />
        </div>
        <div v-else-if="error" class="text-red-500 p-4 border border-red-300 rounded">
          An error occurred while loading elixirs. Please try again later.
        </div>
        <div v-else-if="filteredElixirs.length === 0" class="text-center py-8">
          No elixirs match your filters.
        </div>

        <div v-else-if="state.currentView === 'grid'" class="grid-view">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              v-for="elixir in processedElixirs"
              :key="elixir.id"
              :data-elixir-id="elixir.id"
              class="elixir-card"
              @click="((state.selectedElixir = elixir), (state.showDialog = true))"
            >
              <template #header>
                <div
                  :class="[
                    elixir.difficultyColor,
                    'h-12 flex items-center justify-center text-white',
                  ]"
                >
                  <i class="fas fa-flask text-2xl"></i>
                </div>
              </template>
              <template #title>
                <div class="text-lg font-bold truncate">{{ elixir.name }}</div>
              </template>
              <template #content>
                <div class="mb-2">
                  <div><strong>Effect:</strong> {{ elixir.effectShort }}</div>
                  <div><strong>Difficulty:</strong> {{ elixir.difficulty }}</div>
                  <div v-if="elixir.ingredientCount">
                    <strong>Ingredients:</strong> {{ elixir.ingredientCount }}
                    <span v-if="elixir.complex" class="text-red-500 ml-1">(Complex)</span>
                  </div>
                </div>

                <div class="text-right">
                  <Button
                    label="View Details"
                    class="p-button-sm"
                    @click.stop="highlightElixir(elixir.id)"
                  />
                </div>
              </template>
            </Card>
          </div>

          <div class="flex justify-between items-center mt-4">
            <div>
              Showing {{ (state.pagination.page - 1) * state.pagination.rows + 1 }} to
              {{ Math.min(state.pagination.page * state.pagination.rows, filteredElixirs.length) }}
              of {{ filteredElixirs.length }} elixirs
            </div>
            <div class="flex gap-2">
              <Button
                icon="fas fa-chevron-left"
                :disabled="state.pagination.page === 1"
                @click="changePage('prev')"
                class="p-button-sm"
              />
              <Button
                v-for="page in state.pagination.totalPages"
                :key="page"
                :label="page.toString()"
                :class="[
                  'p-button-sm',
                  page === state.pagination.page ? 'p-button-primary' : 'p-button-outlined',
                ]"
                @click="state.pagination.page = page"
              />
              <Button
                icon="fas fa-chevron-right"
                :disabled="state.pagination.page === state.pagination.totalPages"
                @click="changePage('next')"
                class="p-button-sm"
              />
            </div>
          </div>
        </div>

        <div v-else-if="state.currentView === 'table'" class="table-view">
          <DataTable
            :value="processedElixirs"
            stripedRows
            :paginator="false"
            :sortField="state.sorting.field"
            :sortOrder="state.sorting.order"
            @sort="
              (e) => {
                state.sorting.field = e.sortField
                state.sorting.order = e.sortOrder
              }
            "
            tableStyle="min-width: 50rem"
            class="elixir-table"
          >
            <Column field="name" header="Name" sortable>
              <template #body="{ data }">
                <div class="font-bold">{{ data.name }}</div>
              </template>
            </Column>
            <Column field="effect" header="Effect" sortable>
              <template #body="{ data }">
                <div v-html="data.effect.replace(/potion/gi, '<em>potion</em>')"></div>
              </template>
            </Column>
            <Column field="difficulty" header="Difficulty" sortable>
              <template #body="{ data }">
                <div :class="[data.difficultyColor, 'text-white px-2 py-1 rounded text-center']">
                  {{ data.difficulty }}
                </div>
              </template>
            </Column>
            <Column field="ingredientCount" header="Ingredients" sortable>
              <template #body="{ data }">
                {{ data.ingredientCount || 'Unknown' }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="{ data }">
                <Button
                  icon="fas fa-info-circle"
                  @click="((state.selectedElixir = data), (state.showDialog = true))"
                  class="p-button-sm p-button-rounded"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <div v-else-if="state.currentView === 'card'" class="card-view">
          <div class="flex flex-col space-y-4">
            <div
              v-for="elixir in processedElixirs"
              :key="elixir.id"
              :data-elixir-id="elixir.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              @click="((state.selectedElixir = elixir), (state.showDialog = true))"
            >
              <div class="flex items-center">
                <div
                  :class="[
                    elixir.difficultyColor,
                    'w-12 h-12 flex items-center justify-center text-white rounded-full mr-4',
                  ]"
                >
                  <i class="fas fa-flask text-xl"></i>
                </div>
                <div>
                  <div class="text-xl font-bold">{{ elixir.name }}</div>
                  <div>{{ elixir.effect }}</div>
                </div>
                <div class="ml-auto text-right">
                  <div class="text-sm text-gray-600">{{ elixir.difficulty }}</div>
                  <div v-if="elixir.ingredientCount" class="text-sm">
                    {{ elixir.ingredientCount }} ingredients
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="state.currentView === 'chart'" class="chart-view">
          <div v-if="state.chartData" class="max-w-xl mx-auto py-4">
            <Chart type="pie" :data="state.chartData" />
            <div class="text-center mt-4 text-sm text-gray-600">
              Distribution of elixirs by difficulty level
            </div>
          </div>
          <div v-else class="text-center py-8">Loading chart data...</div>
        </div>

        <Dialog
          v-model:visible="state.showDialog"
          :header="state.selectedElixir ? state.selectedElixir.name : 'Elixir Details'"
          :style="{ width: '90%', maxWidth: '30rem' }"
          modal
        >
          <div v-if="state.selectedElixir" class="elixir-details">
            <div
              :class="[
                state.selectedElixir.difficultyColor,
                'w-full py-2 px-4 mb-4 text-white text-center rounded',
              ]"
            >
              {{ state.selectedElixir.difficulty }} Difficulty
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-bold mb-2">Effect</h3>
              <p>{{ state.selectedElixir.effect }}</p>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-bold mb-2">Ingredients</h3>
              <div v-if="state.loadedIngredients[state.selectedElixir.id]">
                <div v-if="state.loadedIngredients[state.selectedElixir.id].length > 0">
                  <ul class="list-disc pl-5">
                    <li
                      v-for="(ingredient, idx) in state.loadedIngredients[state.selectedElixir.id]"
                      :key="idx"
                      class="mb-1"
                    >
                      {{ ingredient.name }} - {{ ingredient.quantity }}
                    </li>
                  </ul>
                </div>
                <div v-else-if="state.selectedElixir.ingredientCount === 0">
                  No ingredients available
                </div>
                <div v-else>
                  <ProgressSpinner style="width: 50px; height: 50px" />
                </div>
              </div>
              <div v-else>Loading ingredients...</div>
            </div>

            <div class="flex justify-end">
              <Button
                label="Close"
                icon="fas fa-times"
                @click="state.showDialog = false"
                class="p-button-outlined mr-2"
              />
              <Button
                label="Brew Elixir"
                icon="fas fa-flask"
                @click="alert('Brewing feature not implemented yet')"
              />
            </div>
          </div>
        </Dialog>
      </template>
    </Card>

    <div class="debug-info hidden">
      <pre>{{ JSON.stringify(state, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.elixirs-container .elixir-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.elixirs-container .elixir-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.elixir-card .p-card-content {
  padding-bottom: 0 !important;
}

@keyframes highlight-pulse {
  0% {
    background-color: rgba(79, 70, 229, 0.1);
  }
  50% {
    background-color: rgba(79, 70, 229, 0.3);
  }
  100% {
    background-color: rgba(79, 70, 229, 0);
  }
}

.highlight-pulse {
  animation: highlight-pulse 1s ease-in-out;
}

:global(.p-dialog-content) {
  max-height: 70vh !important;
  overflow-y: auto !important;
}

@media (max-width: 768px) {
  .elixir-card {
    max-width: none !important;
  }
}

@media (max-width: 767px) {
  .elixir-card {
    margin-bottom: 1rem !important;
  }
}
</style>
