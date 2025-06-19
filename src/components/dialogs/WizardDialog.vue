<template>
  <div class="grid grid-cols-1 gap-4">
    <div>
      <label class="font-semibold">Name:</label>
      <p>{{ wizardName }}</p>
    </div>
    <div>
      <label class="font-semibold">Elixirs:</label>
      <i v-if="wizard.elixirs.length == 0">None</i>
      <ul v-else class="space-y-2">
        <li v-for="elixir in wizard.elixirs" :key="elixir.id">
          <RouterLink :to="`/elixirs/${elixir.id}`" class="text-blue-600 hover:underline">
            {{ elixir.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Wizard } from '@/types/Wizard'
import { computed } from 'vue'
const props = defineProps<{
  wizard: Wizard
}>()

const wizardName = computed(() => {
  let name = ''
  if (props.wizard.firstName) {
    name += props.wizard.firstName + ''
  }
  if (props.wizard.lastName) {
    name += props.wizard.lastName
  }
  return name.trim()
})
</script>
