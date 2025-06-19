import { defineStore } from 'pinia'
import { users } from '@/data/mockUsers'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { username: string; role: string },
  }),
  actions: {
    login(username: string, password: string) {
      const found = users.find((u) => u.username === username && u.password === password)
      if (found) {
        this.user = { username: found.username, role: found.role }
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        return true
      }
      return false
    },
    logout() {
      this.user = null
      localStorage.removeItem('auth_user')
      router.push('/login')
    },
    init() {
      const stored = localStorage.getItem('auth_user')
      if (stored) {
        this.user = JSON.parse(stored)
      }
    },
  },
})
