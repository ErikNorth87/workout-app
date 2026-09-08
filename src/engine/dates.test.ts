import { describe, expect, it } from 'vitest'
import { daysOfWeek, mondayForCycleWeek, nextTrainingIso, shiftMonday } from './dates'

describe('week navigation', () => {
  it('lists Mon–Sun dates for a week', () => {
    expect(daysOfWeek('2026-08-24').map((day) => day.iso)).toEqual([
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
      '2026-08-28',
      '2026-08-29',
      '2026-08-30',
    ])
  })

  it('shifts by whole weeks', () => {
    expect(shiftMonday('2026-08-24', 1)).toBe('2026-08-31')
  })

  it('jumps to a cycle week from program start', () => {
    expect(mondayForCycleWeek('2026-08-24', 1, 3)).toBe('2026-09-07')
  })

  it('picks today when it is a training day, otherwise the next one', () => {
    expect(nextTrainingIso('2026-08-24', '2026-08-25', [1, 2, 4, 5])).toBe('2026-08-25')
    expect(nextTrainingIso('2026-08-24', '2026-08-26', [1, 2, 4, 5])).toBe('2026-08-27')
  })
})
