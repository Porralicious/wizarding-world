<template>
  <div v-if="spell" class="space-y-4">
    <div class="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
      <div>
        <label class="font-semibold">Name:</label>
        <p>{{ spell.name }}</p>
      </div>
      <div>
        <label class="font-semibold">Type:</label>
        <Tag v-if="spell.type" :value="spell.type" :severity="getTypeSeverity(spell.type)" />
      </div>
      <div>
        <label class="font-semibold">Incantation:</label>
        <i class="ml-1">{{ spell.incantation || 'None' }}</i>
      </div>
      <div>
        <label class="font-semibold">Can be verbal:</label>
        <p>{{ spell.canBeVerbal }}</p>
      </div>
      <div v-if="spell.light">
        <label class="font-semibold">Light:</label>
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-full border-2 border-gray-300"
            :style="{ backgroundColor: spell.light }"
          ></div>
          <span>{{ spell.light }}</span>
        </div>
      </div>
    </div>
    <div v-if="spell.effect">
      <label class="font-semibold">Effect:</label>
      <p class="mt-2">{{ spell.effect }}</p>
    </div>
    <div>
      <label class="font-semibold">Creator:</label>
      <p v-if="spell.creator">{{ spell.creator }}</p>
      <p v-else>Unknown</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Spell } from '@/types/Spell'
const props = defineProps<{
  spell: Spell
}>()

const getTypeSeverity = (type: string): string => {
  const severityMap: Record<string, string> = {
    Charm: 'success',
    Curse: 'danger',
    Hex: 'warning',
    Jinx: 'info',
    Spell: 'secondary',
    Transfiguration: 'success',
    Conjuration: 'info',
  }
  return severityMap[type] || 'secondary'
}
</script>
