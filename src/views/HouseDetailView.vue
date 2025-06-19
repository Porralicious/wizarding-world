<template>
  <template v-if="isLoading">
    <Skeleton></Skeleton>
  </template>
  <template v-else>
    <Panel :header="house.name">
      <p class="m-0">
        House Colours: <span>{{ house?.houseColours }}</span>
      </p>
      <p class="m-0">
        Founder: <span>{{ house?.founder }}</span>
      </p>
      <p class="m-0">
        Animal: <span>{{ house?.animal }}</span>
      </p>
      <p class="m-0">
        Element: <span>{{ house?.element }}</span>
      </p>
      <p class="m-0">
        Ghost: <span>{{ house?.ghost }}</span>
      </p>
      <p class="m-0">
        Common Room: <span>{{ house?.commonRoom }}</span>
      </p>
      <p class="m-0">
        Heads:
        <span class="m-1" v-for="head in house?.heads">{{
          head?.firstName + ' ' + head.lastName
        }}</span>
      </p>
      <p class="m-0">
        Traits:
        <span>{{ house.traits.map((trait) => trait.name).join(', ') }}</span>
      </p>
    </Panel>
  </template>
</template>
<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Panel from 'primevue/panel'
import { useHouse } from '@/composables/useHouses'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: house, isLoading, error } = useHouse(route.params.id)
</script>
