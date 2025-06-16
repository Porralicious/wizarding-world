<template>
  <h1>{{ house.name }}</h1>
  <p>Animal: {{ house.animal }}</p>
  <div></div>
</template>
<script setup lang="ts">
import { useHouse } from '@/composables/useHouses'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data:house , isLoading , error} = useHouse(route.params.id)
</script>
