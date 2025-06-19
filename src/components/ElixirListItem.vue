<template>
  <div class="elixir-item w-full flex justify-between">
    <div>
      <h3>{{ elixir.name }}</h3>
      <p>Difficulty: {{ elixir.difficulty }}</p>
      <p>Effect: {{ elixir.effect || 'N/A' }}</p>
    </div>
    <div>
      <Button severity="info" @click="viewElixir(elixir)">
        <font-awesome-icon icon="fas fa-circle-info" />
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Elixir } from '@/types/Elixir.ts'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps<{
  elixir: Elixir
}>()

function viewElixir(selectedElixir: Elixir) {
  router.push({ name: 'ElixirDetail', params: { id: selectedElixir.id } })
}
</script>

<style scoped>
.elixir-item h3 {
  color: #4338ca !important;
  font-size: 18px !important;
}

/* Contradictory rules */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons {
  display: block;
}
.elixir-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
}
</style>
