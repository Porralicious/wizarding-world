declare module 'vue-router' {
  import type { Router, RouteRecordRaw } from 'vue-router/dist/vue-router'
  export type { RouteRecordRaw }
  export { 
    createRouter,
    createWebHistory,
    RouterLink,
    RouterView
  } from 'vue-router/dist/vue-router'
  export default Router
}
