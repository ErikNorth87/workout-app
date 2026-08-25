import type { CatalogLift, LiftPattern } from '../types'

export const PATTERN_LABELS: Record<LiftPattern, string> = {
  horizontalPush: 'Horizontal Push',
  verticalPush: 'Vertical Push',
  squat: 'Squat',
  hinge: 'Hinge',
  horizontalPull: 'Horizontal Pull',
  verticalPull: 'Vertical Pull',
  isolation: 'Accessory',
}

export const LIFTS: CatalogLift[] = [
  { id: 'back-squat', name: 'Back Squat', pattern: 'squat', region: 'lower', isMain: true },
  { id: 'front-squat', name: 'Front Squat', pattern: 'squat', region: 'lower', isMain: true },
  { id: 'goblet-squat', name: 'Goblet Squat', pattern: 'squat', region: 'lower', isMain: true },
  { id: 'leg-press', name: 'Leg Press', pattern: 'squat', region: 'lower', isMain: true },
  { id: 'deadlift', name: 'Conventional Deadlift', pattern: 'hinge', region: 'lower', isMain: true },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', pattern: 'hinge', region: 'lower', isMain: true },
  { id: 'rdl', name: 'Romanian Deadlift', pattern: 'hinge', region: 'lower', isMain: true },
  { id: 'trap-bar-deadlift', name: 'Trap Bar Deadlift', pattern: 'hinge', region: 'lower', isMain: true },
  { id: 'hip-thrust', name: 'Hip Thrust', pattern: 'hinge', region: 'lower', isMain: true },
  { id: 'bench-press', name: 'Bench Press', pattern: 'horizontalPush', region: 'upper', isMain: true },
  { id: 'incline-bench', name: 'Incline Bench Press', pattern: 'horizontalPush', region: 'upper', isMain: true },
  { id: 'db-bench', name: 'Dumbbell Bench Press', pattern: 'horizontalPush', region: 'upper', isMain: true },
  { id: 'close-grip-bench', name: 'Close-Grip Bench', pattern: 'horizontalPush', region: 'upper', isMain: true },
  { id: 'dips', name: 'Dips', pattern: 'horizontalPush', region: 'upper', isMain: true },
  { id: 'ohp', name: 'Overhead Press', pattern: 'verticalPush', region: 'upper', isMain: true },
  { id: 'push-press', name: 'Push Press', pattern: 'verticalPush', region: 'upper', isMain: true },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', pattern: 'verticalPush', region: 'upper', isMain: true },
  { id: 'barbell-row', name: 'Barbell Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { id: 'db-row', name: 'Dumbbell Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { id: 'cable-row', name: 'Seated Cable Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { id: 'chest-supported-row', name: 'Chest-Supported Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { id: 'pull-up', name: 'Pull-Up', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { id: 'chin-up', name: 'Chin-Up', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { id: 'barbell-curl', name: 'Barbell Curl', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull' },
  { id: 'db-curl', name: 'Dumbbell Curl', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull' },
  { id: 'hammer-curl', name: 'Hammer Curl', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull' },
  { id: 'tricep-pushdown', name: 'Triceps Pushdown', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { id: 'skull-crusher', name: 'Skull Crusher', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPush' },
  { id: 'lateral-raise', name: 'Lateral Raise', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { id: 'face-pull', name: 'Face Pull', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'verticalPush' },
  { id: 'leg-curl', name: 'Leg Curl', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'hinge' },
  { id: 'leg-extension', name: 'Leg Extension', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat' },
  { id: 'lunge', name: 'Walking Lunge', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat' },
  { id: 'calf-raise', name: 'Calf Raise', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat' },
  { id: 'plank', name: 'Plank', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'squat' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'hinge' },
  { id: 'ab-wheel', name: 'Ab Wheel', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'hinge' },
]

export const PATTERN_ORDER: LiftPattern[] = [
  'squat',
  'hinge',
  'horizontalPush',
  'verticalPush',
  'horizontalPull',
  'verticalPull',
  'isolation',
]

export function catalogById(id: string): CatalogLift | undefined {
  return LIFTS.find((lift) => lift.id === id)
}

export function liftsByPattern(): Array<{ pattern: LiftPattern; label: string; lifts: CatalogLift[] }> {
  return PATTERN_ORDER.map((pattern) => ({
    pattern,
    label: PATTERN_LABELS[pattern],
    lifts: LIFTS.filter((lift) => lift.pattern === pattern),
  }))
}
