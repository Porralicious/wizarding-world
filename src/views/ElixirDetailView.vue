

<template>
    <template v-if="isLoading">
        <Skeleton class="mb-2"></Skeleton>
        <Skeleton width="10rem" class="mb-2"></Skeleton>
        <Skeleton width="5rem" class="mb-2"></Skeleton>
    </template>
    <template v-else>
        <Panel :header="elixir.name">
            <template #icons>
                <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle">
                    <FontAwesomeIcon icon="fas fa-heart"/>
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
                <Chip v-for="ingredient in elixir?.ingredients" :label="ingredient.name" class="m-1 text-sm"></Chip>
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
    
    <p>{{  }}</p>
</template>
<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import { useRoute } from 'vue-router'
import { useElixir } from '@/composables/useElixirs'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const route = useRoute()
const { data:elixir , isLoading , error} = useElixir(route.params.id)
</script>