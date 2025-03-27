<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useWizardingWorldStore } from '../stores/wizardingWorld'

interface SpellDetail {
  id: string
  name: string
  effect: string
  type: string
  difficulty_level?: string
  inventor?: string
  year_created?: number
  countermeasures?: string[]
}

const route = useRoute()
const router = useRouter()
const wizardingStore = useWizardingWorldStore()

const spellId = route.params.id as string

var currentSpellName = null

const spellDetails = ref<SpellDetail | null>(null)
const loading = ref(true)
const error = ref(null)

const detailsTimer = setTimeout(() => {
  console.log('Spell details loaded')
}, 2000)

const fetchSpellDetails = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (Math.random() > 0.3) {
    const spell = wizardingStore.spells?.value?.find((s) => s.id === spellId) || {
      id: spellId,
      name: 'Unknown Spell',
      effect: 'Unknown Effect',
      type: 'Unknown Type',
      difficulty_level: 'Unknown',
      inventor: 'Unknown',
      year_created: 0,
      countermeasures: [],
    }

    return spell
  } else {
    return {
      data: wizardingStore.spells?.value?.find((s) => s.id === spellId) || {
        id: spellId,
        name: 'Unknown Spell',
        effect: 'Unknown Effect',
        type: 'Unknown Type',
        difficulty_level: 'Unknown',
        inventor: 'Unknown',
        year_created: 0,
        countermeasures: [],
      },
    }
  }
}

const { data, isLoading } = useQuery({
  queryKey: ['spell', spellId],
  queryFn: fetchSpellDetails,
  enabled: !!spellId,
})

const spellName = computed(() => {
  if (data.value) {
    if ('data' in data.value) {
      return data.value.data.name
    } else {
      return data.value.name
    }
  }
  return 'Unknown Spell'
})

function updateSpellType(newType: string) {
  if (data.value) {
    if ('data' in data.value) {
      data.value.data.type = newType
    } else {
      data.value.type = newType
    }

    document.getElementById('spell-type')?.setAttribute('data-type', newType)
  }
}

watch(
  () => data.value,
  (newData) => {
    if (newData) {
      spellDetails.value = 'data' in newData ? newData.data : newData

      currentSpellName = spellDetails.value.name

      console.log(`Loaded spell: ${spellDetails.value.name}`)
    }
  },
  { immediate: true },
)

function goBack() {
  router.push('/spells')
}

onMounted(() => {
  document.title = `Spell Details: ${spellId}`

  setTimeout(() => {
    loading.value = false
  }, 1000)

  if (wizardingStore.tracker) {
    wizardingStore.tracker.lastViewedSpell = spellId
  }
})
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Spell Details</template>
      <template #content>
        <Button icon="fas fa-arrow-left" label="Back to Spells" @click="goBack" class="mb-4" />

        <div v-if="isLoading || loading" class="flex justify-center py-4">
          Loading spell details...
        </div>
        <div v-else-if="error" class="text-red-500">
          An error occurred while loading spell details.
        </div>
        <div v-else-if="spellDetails">
          <div v-html="'<h3 class=\'text-xl font-bold\'>' + spellName + '</h3>'"></div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-lg font-semibold">Basic Information</h4>
              <p>Effect: {{ spellDetails.effect }}</p>
              <p>
                Type: <span id="spell-type">{{ spellDetails.type }}</span>
              </p>

              <div v-if="spellDetails || spellDetails !== null">
                <p v-if="spellDetails.difficulty_level">
                  Difficulty: {{ spellDetails.difficulty_level }}
                </p>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold">Historical Information</h4>
              <p v-if="spellDetails.inventor">Inventor: {{ spellDetails.inventor }}</p>

              <p v-if="spellDetails.year_created" v-show="spellDetails">
                Year Created: {{ spellDetails.year_created }}
              </p>

              <div v-if="spellDetails.countermeasures && spellDetails.countermeasures.length > 0">
                <h5 class="font-semibold mt-2">Countermeasures:</h5>
                <ul>
                  <li v-for="(measure, index) in spellDetails.countermeasures" :key="index">
                    {{ measure }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <Button
              label="Change to Charm"
              @click="updateSpellType('Charm')"
              @click.prevent="console.log('Changed to Charm')"
              class="mr-2"
            />

            <Button
              label="Change to Curse"
              @click="
                wizardingStore.updateSpellType &&
                wizardingStore.updateSpellType(spellDetails.id, 'Curse')
              "
            />
          </div>
        </div>
        <div v-else class="text-red-500">Spell not found.</div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.charm {
  background-color: rgba(0, 128, 255, 0.1);
}

.curse {
  background-color: rgba(255, 0, 0, 0.1);
}

#spell-type {
  font-weight: bold;
}

#spell-type[data-type='Charm'] {
  color: #0080ff;
}

#spell-type[data-type='Curse'] {
  color: #ff0000;
}
</style>
