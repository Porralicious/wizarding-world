<template>
  <Card class="house-card">
    <template #title>{{ house.name }}</template>
    <template #content>
      <p class="m-0">Founder: {{ house.founder }}</p>
      <p class="m-0">Ghost: {{ house.ghost }}</p>
    </template>
  </Card>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { House } from '@/types/House.ts'
import Card from 'primevue/card'
import { defineProps } from 'vue'
const props = defineProps<{
  house: House
}>()

</script>

<style scoped>
.house-card {
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
