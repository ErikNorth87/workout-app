import type { BodyRegion, WeightUnit } from '../types'

export const LB_PER_KG = 2.2046226218

export function trainingMaxFrom1RM(oneRepMaxLb: number): number {
  return oneRepMaxLb * 0.9
}

export function epley1RM(weightLb: number, reps: number): number {
  if (reps <= 1) return weightLb
  return weightLb * (1 + reps / 30)
}

export function incrementLb(region: BodyRegion): number {
  return region === 'upper' ? 5 : 10
}

export function effectiveTrainingMax(
  baseTmLb: number,
  region: BodyRegion,
  addedInCycle: number,
  cycleNumber: number,
): number {
  const waves = Math.max(0, cycleNumber - addedInCycle)
  return baseTmLb + waves * incrementLb(region)
}

export function displayToLb(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value * LB_PER_KG : value
}

export function lbToDisplay(lb: number, unit: WeightUnit): number {
  return unit === 'kg' ? lb / LB_PER_KG : lb
}

export function roundToIncrement(value: number, increment: number): number {
  return Math.round(value / increment) * increment
}

export function roundDisplayWeight(lb: number, unit: WeightUnit): number {
  const increment = unit === 'kg' ? 2.5 : 5
  return roundToIncrement(lbToDisplay(lb, unit), increment)
}

export function barWeightLb(unit: WeightUnit): number {
  return unit === 'kg' ? displayToLb(20, 'kg') : 45
}

export function formatWeight(lb: number, unit: WeightUnit): string {
  const n = roundDisplayWeight(lb, unit)
  const text = unit === 'kg' ? String(n) : String(Math.round(n))
  return `${text} ${unit}`
}
