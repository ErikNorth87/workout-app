import type { BodyRegion, CatalogLift, LiftPattern, MuscleGroup } from '../types'

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  triceps: 'Triceps',
  back: 'Back',
  lats: 'Lats',
  biceps: 'Biceps',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  core: 'Core',
  traps: 'Traps',
}

export const MUSCLE_ORDER: MuscleGroup[] = [
  'chest',
  'shoulders',
  'triceps',
  'back',
  'lats',
  'biceps',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'core',
  'traps',
]

type Role = {
  pattern: LiftPattern
  region: BodyRegion
  isMain: boolean
  attachTo?: LiftPattern
}

const ROLE_BY_MUSCLE: Array<{ muscle: MuscleGroup } & Role> = [
  { muscle: 'chest', pattern: 'horizontalPush', region: 'upper', isMain: true },
  { muscle: 'shoulders', pattern: 'verticalPush', region: 'upper', isMain: true },
  { muscle: 'quads', pattern: 'squat', region: 'lower', isMain: true },
  { muscle: 'hamstrings', pattern: 'hinge', region: 'lower', isMain: true },
  { muscle: 'glutes', pattern: 'hinge', region: 'lower', isMain: true },
  { muscle: 'lats', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { muscle: 'back', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { muscle: 'triceps', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { muscle: 'biceps', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull' },
  { muscle: 'traps', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { muscle: 'calves', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat' },
  { muscle: 'core', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'squat' },
]

export function roleFromMuscles(muscles: MuscleGroup[]): Role {
  for (const row of ROLE_BY_MUSCLE) {
    if (muscles.includes(row.muscle)) {
      const { pattern, region, isMain, attachTo } = row
      return { pattern, region, isMain, attachTo }
    }
  }
  return { pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPush' }
}

export function uniqueMuscles(lifts: Array<{ muscles: MuscleGroup[] }>): MuscleGroup[] {
  const seen = new Set<MuscleGroup>()
  const out: MuscleGroup[] = []
  for (const lift of lifts) {
    for (const muscle of lift.muscles) {
      if (seen.has(muscle)) continue
      seen.add(muscle)
      out.push(muscle)
    }
  }
  return out
}

export function catalogFromCustom(input: { name: string; muscles: MuscleGroup[] }): CatalogLift {
  const muscles = MUSCLE_ORDER.filter((muscle) => input.muscles.includes(muscle))
  const role = roleFromMuscles(muscles)
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    muscles,
    custom: true,
    ...role,
  }
}
