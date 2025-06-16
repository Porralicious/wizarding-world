import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),    },
    {
      path: '/houses',
      name: 'houses',
      component: () => import('../views/HousesView.vue'),
    },
    {
      path: '/houses/:id',
      name: 'HouseDetail',
      component: () => import('../views/HouseDetailView.vue'),
    },
    {
      path: '/spells',
      name: 'spells',
      component: () => import('../views/SpellsView.vue'),
    },
    {
      path: '/spells/:id',
      name: 'spell-details',
      component: () => import('../views/SpellDetailsView.vue'),
    },
    {
      path: '/elixirs',
      name: 'elixirs',
      component: () => import('../views/ElixirsView.vue'),
    },
    {
      path: '/elixirs/:id',
      name: 'ElixirDetail',
      component: () => import('../views/ElixirDetailView.vue'),
      props: true
    },
    {
      path: '/wizards',
      name: 'wizards',
      component: () => import('../views/WizardsView.vue'),
    },
  ],
})

export default router
