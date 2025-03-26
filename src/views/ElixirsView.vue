<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Elixir {
  id: string
  name: string
  effect: string
  difficulty: string
}

// Example data - in a real app, you would fetch this from an API
const elixirs = ref<Elixir[]>([
  { id: '1', name: 'Felix Felicis', effect: 'Grants luck', difficulty: 'Advanced' },
  { id: '2', name: 'Amortentia', effect: 'Powerful love potion', difficulty: 'Advanced' },
  { id: '3', name: 'Polyjuice Potion', effect: 'Transforms appearance', difficulty: 'Challenging' },
  { id: '4', name: 'Veritaserum', effect: 'Forces truth-telling', difficulty: 'Master' },
  { id: '5', name: 'Pepperup Potion', effect: 'Cures common cold', difficulty: 'Beginner' },
])

// Function to fetch elixirs (simulated)
const fetchElixirs = async () => {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return elixirs.value
}

// TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['elixirs'],
  queryFn: fetchElixirs,
})
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Elixirs</template>
      <template #content>
        <p class="mb-4">Explore magical elixirs and potions from the wizarding world.</p>

        <div v-if="isLoading" class="flex justify-center py-4">Loading elixirs...</div>
        <div v-else-if="error" class="text-red-500">An error occurred while loading elixirs.</div>
        <div v-else>
          <DataTable :value="data" stripedRows paginator :rows="10" tableStyle="min-width: 50rem">
            <Column field="name" header="Name" sortable></Column>
            <Column field="effect" header="Effect" sortable></Column>
            <Column field="difficulty" header="Difficulty" sortable></Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>
