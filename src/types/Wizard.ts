export interface WizardElixir {
  id: string
  name: string
}
export interface Wizard {
  id: string
  firstName: string
  lastName: string
  elixirs: Array<WizardElixir>
}
