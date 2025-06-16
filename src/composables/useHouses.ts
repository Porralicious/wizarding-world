import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { House } from '@/types/House'

const API_BASE = 'https://wizard-world-api.herokuapp.com'

const fetchHouses = async (): Promise<House[]> => {
  const { data } = await axios.get(`${API_BASE}/Houses`)
  return data
}

const fetchHouseById = async (id: string): Promise<House> => {
  const { data } = await axios.get(`${API_BASE}/Houses/${id}`)
  return data
}

export function useHouses() {
  return useQuery({
    queryKey: ['houses'],
    queryFn: fetchHouses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useHouse(id: string) {
  return useQuery({
    queryKey: ['hosue', id],
    queryFn: () => fetchHouseById(id),
    enabled: !!id, // only fetch if id is defined
    staleTime: 1000 * 60 * 10,
  })
}
