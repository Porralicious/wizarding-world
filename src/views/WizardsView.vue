<template>
  <div class="wizards-view">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">Wizards</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <ProgressSpinner />
      </div>

      <!-- Error State -->
      <Message v-else-if="error" severity="error" class="mb-4">
        {{ error }}
        <template #action>
          <Button icon="pi pi-refresh" text @click="refetch" :loading="isLoading" />
        </template>
      </Message>

      <!-- DataTable -->
      <DataTable v-else v-model:filters="filters" :value="filteredSpells" :paginator="true" :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]" :totalRecords="filteredSpells.length"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" :loading="isLoading" filterDisplay="menu"
        :globalFilterFields="['firstName', 'lastName']" class="p-datatable-sm" stripedRows responsiveLayout="scroll">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">All Wizards ({{ filteredSpells.length }})</h2>
            <div class="flex gap-2">
              <Button type="button" outlined @click="filterByFavourites()">
                <FontAwesomeIcon icon="fas fa-heart"></FontAwesomeIcon>
              </Button>
              <div class="p-input-icon-left">
                <FontAwesomeIcon icon="fas fa-magnifying-glass" />
                <InputText v-model="filters['global'].value" placeholder="Search wizards..." class="w-64" />
              </div>
              <Button @click="refetch" :loading="isLoading" severity="secondary" outlined>
                <FontAwesomeIcon icon="fas fa-rotate-right" />
              </Button>
            </div>
          </div>
        </template>

        <Column field="firstName" header="First Name" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div class="font-medium">{{ data.firstName }}</div>
          </template>
        </Column>

        <Column field="lastName" header="Last Name" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div class="font-medium">{{ data.lastName }}</div>
          </template>
        </Column>

        <Column field="type" header="Elixirs" sortable style="min-width: 120px">
          <template #body="{ data }">
            <Badge v-if="data.elixirs" :value="data.elixirs.length" />
          </template>
        </Column>

        <Column header="Actions" style="min-width: 100px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button size="small" text @click="viewWizard(data)" v-tooltip="'View Details'">
                <font-awesome-icon icon="fas fa-eye" />
              </Button>
              <Button size="small" text severity="danger" @click="toggleFavourite(data.id)"
                v-tooltip="'Add to Favorites'">
                <FontAwesomeIcon :icon="isFavourite(data.id) ? 'fas fa-heart' : 'far fa-heart'" />
              </Button>
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8">
            <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">No wizards found</p>
            <Button severity="info" @click="refetch" class="mt-4">
              <FontAwesomeIcon icon="fas fa-rotate-right" v-tooltip="'Reload'" />
            </Button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
  <!-- Wizard Details Dialog -->
  <Dialog v-model:visible="showWizardDialog" :header="selectedWizard?.firstName || 'Wizard Details'"
    :style="{ width: '50vw' }" :modal="true">
    <div v-if="selectedWizard" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="font-semibold">Name:</label>
          <p>{{ selectedWizard.firstName + selectedWizard.lastName }}</p>
        </div>
        <div>
          <label class="font-semibold">Elixirs:</label>
          <Tag v-if="selectedWizard.elixirs.length > 0" :value="selectedWizard.elixirs.length" />
        </div>
      </div>
      <!-- <div v-if="selectedSpell.effect">
        <label class="font-semibold">Effect:</label>
        <p class="mt-2">{{ selectedSpell.effect }}</p>
      </div> -->
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { Wizard } from '@/types/Wizard'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Badge from 'primevue/badge'

import Dialog from 'primevue/dialog'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useWizards } from '@/composables/useWizards'
import { useFavourites } from '@/composables/useFavourites'
const { toggleFavourite, isFavourite } = useFavourites('wizards')

const { data, isLoading, error, refetch } = useWizards()
const showOnlyFavourites = ref(false)
// Reactive data
const showWizardDialog = ref(false)
const selectedWizard = ref<Wizard | null>(null)

// Filters for the DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const viewWizard = (wizard: Wizard) => {
  selectedWizard.value = wizard
  showWizardDialog.value = true
}

const filteredSpells = computed(() => {
  if (!data.value) return []
  if (showOnlyFavourites.value) {
    return data.value.filter(spell => isFavourite(spell.id))
  }
  return data.value
})

const filterByFavourites = () => {
  showOnlyFavourites.value = !showOnlyFavourites.value
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Lifecycle
onMounted(() => {
  document.title = 'Powerful Wizards'
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
