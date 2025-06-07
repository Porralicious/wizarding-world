import type { Ingredient } from './Ingredient'

export enum ElixirDifficulty {
  Unknown = 'Unknown',
  Advanced = 'Advanced',
  Moderate = 'Moderate',
  Beginner = 'Beginner',
  OrdinaryWizardingLevel = 'O.W.L',
  OneOfAKind = 'One Of A Kind',
}

export enum ElixirInventor {
  Unknown = 'Unknown',
  Advanced = 'Advanced',
  Moderate = 'Moderate',
  Beginner = 'Beginner',
  OrdinaryWizardingLevel = 'O.W.L',
  OneOfAKind = 'One Of A Kind',
}
export interface Elixir {
  id: string
  name: string
  effect: string
  sideEffects: string
  characteristics: string
  time: string
  difficulty: ElixirDifficulty
  ingredients: Array<Ingredient>
  inventors: Array<ElixirInventor>
  manufacturer: string
}
