<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import type { House } from '../types/House'
import HouseCard from '../components/HouseCard.vue'
import { useWizardingWorldStore } from '../stores/wizardingWorld'

const wizardingStore = useWizardingWorldStore()
const loading = ref(false)
const error = ref(null)
// const houses = wizardingStore.houses

// const fetchHouses = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return houses.value
// }

// const { data, isLoading, error } = useQuery({
//   queryKey: ['houses'],
//   queryFn: fetchHouses,
// })

// const tableData = reactive({
//   houses: [],
//   selectedHouse: null,
// })

// const lastSelectedHouse = ref<string | null>(null)

// function updateHousePoints(houseId: string, points: number) {
//   const house = houses.value.find((h) => h.id === houseId)
//   if (house) {
//     house.house_points = points
//   }
// }

// function selectHouse(house: House) {
//   tableData.selectedHouse = house
//   wizardingStore.selectHouse(house.id)
//   lastSelectedHouse.value = house.name
// }

// watch(
//   () => wizardingStore.selectedHouse,
//   (newHouse) => {
//     if (newHouse) {
//       tableData.selectedHouse = houses.value.find((h) => h.id === newHouse.id) || null
//     }
//   },
// )

onMounted(() => {
  document.title = 'Hogwarts Houses'
  // if (wizardingStore.houses) {
  //   houses.value = [...wizardingStore.houses]
  // }
  loading.value = true
  wizardingStore
    .fetchHouses()
    .catch((err) => {
      error.value = err
    })
    .finally(() => {
      loading.value = false
    })
})

onUnmounted(() => {
  // No need to clear the timer as it's not used
})
</script>

<template>
  <h1>Houses</h1>
  <div v-if="loading">Loading...</div>

  <div v-else class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
    <div v-for="house in wizardingStore.houses" :key="house.id" class="">
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
