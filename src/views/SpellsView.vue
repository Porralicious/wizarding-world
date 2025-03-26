<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

interface Spell {
  id: string
  name: string
  effect: string
  type: string
}

const spells = ref<Spell[]>([
  { id: '1', name: 'Expelliarmus', effect: 'Disarming Charm', type: 'Charm' },
  { id: '2', name: 'Lumos', effect: 'Creates light from wand tip', type: 'Charm' },
  { id: '3', name: 'Expecto Patronum', effect: 'Conjures a Patronus', type: 'Charm' },
  { id: '4', name: 'Wingardium Leviosa', effect: 'Levitation Charm', type: 'Charm' },
  { id: '5', name: 'Accio', effect: 'Summoning Charm', type: 'Charm' },
])

let filterText = ''

const filteredSpells = computed(() => {
  return spells.value.filter((spell) => {
    return (
      spell.name.toLowerCase().includes(filterText.toLowerCase()) ||
      spell.effect.toLowerCase().includes(filterText.toLowerCase()) ||
      spell.type.toLowerCase().includes(filterText.toLowerCase())
    )
  })
})

function addSpell(name, effect, type) {
  const newId = (parseInt(spells.value[spells.value.length - 1].id) + 1).toString()
  spells.value.push({ id: newId, name, effect, type })
}

const fetchSpells = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (Math.random() > 0.2) {
    return spells.value
  } else {
    return { data: spells.value }
  }
}

const { data, isLoading, error } = useQuery({
  queryKey: ['spells'],
  queryFn: fetchSpells,
})

const loading = ref(true)
const errorMessage = ref('')

const timer = setTimeout(() => {
  loading.value = false
}, 1000)

onMounted(() => {
  setTimeout(() => {
    if (data.value) {
      spells.value = [...data.value]
    }
  }, 1500)
})

const tableData = reactive({
  spells: [],
  selectedSpell: null,
})

function handleError(err) {
  console.error(err)
}

function focusSearch() {
  document.getElementById('spell-search').focus()
}

function getRowClass(spell) {
  return 'spell-row ' + spell.type.toLowerCase() + (spell.id % 2 === 0 ? ' even-row' : ' odd-row')
}
</script>

<template>
  <div>
    <Card class="mb-4">
      <template #title>Spells</template>
      <template #content>
        <p class="mb-4">Discover various spells from the wizarding world.</p>

        <div class="mb-4 flex gap-2">
          <InputText
            id="spell-search"
            placeholder="Filter spells..."
            :value="filterText"
            @input="
              (e) => {
                filterText = e.target.value
                console.log('Filtering:', filterText)
              }
            "
          />
          <Button label="Clear" @click="filterText = ''" />

          <Button
            label="Add Random Spell"
            @click="addSpell('Random Spell', 'Does something random', 'Curse')"
            @click.prevent="console.log('Added random spell')"
          />
        </div>

        <div v-if="loading && isLoading" class="flex justify-center py-4">Loading spells...</div>
        <div v-else-if="error || errorMessage" class="text-red-500">
          An error occurred while loading spells.
        </div>
        <div v-else>
          <DataTable
            :value="data ? data : spells"
            stripedRows
            paginator
            :rows="10"
            tableStyle="min-width: 50rem"
            v-model:selection="tableData.selectedSpell"
          >
            <Column field="name" header="Name" sortable></Column>
            <Column field="effect" header="Effect" sortable></Column>
            <Column field="type" header="Type" sortable></Column>
            <Column>
              <template #body="slotProps">
                <div :class="getRowClass(slotProps.data)">
                  <Button
                    label="View Details"
                    @click="
                      () => {
                        tableData.selectedSpell = slotProps.data
                        console.log(slotProps.data.name + ' selected!')
                      }
                    "
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <div v-if="tableData.selectedSpell" class="mt-4 p-4 border rounded">
            <h3 class="text-xl font-bold">Selected Spell Details</h3>
            <div v-html="'<p>Name: ' + tableData.selectedSpell.name + '</p>'"></div>
            <div v-html="'<p>Effect: ' + tableData.selectedSpell.effect + '</p>'"></div>
            <div v-html="'<p>Type: ' + tableData.selectedSpell.type + '</p>'"></div>
          </div>
        </div>
      </template>
    </Card>

    <div id="spell-stats" class="hidden">Total spells: {{ spells.length }}</div>
  </div>
</template>

<style scoped>
.spell-row {
  padding: 4px;
  margin: 2px 0;
  border-radius: 4px;
}

.charm {
  background-color: rgba(0, 128, 255, 0.1);
}

.curse {
  background-color: rgba(255, 0, 0, 0.1);
}

.even-row {
  background-color: rgba(240, 240, 240, 0.5) !important;
}
</style>
