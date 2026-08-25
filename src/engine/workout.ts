import type { CycleWeek, JoinedLift, WeightUnit } from '../types'
import { cycleSets, testingSets, type PrescribedSet } from './cycle'
import { barWeightLb, effectiveTrainingMax, roundDisplayWeight } from './trainingMax'

export type WorkoutKind = 'testing' | 'programmed'

export type WorkoutSet = PrescribedSet & {
  weightLb: number | null
  displayWeight: number | null
}

export function needsTestingSession(lift: JoinedLift, hasCompletedTest: boolean): boolean {
  return lift.program.needsTesting && !hasCompletedTest
}

export function workoutForLift(
  lift: JoinedLift,
  cycleWeek: CycleWeek,
  cycleNumber: number,
  unit: WeightUnit,
  hasCompletedTest: boolean,
): { kind: WorkoutKind; sets: WorkoutSet[] } {
  if (needsTestingSession(lift, hasCompletedTest)) {
    const bar = barWeightLb(unit)
    return {
      kind: 'testing',
      sets: testingSets().map((set, index) => {
        const weightLb = index < 2 ? bar : null
        return {
          ...set,
          weightLb,
          displayWeight: weightLb != null ? roundDisplayWeight(weightLb, unit) : null,
        }
      }),
    }
  }

  const baseTm = lift.program.trainingMaxLb
  if (baseTm == null) {
    return {
      kind: 'testing',
      sets: testingSets().map((set) => ({ ...set, weightLb: null, displayWeight: null })),
    }
  }

  const tm = effectiveTrainingMax(baseTm, lift.catalog.region, lift.program.addedInCycle, cycleNumber)
  return {
    kind: 'programmed',
    sets: cycleSets(cycleWeek).map((set) => {
      const weightLb = set.percentTm != null ? tm * set.percentTm : null
      return {
        ...set,
        weightLb,
        displayWeight: weightLb != null ? roundDisplayWeight(weightLb, unit) : null,
      }
    }),
  }
}
