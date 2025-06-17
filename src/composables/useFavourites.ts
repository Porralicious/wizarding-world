// src/composables/useFavourites.ts
import { ref, computed, watch } from 'vue'

export function useFavourites(storageKey: string) {
  const favourites = ref<string[]>([])

  const load = () => {
    const saved = localStorage.getItem(storageKey)
    favourites.value = saved ? JSON.parse(saved) : []
  }

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(favourites.value))
  }

  const toggle = (id: string) => {
    const index = favourites.value.indexOf(id)
    if (index > -1) {
      favourites.value.splice(index, 1)
    } else {
      favourites.value.push(id)
    }
    save()
  }

  const isFavourite = (id: string) => {
    return favourites.value.includes(id)
  }

  // Initialize when composable is used
  load()

  return {
    favourites,
    toggleFavourite: toggle,
    isFavourite,
    favouriteIds: computed(() => favourites.value),
  }
}
