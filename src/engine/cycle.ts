import type { CycleWeek } from '../types'

export type SetRole = 'main' | 'bbb' | 'test-warmup' | 'test-top'

export type PrescribedSet = {
  role: SetRole
  percentTm: number | null
  reps: number
  isAmrap: boolean
  restAfterSec: number
}

const MAIN_REST = 180
const AMRAP_REST = 240
const BBB_REST = 90

function main(
  percentTm: number,
  reps: number,
  isAmrap: boolean,
  restAfterSec: number,
): PrescribedSet {
  return { role: 'main', percentTm, reps, isAmrap, restAfterSec }
}

function bbb(percentTm: number, reps: number, count: number): PrescribedSet[] {
  return Array.from({ length: count }, (_, i) => ({
    role: 'bbb' as const,
    percentTm,
    reps,
    isAmrap: false,
    restAfterSec: i === count - 1 ? 0 : BBB_REST,
  }))
}

export function cycleSets(week: CycleWeek): PrescribedSet[] {
  if (week === 1) {
    return [
      main(0.65, 5, false, MAIN_REST),
      main(0.75, 5, false, MAIN_REST),
      main(0.85, 5, true, AMRAP_REST),
      ...bbb(0.5, 10, 5),
    ]
  }
  if (week === 2) {
    return [
      main(0.7, 3, false, MAIN_REST),
      main(0.8, 3, false, MAIN_REST),
      main(0.9, 3, true, AMRAP_REST),
      ...bbb(0.5, 10, 5),
    ]
  }
  if (week === 3) {
    return [
      main(0.75, 5, false, MAIN_REST),
      main(0.85, 3, false, MAIN_REST),
      main(0.95, 1, true, AMRAP_REST),
      ...bbb(0.5, 10, 5),
    ]
  }
  return [
    main(0.4, 5, false, MAIN_REST),
    main(0.5, 5, false, MAIN_REST),
    main(0.6, 5, false, AMRAP_REST),
    ...bbb(0.4, 10, 3),
  ]
}

export function testingSets(): PrescribedSet[] {
  return [
    { role: 'test-warmup', percentTm: null, reps: 10, isAmrap: false, restAfterSec: 60 },
    { role: 'test-warmup', percentTm: null, reps: 5, isAmrap: false, restAfterSec: 90 },
    { role: 'test-warmup', percentTm: null, reps: 5, isAmrap: false, restAfterSec: 120 },
    { role: 'test-top', percentTm: null, reps: 5, isAmrap: true, restAfterSec: 0 },
  ]
}

export function weekLabel(week: CycleWeek): string {
  if (week === 1) return '5s week'
  if (week === 2) return '3s week'
  if (week === 3) return '5/3/1 week'
  return 'Deload'
}
