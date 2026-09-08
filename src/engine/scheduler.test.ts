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

  it('uses a free training day for an accessory before stacking', () => {
    const plan = buildSchedule(
      [join('bench-press'), join('ohp'), join('barbell-row')],
      [1, 2, 4, 5],
    )
    expect(plan.flatMap((day) => day.lifts.map((lift) => lift.catalog.id)).sort()).toEqual(
      ['barbell-row', 'bench-press', 'ohp'].sort(),
    )
    expect(plan).toHaveLength(3)
    const rowDay = plan.find((day) => day.lifts.some((lift) => lift.catalog.id === 'barbell-row'))
    const benchDay = plan.find((day) => day.lifts.some((lift) => lift.catalog.id === 'bench-press'))
    expect(rowDay?.weekday).not.toBe(benchDay?.weekday)
  })

  it('stacks an accessory on the matching main when no weekday is left', () => {
    const plan = buildSchedule(
      [join('ohp'), join('deadlift'), join('bench-press'), join('back-squat'), join('barbell-row')],
      [1, 2, 4, 5],
    )
    expect(plan).toHaveLength(4)
    const benchDay = plan.find((day) => day.lifts.some((lift) => lift.catalog.id === 'bench-press'))
    expect(benchDay?.lifts.some((lift) => lift.catalog.id === 'barbell-row')).toBe(true)
  })

  it('keeps every selected lift on the week even when days are shared', () => {
    const ids = ['back-squat', 'bench-press', 'ohp', 'barbell-row', 'barbell-curl']
    const plan = buildSchedule(
      ids.map((id) => join(id)),
      [1, 2, 4, 5],
    )
    expect(plan.flatMap((day) => day.lifts.map((lift) => lift.catalog.id)).sort()).toEqual([...ids].sort())
    expect(plan.length).toBeGreaterThanOrEqual(4)
  })
})
