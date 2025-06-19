<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import { useWizardingWorldStore } from '@/stores/wizardingWorld'
import { useAuthStore } from './stores'
import { useOnline } from '@/composables/useOnline'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const { isOnline } = useOnline()
const items = ref([
  {
    label: 'Home',
    icon: 'fas fa-home',
    to: '/',
  },
  {
    label: 'Houses',
    icon: 'fas fa-building',
    to: '/houses',
  },
  {
    label: 'Spells',
    icon: 'fas fa-bolt',
    to: '/spells',
  },
  {
    label: 'Elixirs',
    icon: 'fas fa-flask',
    to: '/elixirs',
  },
  {
    label: 'Wizards',
    icon: 'fas fa-hat-wizard',
    to: '/wizards',
  },
])

const wizardingWorldStore = useWizardingWorldStore()
const authStore = useAuthStore()
authStore.init()

function logOut() {
  authStore.logout()
}
</script>

<template>
  <div v-if="!isOnline" class="bg-red-500 text-white text-center py-2">
    You are offline. Some features may not work.
  </div>
  <div class="app-container">
    <header>
      <div class="container mx-auto px-4 py-2">
        <Menubar :model="items">
          <template #item="{ item }">
            <router-link
              v-if="item.to"
              :to="item.to"
              class="p-menuitem-link"
              v-slot="{ href, navigate, isActive }"
            >
              <a :href="href" @click="navigate" :class="[isActive ? 'router-link-active' : '']">
                <FontAwesomeIcon :icon="item.icon" />
                <span class="p-menuitem-text ml-3">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
          <template v-if="authStore.user" #end>
            <FontAwesomeIcon
              v-tooltip="'Log Out'"
              icon="fas fa-right-from-bracket"
              @click="logOut"
            />
          </template>
        </Menubar>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <RouterView />
    </main>
  </div>
</template>
