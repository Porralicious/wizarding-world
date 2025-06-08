<template>
  <h1>{{ house.name }}</h1>
  <p>Animal: {{ house.animal }}</p>
  <div></div>
</template>
<script setup lang="ts">
import { useWizardingWorldStore } from '@/stores'
import { useRoute } from 'vue-router'
const wizardingStore = useWizardingWorldStore()
const route = useRoute()
const house = wizardingStore.getHouse(route.params.id)
</script>
