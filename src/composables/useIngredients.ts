import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { Elixir } from '@/types/Elixir'

const fetchElixirs = async (): Promise<Elixir[]> => {
  const { data } = await axios.get('https://wizard-world-api.herokuapp.com/Ingredients')
  return data
}

export function useElixirs() {
  return useQuery({
    queryKey: ['elixirs'],
    queryFn: fetchElixirs,
    staleTime: 1000 * 60 * 5,
  })
}
