import { describe, expect, it } from 'vitest'
import { roleFromMuscles } from './muscles'

describe('roleFromMuscles', () => {
  it('maps chest to a horizontal push main lift', () => {
    expect(roleFromMuscles(['chest', 'triceps'])).toMatchObject({
      pattern: 'horizontalPush',
      region: 'upper',
      isMain: true,
    })
  })

  it('maps shoulders (no chest) to a vertical push main lift', () => {
    expect(roleFromMuscles(['shoulders', 'triceps'])).toMatchObject({
      pattern: 'verticalPush',
      isMain: true,
    })
  })

  it('maps hamstrings to a hinge so they stay off squat day', () => {
    expect(roleFromMuscles(['hamstrings', 'glutes'])).toMatchObject({
      pattern: 'hinge',
      region: 'lower',
      isMain: true,
    })
  })

  it('maps biceps to an accessory on pull day', () => {
    expect(roleFromMuscles(['biceps'])).toMatchObject({
      pattern: 'isolation',
      isMain: false,
      attachTo: 'horizontalPull',
    })
  })
})
