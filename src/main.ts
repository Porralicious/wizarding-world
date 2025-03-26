import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { definePreset } from '@primeuix/themes'

import App from './App.vue'
import router from './router'

const wizardingPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#E3EEFF',
      100: '#BBD5FF',
      200: '#91BBFF',
      300: '#669EFF',
      400: '#3A84FF',
      500: '#1966FF',
      600: '#1351CC',
      700: '#0E3E99',
      800: '#092966',
      900: '#041533',
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: wizardingPreset,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})
app.use(VueQueryPlugin)

app.mount('#app')
