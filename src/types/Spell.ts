import type { HouseHead } from './HouseHead.ts'
import type { Trait } from './Trait.ts'

export enum SpellLight {
  None = 'None',
  Blue = 'Blue',
  IcyBlue = 'Icy Blue',
  Red = 'Red',
  Gold = 'Gold',
  Purple = 'Purple',
  Transparent = 'Transparent',
  White = 'White',
  Green = 'Green',
  Orange = 'Orange',
  Yellow = 'Yellow',
  BrightBlue = 'Bright Blue',
  Pink = 'Pink',
  Violet = 'Violet',
  BlueishWhite = 'Blueish White',
  Silver = 'Silver',
  Scarlet = 'Scarlet',
  Fire = 'Fire',
  FieryScarlet = 'Fiery Scarlet',
  Grey = 'Grey',
  DarkRed = 'Dark Red',
  Turquoise = 'Turquoise',
  PsychedelicTransparentWave = 'Psychedelic Transparent Wave',
  BrightYellow = 'Bright Yellow',
  BlackSmoke = 'Black Smoke',
}

export enum SpellType {
  None = 'None',
  Charm = 'Charm',
  Conjuration = 'Conjuration',
  Spell = 'Spell',
  Transfiguration = 'Transfiguration',
  HealingSpell = 'Healing Spell',
  DarkCharm = 'Dark Charm',
  Jinx = 'Jinx',
  Curse = 'Curse',
  MagicalTransportation = 'Magical Transportation',
  Hex = 'Hex',
  CounterSpell = 'Counter Spell',
  DarkArts = 'Dark Arts',
  CounterJinx = 'Counter Jinx',
  CounterCharm = 'Counter Charm',
  Untransfiguration = 'Un-transfiguration',
  BindingMagicalContract = 'Binding Magical Contract',
  Vanishment = 'Vanishment',
}

export interface Spell {
  id: string
  name: string
  incantation: string
  effect: string
  canBeVerbal: boolean
  type: SpellType
  light: SpellLight
  creator?: string | null
}
