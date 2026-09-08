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
  { id: 'back-squat', name: 'Back Squat', pattern: 'squat', region: 'lower', isMain: true, muscles: ['quads', 'glutes'] },
  { id: 'front-squat', name: 'Front Squat', pattern: 'squat', region: 'lower', isMain: true, muscles: ['quads', 'glutes'] },
  { id: 'goblet-squat', name: 'Goblet Squat', pattern: 'squat', region: 'lower', isMain: true, muscles: ['quads'] },
  { id: 'leg-press', name: 'Leg Press', pattern: 'squat', region: 'lower', isMain: true, muscles: ['quads'] },
  { id: 'deadlift', name: 'Conventional Deadlift', pattern: 'hinge', region: 'lower', isMain: true, muscles: ['hamstrings', 'glutes', 'back'] },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', pattern: 'hinge', region: 'lower', isMain: true, muscles: ['glutes', 'quads', 'hamstrings'] },
  { id: 'rdl', name: 'Romanian Deadlift', pattern: 'hinge', region: 'lower', isMain: true, muscles: ['hamstrings', 'glutes'] },
  { id: 'trap-bar-deadlift', name: 'Trap Bar Deadlift', pattern: 'hinge', region: 'lower', isMain: true, muscles: ['quads', 'glutes'] },
  { id: 'hip-thrust', name: 'Hip Thrust', pattern: 'hinge', region: 'lower', isMain: true, muscles: ['glutes'] },
  { id: 'bench-press', name: 'Bench Press', pattern: 'horizontalPush', region: 'upper', isMain: true, muscles: ['chest', 'triceps', 'shoulders'] },
  { id: 'incline-bench', name: 'Incline Bench Press', pattern: 'horizontalPush', region: 'upper', isMain: true, muscles: ['chest', 'shoulders'] },
  { id: 'db-bench', name: 'Dumbbell Bench Press', pattern: 'horizontalPush', region: 'upper', isMain: true, muscles: ['chest', 'triceps'] },
  { id: 'close-grip-bench', name: 'Close-Grip Bench', pattern: 'horizontalPush', region: 'upper', isMain: true, muscles: ['triceps', 'chest'] },
  { id: 'dips', name: 'Dips', pattern: 'horizontalPush', region: 'upper', isMain: true, muscles: ['chest', 'triceps'] },
  { id: 'ohp', name: 'Overhead Press', pattern: 'verticalPush', region: 'upper', isMain: true, muscles: ['shoulders', 'triceps'] },
  { id: 'push-press', name: 'Push Press', pattern: 'verticalPush', region: 'upper', isMain: true, muscles: ['shoulders', 'triceps'] },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', pattern: 'verticalPush', region: 'upper', isMain: true, muscles: ['shoulders', 'triceps'] },
  { id: 'barbell-row', name: 'Barbell Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush', muscles: ['back', 'biceps'] },
  { id: 'db-row', name: 'Dumbbell Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush', muscles: ['back', 'biceps'] },
  { id: 'cable-row', name: 'Seated Cable Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush', muscles: ['back', 'biceps'] },
  { id: 'chest-supported-row', name: 'Chest-Supported Row', pattern: 'horizontalPull', region: 'upper', isMain: false, attachTo: 'horizontalPush', muscles: ['back'] },
  { id: 'pull-up', name: 'Pull-Up', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush', muscles: ['lats', 'biceps'] },
  { id: 'chin-up', name: 'Chin-Up', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush', muscles: ['lats', 'biceps'] },
  { id: 'lat-pulldown', name: 'Lat Pulldown', pattern: 'verticalPull', region: 'upper', isMain: false, attachTo: 'verticalPush', muscles: ['lats', 'biceps'] },
  { id: 'barbell-curl', name: 'Barbell Curl', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull', muscles: ['biceps'] },
  { id: 'db-curl', name: 'Dumbbell Curl', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull', muscles: ['biceps'] },
  { id: 'hammer-curl', name: 'Hammer Curl', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPull', muscles: ['biceps'] },
  { id: 'tricep-pushdown', name: 'Triceps Pushdown', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPush', muscles: ['triceps'] },
  { id: 'skull-crusher', name: 'Skull Crusher', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'horizontalPush', muscles: ['triceps'] },
  { id: 'lateral-raise', name: 'Lateral Raise', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'verticalPush', muscles: ['shoulders'] },
  { id: 'face-pull', name: 'Face Pull', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'verticalPush', muscles: ['shoulders', 'back'] },
  { id: 'leg-curl', name: 'Leg Curl', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'hinge', muscles: ['hamstrings'] },
  { id: 'leg-extension', name: 'Leg Extension', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat', muscles: ['quads'] },
  { id: 'lunge', name: 'Walking Lunge', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat', muscles: ['quads', 'glutes'] },
  { id: 'calf-raise', name: 'Calf Raise', pattern: 'isolation', region: 'lower', isMain: false, attachTo: 'squat', muscles: ['calves'] },
  { id: 'plank', name: 'Plank', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'squat', muscles: ['core'] },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'hinge', muscles: ['core'] },
  { id: 'ab-wheel', name: 'Ab Wheel', pattern: 'isolation', region: 'upper', isMain: false, attachTo: 'hinge', muscles: ['core'] },
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
