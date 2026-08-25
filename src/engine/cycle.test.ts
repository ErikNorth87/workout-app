import { describe, expect, it } from 'vitest'
import { cycleSets, testingSets, weekLabel } from './cycle'

describe('cycle', () => {
  it('week 1 is 65/75/85 x5 with AMRAP then 5x10 @ 50%', () => {
    const sets = cycleSets(1)
    const main = sets.filter((s) => s.role === 'main')
    const bbb = sets.filter((s) => s.role === 'bbb')
    expect(main.map((s) => [s.percentTm, s.reps, s.isAmrap])).toEqual([
      [0.65, 5, false],
      [0.75, 5, false],
      [0.85, 5, true],
    ])
    expect(bbb).toHaveLength(5)
    expect(bbb.every((s) => s.percentTm === 0.5 && s.reps === 10)).toBe(true)
    expect(weekLabel(1)).toBe('5s week')
  })

  it('week 2 is 70/80/90 x3 with AMRAP', () => {
    const main = cycleSets(2).filter((s) => s.role === 'main')
    expect(main.map((s) => [s.percentTm, s.reps, s.isAmrap])).toEqual([
      [0.7, 3, false],
      [0.8, 3, false],
      [0.9, 3, true],
    ])
  })

  it('week 3 is 75/85/95 with 5/3/1+', () => {
    const main = cycleSets(3).filter((s) => s.role === 'main')
    expect(main.map((s) => [s.percentTm, s.reps, s.isAmrap])).toEqual([
      [0.75, 5, false],
      [0.85, 3, false],
      [0.95, 1, true],
    ])
  })

  it('deload drops intensity and BBB volume, no AMRAP', () => {
    const sets = cycleSets(4)
    const main = sets.filter((s) => s.role === 'main')
    const bbb = sets.filter((s) => s.role === 'bbb')
    expect(main.map((s) => [s.percentTm, s.reps, s.isAmrap])).toEqual([
      [0.4, 5, false],
      [0.5, 5, false],
      [0.6, 5, false],
    ])
    expect(bbb).toHaveLength(3)
    expect(bbb.every((s) => s.percentTm === 0.4)).toBe(true)
    expect(weekLabel(4)).toBe('Deload')
  })

  it('testing workout ramps to a 5+ top set', () => {
    const sets = testingSets()
    expect(sets).toHaveLength(4)
    expect(sets.at(-1)).toMatchObject({ role: 'test-top', reps: 5, isAmrap: true })
  })
})
