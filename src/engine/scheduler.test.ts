import { describe, expect, it } from 'vitest'
import { catalogById } from '../data/lifts'
import type { CatalogLift, JoinedLift, ProgramLift } from '../types'
import { buildSchedule, consecutiveConflicts, pickSpreadWeekdays } from './scheduler'

function join(catalogId: string, addedAt = 1): JoinedLift {
  const catalog = catalogById(catalogId) as CatalogLift
  const program: ProgramLift = {
    id: catalogId,
    catalogId,
    oneRepMaxLb: 200,
    trainingMaxLb: 180,
    needsTesting: false,
    addedInCycle: 1,
    addedAt,
  }
  return { program, catalog }
}

describe('scheduler', () => {
  it('spreads two days across the week', () => {
    expect(pickSpreadWeekdays([1, 2, 4, 5], 2)).toEqual([1, 5])
  })

  it('never puts bench and overhead press on consecutive days', () => {
    const plan = buildSchedule([join('bench-press'), join('ohp')], [1, 2, 4, 5])
    expect(consecutiveConflicts(plan)).toEqual([])
    const days = Object.fromEntries(
      plan.flatMap((day) => day.lifts.map((lift) => [lift.catalog.id, day.weekday])),
    )
    const gap = Math.abs((days['bench-press'] ?? 0) - (days['ohp'] ?? 0))
    expect(gap === 1 || gap === 6).toBe(false)
  })

  it('never puts squat and deadlift on consecutive days', () => {
    const plan = buildSchedule([join('back-squat'), join('deadlift')], [1, 2, 4, 5])
    expect(consecutiveConflicts(plan)).toEqual([])
  })

  it('uses the 4-day recovery skeleton for the big four', () => {
    const plan = buildSchedule(
      [join('ohp'), join('deadlift'), join('bench-press'), join('back-squat')],
      [1, 2, 4, 5],
    )
    const byPattern = Object.fromEntries(
      plan.flatMap((day) =>
        day.lifts.filter((l) => l.isDayMain).map((lift) => [lift.catalog.pattern, day.weekday]),
      ),
    )
    expect(byPattern).toEqual({
      verticalPush: 1,
      hinge: 2,
      horizontalPush: 4,
      squat: 5,
    })
    expect(consecutiveConflicts(plan)).toEqual([])
  })

  it('attaches rows to bench day', () => {
    const plan = buildSchedule(
      [join('bench-press'), join('ohp'), join('barbell-row')],
      [1, 2, 4, 5],
    )
    const benchDay = plan.find((day) => day.lifts.some((l) => l.catalog.id === 'bench-press'))
    expect(benchDay?.lifts.some((l) => l.catalog.id === 'barbell-row')).toBe(true)
  })
})
