<template>
  <template v-if="isLoading">
    <Skeleton class="mb-2"></Skeleton>
    <Skeleton width="10rem" class="mb-2"></Skeleton>
    <Skeleton width="5rem" class="mb-2"></Skeleton>
  </template>
  <template v-else>
    <ElixirCard :elixir="elixir"></ElixirCard>
  </template>
</template>
<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

import { useRoute } from 'vue-router'
import { useElixir } from '@/composables/useElixirs'
import ElixirCard from '@/components/ElixirCard.vue'

const route = useRoute()
const { data: elixir, isLoading, error } = useElixir(route.params.id)
</script>
