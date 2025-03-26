<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Spell {
  id: string
  name: string
  effect: string
  type: string
}

// Example data - in a real app, you would fetch this from an API
const spells = ref<Spell[]>([
  { id: '1', name: 'Expelliarmus', effect: 'Disarming Charm', type: 'Charm' },
  { id: '2', name: 'Lumos', effect: 'Creates light from wand tip', type: 'Charm' },
  { id: '3', name: 'Expecto Patronum', effect: 'Conjures a Patronus', type: 'Charm' },
  { id: '4', name: 'Wingardium Leviosa', effect: 'Levitation Charm', type: 'Charm' },
  { id: '5', name: 'Accio', effect: 'Summoning Charm', type: 'Charm' },
])

// Function to fetch spells (simulated)
const fetchSpells = async () => {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return spells.value
}

// TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['spells'],
  queryFn: fetchSpells,
})
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Spells</template>
      <template #content>
        <p class="mb-4">Discover various spells from the wizarding world.</p>

        <div v-if="isLoading" class="flex justify-center py-4">Loading spells...</div>
        <div v-else-if="error" class="text-red-500">An error occurred while loading spells.</div>
        <div v-else>
          <DataTable :value="data" stripedRows paginator :rows="10" tableStyle="min-width: 50rem">
            <Column field="name" header="Name" sortable></Column>
            <Column field="effect" header="Effect" sortable></Column>
            <Column field="type" header="Type" sortable></Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>
