import { weekLabel } from '../engine/cycle'
import type { CycleProgress } from '../engine/dates'
import type { CycleWeek } from '../types'

const WEEKS: CycleWeek[] = [1, 2, 3, 4]

export function CycleStrip({
  progress,
  onSelectWeek,
}: {
  progress: CycleProgress
  onSelectWeek?: (week: CycleWeek) => void
}) {
  return (
    <div className="cycle-strip" aria-label={`Cycle ${progress.cycleNumber}`}>
      {WEEKS.map((week) => (
        <button
          key={week}
          type="button"
          className={week === progress.cycleWeek ? 'cycle-cell current' : 'cycle-cell'}
          aria-pressed={week === progress.cycleWeek}
          disabled={!onSelectWeek}
          onClick={() => onSelectWeek?.(week)}
        >
          <span>W{week}</span>
          <strong>{weekLabel(week)}</strong>
        </button>
      ))}
    </div>
  )
}
