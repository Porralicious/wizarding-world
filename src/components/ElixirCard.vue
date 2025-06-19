<template>
  <Panel :header="elixir.name">
    <template #icons>
      <Button severity="danger" rounded text @click="toggleFavourite(elixir.id)">
        <FontAwesomeIcon :icon="isFavourite(elixir.id) ? 'fas fa-heart' : 'far fa-heart'" />
      </Button>
    </template>

    <p class="m-0">
      Effect: <span>{{ elixir?.effect }}</span>
    </p>

    <p class="m-0">
      Side Effects: <span>{{ elixir?.sideEffects }}</span>
    </p>

    <p class="m-0">
      Characteristics: <span>{{ elixir?.difficulty }}</span>
    </p>

    <p class="m-0">
      Ingredients:
      <Chip
        v-for="ingredient in elixir?.ingredients"
        :label="ingredient.name"
        class="m-1 text-sm"
      ></Chip>
    </p>

    <p class="m-0">
      Inventors:
      <span v-if="elixir?.inventors != []">{{ elixir?.manufacturer }}</span>
      <span v-else><i>N/A</i></span>
    </p>

    <p class="m-0">
      Manufacturer:
      <span v-if="elixir?.manufacturer">{{ elixir?.manufacturer }}</span>
      <span v-else><i>N/A</i></span>
    </p>
  </Panel>
</template>
<script setup lang="ts">
import type { Elixir } from '@/types/Elixir.ts'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useFavourites } from '@/composables/useFavourites'
const { toggleFavourite, isFavourite } = useFavourites('elixirs')
const props = defineProps<{
  elixir: Elixir
}>()
</script>
