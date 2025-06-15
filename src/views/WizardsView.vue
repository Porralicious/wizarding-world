<template>
  <div class="wizards-view">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">Wizards</h1>

      <!-- Loading State -->
      <div v-if="store.loading.wizards" class="flex justify-center items-center py-8">
        <ProgressSpinner />
      </div>

      <!-- Error State -->
      <Message v-else-if="store.errors.wizards" severity="error" class="mb-4">
        {{ store.errors.wizards }}
        <template #action>
          <Button icon="pi pi-refresh" text @click="loadWizards" :loading="store.loading.wizards" />
        </template>
      </Message>

      <!-- DataTable -->
      <DataTable
        v-else
        v-model:filters="filters"
        :value="wizards"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :totalRecords="wizards.length"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :loading="store.loading.spells"
        filterDisplay="menu"
        :globalFilterFields="['firstName', 'lastName']"
        class="p-datatable-sm"
        stripedRows
        responsiveLayout="scroll"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">All Wizards ({{ wizards.length }})</h2>
            <div class="flex gap-2">
              <div class="p-input-icon-left">
                <!-- <InputIcon class="pi pi-search" /> -->
                <FontAwesomeIcon icon="fas fa-magnifying-glass" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search wizards..."
                  class="w-64"
                />
              </div>
              <Button
                @click="loadWizards"
                :loading="store.loading.wizards"
                severity="secondary"
                outlined
              >
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
              <Button
                size="small"
                text
                @click="viewWizard(data)"
                v-tooltip="'View Details'"
              >
                <font-awesome-icon icon="fas fa-eye" />
              </Button>
              <Button
                size="small"
                text
                severity="danger"
                @click="toggleFavorite(data)"
                v-tooltip="'Add to Favorites'"
              >
                <font-awesome-icon icon="fas fa-heart" />
              </Button>
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8">
            <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">No wizards found</p>
            <Button severity="info" @click="loadWizards" class="mt-4">
              <font-awesome-icon icon="fas fa-rotate-right" v-tooltip="'Reload'" />
            </Button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
  <!-- Wizard Details Dialog -->
  <Dialog
    v-model:visible="showWizardDialog"
    :header="selectedWizard?.firstName || 'Wizard Details'"
    :style="{ width: '50vw' }"
    :modal="true"
  >
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
import { useWizardingWorldStore } from '@/stores/wizardingWorld'
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

const store = useWizardingWorldStore()

// Reactive data
const showWizardDialog = ref(false)
const selectedWizard = ref<Wizard | null>(null)

// Filters for the DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Computed
const wizards = computed(() => store.wizards)

// Methods
const loadWizards = async () => {
  try {
    await store.fetchWizards()
  } catch (error) {
    console.error('Failed to load wizards:', error)
  }
}

const viewWizard = (wizard: Wizard) => {
  selectedWizard.value = wizard
  showWizardDialog.value = true
}

const toggleFavorite = (wizard: Wizard) => {
  // Implement favorite functionality
  console.log('Toggle favorite for:', wizard.firstName + wizard.lastName)
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Lifecycle
onMounted(() => {
   document.title = 'Powerful Wizards'
  if (store.wizards.length === 0) {
    loadWizards()
  }
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
