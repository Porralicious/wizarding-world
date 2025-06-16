import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { Elixir } from '@/types/Elixir'

const API_BASE = 'https://wizard-world-api.herokuapp.com'

const fetchElixirs = async (): Promise<Elixir[]> => {
  const { data } = await axios.get(`${API_BASE}/Elixirs`)
  return data
}

const fetchElixirById = async (id: string): Promise<Elixir> => {
  const { data } = await axios.get(`${API_BASE}/Elixirs/${id}`)
  return data
}

export function useElixirs() {
  return useQuery({
    queryKey: ['elixirs'],
    queryFn: fetchElixirs,
    staleTime: 1000 * 60 * 5,
  })
}

export function useElixir(id: string) {
  return useQuery({
    queryKey: ['elixir', id],
    queryFn: () => fetchElixirById(id),
    enabled: !!id, // only fetch if id is defined
    staleTime: 1000 * 60 * 10,
  })
}
