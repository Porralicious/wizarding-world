import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { Spell } from '@/types/Spell'

const fetchSpells = async (): Promise<Spell[]> => {
  const { data } = await axios.get('https://wizard-world-api.herokuapp.com/Spells')
  return data
}

export function useSpells() {
  return useQuery({
    queryKey: ['spells'],
    queryFn: fetchSpells,
    staleTime: 1000 * 60 * 5,
  })
}
