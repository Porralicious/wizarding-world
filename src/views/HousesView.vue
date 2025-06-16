<script setup lang="ts">
import { onMounted } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import HouseCard from '../components/HouseCard.vue'

import { useHouses } from '@/composables/useHouses'

const { data, isLoading, error } = useHouses()

onMounted(() => {
  document.title = 'Hogwarts Houses'
})
</script>

<template>
  <h1>Houses</h1>
  <div v-if="isLoading">Loading...</div>

  <div v-else class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
    <div v-for="house in data" :key="house.id" class="">
      <HouseCard :house="house" />
    </div>
  </div>
</template>

<style scoped>
.house-row {
  padding: 4px;
  margin: 2px 0;
  border-radius: 4px;
}

.gryffindor {
  background-color: rgba(174, 0, 1, 0.1);
}

.hufflepuff {
  background-color: rgba(240, 199, 94, 0.1);
}

.ravenclaw {
  background-color: rgba(34, 47, 91, 0.1);
}

.slytherin {
  background-color: rgba(26, 71, 42, 0.1);
}
</style>
