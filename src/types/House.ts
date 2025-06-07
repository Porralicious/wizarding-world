import type { HouseHead } from './HouseHead.ts'
import type { Trait } from './Trait.ts'

export interface House {
  id: string
  name: string
  houseColours: string
  founder: string
  animal: string
  element: string
  ghost: string
  commonRoom: string
  heads: Array<HouseHead>
  traits: Array<Trait>
}
