<template>
  <div class="spells-view">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">Spells</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <ProgressSpinner />
      </div>

      <!-- Error State -->
      <Message v-else-if="error" severity="error" class="mb-4">
        {{ error }}
        <template #action>
          <Button text @onClick="refetch" :loading="isLoading">
            <FontAwesomeIcon icon="fas fa-rotate-right" />
          </Button>
        </template>
      </Message>

      <!-- DataTable -->
      <DataTable
        v-else
        v-model:filters="filters"
        :value="filteredSpells"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :totalRecords="filteredSpells.length"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :loading="isLoading"
        filterDisplay="menu"
        :globalFilterFields="['name', 'type', 'incantation']"
        class="p-datatable-sm"
        stripedRows
        responsiveLayout="scroll"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">All Spells ({{ filteredSpells.length }})</h2>
            <div class="flex gap-2">
              <Button type="button" outlined @click="filterByFavourites()">
                <FontAwesomeIcon icon="fas fa-heart"></FontAwesomeIcon>
              </Button>
              <Button type="button" outlined @click="clearFilter()">
                <FontAwesomeIcon icon="fas fa-filter-circle-xmark"></FontAwesomeIcon>
              </Button>
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search spells..."
                  class="w-64"
                />
              </IconField>
              <Button @onClick="refetch" :loading="isLoading" severity="secondary" outlined>
                <FontAwesomeIcon icon="fas fa-rotate-right" />
              </Button>
            </div>
          </div>
        </template>

        <Column field="name" header="Name" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="font-medium">{{ data.name }}</div>
          </template>
        </Column>

        <Column field="incantation" header="Incantation" sortable style="min-width: 150px">
          <template #body="{ data }">
            <Badge
              v-if="data.incantation"
              :value="data.incantation"
              severity="info"
              class="font-mono"
            />
            <span v-else class="text-gray-400 italic">No incantation</span>
          </template>
        </Column>

        <Column
          field="type"
          header="Type"
          :showFilterMatchModes="false"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <Tag v-if="data.type" :value="data.type" :severity="getTypeSeverity(data.type)" />
            <span v-else class="text-gray-400 italic">Unknown</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <MultiSelect
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="spellTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Any"
              style="min-width: 14rem"
              :maxSelectedLabels="1"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <span>{{ slotProps.option.label }}</span>
                </div>
              </template>
            </MultiSelect>
          </template>
        </Column>

        <Column field="light" header="Light" sortable style="min-width: 100px">
          <template #body="{ data }">
            <div v-if="data.light" class="flex items-center gap-2">
              <div
                class="w-4 h-4 rounded-full border-2 border-gray-300"
                :style="{ backgroundColor: data.light }"
                :title="data.light"
              ></div>
              <span class="text-sm">{{ data.light }}</span>
            </div>
            <span v-else class="text-gray-400 italic">No light</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="spellLights"
              optionLabel="label"
              optionValue="value"
              placeholder="Select One"
              style="min-width: 12rem"
              :showClear="true"
            >
            </Select>
          </template>
        </Column>

        <Column field="effect" header="Effect" style="min-width: 300px">
          <template #body="{ data }">
            <div v-if="data.effect" class="text-sm">
              {{ truncateText(data.effect, 100) }}
            </div>
            <span v-else class="text-gray-400 italic">No description</span>
          </template>
        </Column>

        <Column header="Actions" style="min-width: 100px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button size="small" text @click="viewSpell(data)" v-tooltip="'View Details'">
                <FontAwesomeIcon icon="fas fa-eye" />
              </Button>
              <Button
                size="small"
                text
                severity="danger"
                @click="toggleFavourite(data.id)"
                v-tooltip="'Add to Favorites'"
              >
                <FontAwesomeIcon :icon="isFavourite(data.id) ? 'fas fa-heart' : 'far fa-heart'" />
              </Button>
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8">
            <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">No spells found</p>
            <Button label="Load Spells" icon="pi pi-refresh" @click="refetch" class="mt-4" />
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Spell Details Dialog -->
    <Dialog
      v-model:visible="showSpellDialog"
      :header="selectedSpell?.name || 'Spell Details'"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <SpellDialog :spell="selectedSpell"> </SpellDialog>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { SpellLight, SpellType, type Spell } from '@/types/Spell'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import SpellDialog from '@/components/dialogs/SpellDialog.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Select from 'primevue/select'
import { useSpells } from '@/composables/useSpells'
import { useFavourites } from '@/composables/useFavourites'
const { data, isLoading, error, refetch } = useSpells()
const { toggleFavourite, isFavourite } = useFavourites('spells')
// Reactive data
const showSpellDialog = ref(false)
const selectedSpell = ref<Spell | null>(null)
const filters = ref()
const showOnlyFavourites = ref(false)

// Filters for the DataTable
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    incantation: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    type: { value: null, matchMode: FilterMatchMode.IN },
    light: { value: null, matchMode: FilterMatchMode.EQUALS },
    effect: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

initFilters()
const spellTypes = Object.values(SpellType).map((value) => ({
  label: value,
  value,
}))

const spellLights = Object.values(SpellLight).map((value) => ({
  label: value,
  value,
}))

const clearFilter = () => {
  initFilters()
}

const filteredSpells = computed(() => {
  if (!data.value) return []
  if (showOnlyFavourites.value) {
    return data.value.filter((spell) => isFavourite(spell.id))
  }
  return data.value
})

const filterByFavourites = () => {
  showOnlyFavourites.value = !showOnlyFavourites.value
}
const viewSpell = (spell: Spell) => {
  selectedSpell.value = spell
  showSpellDialog.value = true
}

const getTypeSeverity = (type: string): string => {
  const severityMap: Record<string, string> = {
    Charm: 'success',
    Curse: 'danger',
    Hex: 'warning',
    Jinx: 'info',
    Spell: 'secondary',
    Transfiguration: 'success',
    Conjuration: 'info',
  }
  return severityMap[type] || 'secondary'
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Lifecycle
onMounted(() => {
  document.title = 'Stunning Spells'
})
</script>

<style scoped>
.spells-view {
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.p-datatable .p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0 0 1rem 0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  border-color: #e9ecef;
}

:deep(.p-paginator) {
  border: none;
  background: transparent;
  padding: 1rem 0 0 0;
}
</style>
