import './assets/main.css'
import 'tailwindcss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import Aura from '@primeuix/themes/aura'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createIndexedDBPersister } from './utils/indexedDbPersister'
import { definePreset } from '@primeuix/themes'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faFlask } from '@fortawesome/free-solid-svg-icons'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHatWizard } from '@fortawesome/free-solid-svg-icons'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

import App from './App.vue'
import router from './router'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'

import { registerSW } from 'virtual:pwa-register'

library.add(faUserSecret)
library.add(faFlask)
library.add(faHome)
library.add(faBuilding)
library.add(faBolt)
library.add(faArrowRight)
library.add(faArrowLeft)
library.add(faEye)
library.add(faExternalLinkAlt)
library.add(faCircleInfo)
library.add(faTrash)
library.add(faHatWizard)
library.add(faRotateRight)
library.add(faHeart)
library.add(faMagnifyingGlass)
library.add(faFilterCircleXmark)
library.add(faHeartRegular)

const wizardingPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
  },
})

const app = createApp(App)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
})

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) updateSW(true)
  },
})

const indexedDbPersister = createIndexedDBPersister()

persistQueryClient({
  queryClient,
  persister: indexedDbPersister,
  maxAge: 1000 * 60 * 60 * 24,
})

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueQueryPlugin, { queryClient })
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Message', Message)
app.component('Badge', Badge)
app.component('Tag', Tag)
app.component('Dialog', Dialog)
app.directive('tooltip', Tooltip)
app.mount('#app')
