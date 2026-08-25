import { describe, expect, it } from 'vitest'
import {
  epley1RM,
  effectiveTrainingMax,
  incrementLb,
  roundDisplayWeight,
  trainingMaxFrom1RM,
} from './trainingMax'

describe('trainingMax', () => {
  it('sets TM at 90% of 1RM', () => {
    expect(trainingMaxFrom1RM(200)).toBe(180)
  })

  it('estimates 1RM with Epley', () => {
    expect(epley1RM(225, 5)).toBe(225 * (1 + 5 / 30))
    expect(epley1RM(225, 1)).toBe(225)
  })

  it('bumps upper 5 lb and lower 10 lb per cycle', () => {
    expect(incrementLb('upper')).toBe(5)
    expect(incrementLb('lower')).toBe(10)
    expect(effectiveTrainingMax(180, 'upper', 1, 3)).toBe(190)
    expect(effectiveTrainingMax(315, 'lower', 2, 4)).toBe(335)
  })

  it('rounds working weights to 5 lb or 2.5 kg', () => {
    expect(roundDisplayWeight(167, 'lb')).toBe(165)
    expect(roundDisplayWeight(100, 'kg')).toBe(45)
  })
})
