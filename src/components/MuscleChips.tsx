import { MUSCLE_LABELS } from '../data/muscles'
import type { MuscleGroup } from '../types'

export function MuscleChips({
  muscles,
  selectable,
  selected,
  onToggle,
}: {
  muscles: MuscleGroup[]
  selectable?: boolean
  selected?: MuscleGroup[]
  onToggle?: (muscle: MuscleGroup) => void
}) {
  if (muscles.length === 0) return null
  return (
    <div className={selectable ? 'chips chips-wrap' : 'chips'}>
      {muscles.map((muscle) => {
        const on = selected?.includes(muscle) ?? false
        if (selectable && onToggle) {
          return (
            <button
              key={muscle}
              type="button"
              className="chip"
              aria-pressed={on}
              onClick={() => onToggle(muscle)}
            >
              {MUSCLE_LABELS[muscle]}
            </button>
          )
        }
        return (
          <span className="chip" key={muscle}>
            {MUSCLE_LABELS[muscle]}
          </span>
        )
      })}
    </div>
  )
}
