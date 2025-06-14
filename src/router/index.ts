import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HousesView from '../views/HousesView.vue'
import HouseDetail from '../views/HouseDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/houses',
      name: 'houses',
      component: HousesView,
      children: [
        {
          path: ':id',
          component: HouseDetail,
        },
      ],
    },
    {
      path: '/house/:id',
      name: 'house-detail',
      component: HouseDetail,
      props: true, // Allows the router to pass the route params as props to the component
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
      path: '/wizards',
      name: 'wizards',
      component: () => import('../views/WizardsView.vue'),
    },
  ],
})

export default router
