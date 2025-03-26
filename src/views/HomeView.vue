<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'

const router = useRouter()

const menuCards = ref([
  {
    title: 'Houses',
    description: 'Explore the different houses of the wizarding world.',
    icon: 'fas fa-building',
    route: '/houses',
    color: 'bg-gradient-to-r from-red-500 to-orange-500',
    visible: false,
  },
  {
    title: 'Spells',
    description: 'Discover various spells from the wizarding world.',
    icon: 'fas fa-bolt',
    route: '/spells',
    color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    visible: false,
  },
  {
    title: 'Elixirs',
    description: 'Explore magical elixirs and potions from the wizarding world.',
    icon: 'fas fa-flask',
    route: '/elixirs',
    color: 'bg-gradient-to-r from-green-500 to-teal-500',
    visible: false,
  },
])

const navigateTo = (route) => {
  router.push(route)
}

onMounted(() => {
  // Animate cards appearing with a staggered delay
  menuCards.value.forEach((card, index) => {
    setTimeout(
      () => {
        card.visible = true
      },
      200 * (index + 1),
    )
  })
})
</script>

<template>
  <main class="py-6 px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold mb-4">Welcome to the Wizarding World</h1>
      <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
        Explore the magical universe through our interactive catalog
      </p>
    </div>

    <!-- Enhanced responsive grid with more breakpoints and better spacing -->
    <div
      class="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
    >
      <div
        v-for="(card, index) in menuCards"
        :key="index"
        class="card-container flex"
        :class="{ 'card-visible': card.visible }"
      >
        <Card
          class="w-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
          @click="navigateTo(card.route)"
        >
          <template #header>
            <div
              :class="[
                card.color,
                'h-36 sm:h-40 flex items-center justify-center text-white rounded-t-lg',
              ]"
            >
              <i :class="[card.icon, 'text-5xl sm:text-6xl']"></i>
            </div>
          </template>
          <template #title>
            <div class="text-xl sm:text-2xl font-bold text-gray-800 px-1">{{ card.title }}</div>
          </template>
          <template #content>
            <p class="text-gray-600 mb-4 flex-grow px-1">{{ card.description }}</p>
          </template>
          <template #footer>
            <div class="flex justify-end pt-2">
              <button
                class="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center"
              >
                Explore <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card-container {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.card-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Add hover animations */
.card-container:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

/* Enhance animations for larger screens */
@media (min-width: 768px) {
  .card-container:hover {
    transform: translateY(-8px) scale(1.02);
  }
}

/* Fix text colors */
:deep(.p-card-title),
:deep(.p-card-content) {
  color: #333 !important;
}

:deep(.p-card-content p) {
  color: #666 !important;
}

:deep(.p-card-footer) {
  color: #333 !important;
}
</style>
