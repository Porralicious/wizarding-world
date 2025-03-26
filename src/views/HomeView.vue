<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()

const menuCards = ref([
  {
    title: 'Houses',
    description: 'Explore the different houses of the wizarding world.',
    icon: 'fas fa-building',
    route: '/houses',
    color: 'bg-primary',
    visible: false,
  },
  {
    title: 'Spells',
    description: 'Discover various spells from the wizarding world.',
    icon: 'fas fa-bolt',
    route: '/spells',
    color: 'bg-primary',
    visible: false,
  },
  {
    title: 'Elixirs',
    description: 'Explore magical elixirs and potions from the wizarding world.',
    icon: 'fas fa-flask',
    route: '/elixirs',
    color: 'bg-primary',
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
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
          Welcome to the <span class="text-primary">Wizarding World</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the magical universe through our interactive catalog
        </p>
      </div>

      <!-- Enhanced responsive grid with more breakpoints and better spacing -->
      <div
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center"
      >
        <div
          v-for="(card, index) in menuCards"
          :key="index"
          class="card-container w-full flex justify-center"
          :class="{ 'card-visible': card.visible }"
        >
          <Card
            class="w-full max-w-md cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
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
              <div class="text-xl sm:text-2xl font-bold px-1">{{ card.title }}</div>
            </template>
            <template #content>
              <p class="mb-4 flex-grow px-1">{{ card.description }}</p>
            </template>
            <template #footer>
              <div class="flex justify-end pt-2">
                <Button class="flex items-center">
                  Explore <i class="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </template>
          </Card>
        </div>
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
</style>
