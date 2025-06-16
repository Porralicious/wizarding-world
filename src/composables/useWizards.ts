import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import type { Wizard } from '@/types/Wizard'

const API_BASE = 'https://wizard-world-api.herokuapp.com'

const fetchWizards = async (): Promise<Wizard[]> => {
  const { data } = await axios.get(`${API_BASE}/Wizards`)
  return data
}

const fetchWizardById = async (id: string): Promise<Wizard> => {
  const { data } = await axios.get(`${API_BASE}/Wizards/${id}`)
  return data
}

export function useWizards() {
  return useQuery({
    queryKey: ['wizards'],
    queryFn: fetchWizards,
    staleTime: 1000 * 60 * 5,
  })
}

export function useWizard(id: string) {
  return useQuery({
    queryKey: ['wizard', id],
    queryFn: () => fetchWizardById(id),
    enabled: !!id, // only fetch if id is defined
    staleTime: 1000 * 60 * 10,
  })
}

export function useWizardFromCache(id: string): Wizard | undefined {
  const queryClient = useQueryClient()
  const wizards = queryClient.getQueryData<Wizard[]>(['wizards'])
  return wizards?.find(w => w.id === id)
}