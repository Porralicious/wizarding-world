<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface House {
  id: string
  name: string
  founder: string
  house_points: number
}

// Example data - in a real app, you would fetch this from an API
const houses = ref<House[]>([
  { id: '1', name: 'Gryffindor', founder: 'Godric Gryffindor', house_points: 482 },
  { id: '2', name: 'Hufflepuff', founder: 'Helga Hufflepuff', house_points: 352 },
  { id: '3', name: 'Ravenclaw', founder: 'Rowena Ravenclaw', house_points: 426 },
  { id: '4', name: 'Slytherin', founder: 'Salazar Slytherin', house_points: 472 },
])

// Function to fetch houses (simulated)
const fetchHouses = async () => {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return houses.value
}

// TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['houses'],
  queryFn: fetchHouses,
})
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Houses</template>
      <template #content>
        <p class="mb-4">Explore the different houses of the wizarding world.</p>

        <div v-if="isLoading" class="flex justify-center py-4">Loading houses...</div>
        <div v-else-if="error" class="text-red-500">An error occurred while loading houses.</div>
        <div v-else>
          <DataTable :value="data" stripedRows paginator :rows="10" tableStyle="min-width: 50rem">
            <Column field="name" header="Name" sortable></Column>
            <Column field="founder" header="Founder" sortable></Column>
            <Column field="house_points" header="House Points" sortable></Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>
