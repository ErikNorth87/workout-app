export type LiftPattern =
  | 'horizontalPush'
  | 'verticalPush'
  | 'squat'
  | 'hinge'
  | 'horizontalPull'
  | 'verticalPull'
  | 'isolation'

export type BodyRegion = 'upper' | 'lower'

export type CycleWeek = 1 | 2 | 3 | 4

export type WeightUnit = 'lb' | 'kg'

export type CatalogLift = {
  id: string
  name: string
  pattern: LiftPattern
  region: BodyRegion
  isMain: boolean
  attachTo?: LiftPattern
}

export type ProgramLift = {
  id: string
  catalogId: string
  oneRepMaxLb: number | null
  trainingMaxLb: number | null
  needsTesting: boolean
  addedInCycle: number
  addedAt: number
}

export type Settings = {
  id: 1
  unit: WeightUnit
  weekdays: number[]
  programStartIso: string
}

export type LoggedSet = {
  role: string
  percentTm: number | null
  prescribedReps: number
  isAmrap: boolean
  weightLb: number | null
  actualReps: number | null
}

export type SessionLog = {
  id: string
  date: string
  programLiftId: string
  kind: 'testing' | 'programmed'
  cycleWeek: CycleWeek | null
  cycleNumber: number
  sets: LoggedSet[]
  completedAt: number | null
}

export type JoinedLift = {
  program: ProgramLift
  catalog: CatalogLift
}
