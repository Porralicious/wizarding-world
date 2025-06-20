import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/houses',
      name: 'houses',
      component: () => import('../views/HousesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/houses/:id',
      name: 'HouseDetail',
      component: () => import('../views/HouseDetailView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/spells',
      name: 'spells',
      component: () => import('../views/SpellsView.vue'),
      meta: { requiresAuth: true, role: 'explorer' }
    },
    {
      path: '/elixirs',
      name: 'elixirs',
      component: () => import('../views/ElixirsView.vue'),
      meta: { requiresAuth: true, role: 'explorer' }
    },
    {
      path: '/elixirs/:id',
      name: 'ElixirDetail',
      component: () => import('../views/ElixirDetailView.vue'),
      meta: { requiresAuth: true, role: 'explorer' },
      props: true
    },
    {
      path: '/wizards',
      name: 'wizards',
      component: () => import('../views/WizardsView.vue'),
      meta: { requiresAuth: true, role: 'explorer' }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!auth.user) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== auth.user.role) {
      next('/') // or redirect to home
    } else {
      next()
    }
  } else {
    next()
  }
})


export default router
