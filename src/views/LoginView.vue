<!-- src/views/LoginView.vue -->
<template>
  <div class="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
    <Card class="w-full max-w-sm p-6">
      <template #title>Login</template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="block mb-1 text-sm font-medium">Username</label>
            <InputText id="username" v-model="username" class="w-full" />
          </div>

          <div>
            <label for="password" class="block mb-1 text-sm font-medium">Password</label>
            <Password id="password" v-model="password" class="w-full" toggleMask />
          </div>

          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

          <Button type="submit" label="Login" class="w-full" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'

// PrimeVue components
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

function handleLogin() {
  if (auth.login(username.value, password.value)) {
    router.push('/') // or dynamic route based on role
  } else {
    error.value = 'Invalid username or password.'
  }
}
</script>

<style scoped>

</style>
