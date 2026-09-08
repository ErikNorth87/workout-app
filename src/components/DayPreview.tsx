import { Link } from 'react-router'
import { MuscleChips } from './MuscleChips'
import { workoutForLift } from '../engine/workout'
import type { CycleProgress } from '../engine/dates'
import type { DayPlan } from '../engine/scheduler'
import { WEEKDAY_FULL } from '../engine/dates'
import type { Settings } from '../types'

function setLabel(displayWeight: number | null, reps: number, isAmrap: boolean, unit: Settings['unit']) {
  const repsText = isAmrap ? `${reps}+` : `${reps}`
  if (displayWeight == null) return `${repsText} reps`
  return `${displayWeight} ${unit} × ${repsText}`
}

export function DayPreview({
  date,
  weekday,
  day,
  progress,
  settings,
  tested,
  done,
}: {
  date: string
  weekday: number
  day: DayPlan | undefined
  progress: CycleProgress
  settings: Settings
  tested: Record<string, boolean>
  done: boolean
}) {
  if (!day) {
    return (
      <section className="empty-card">
        <p className="kicker">{WEEKDAY_FULL[weekday]}</p>
        <h2>Rest day</h2>
        <p className="muted">No lifts on this day. Overlapping muscle groups stay off consecutive days.</p>
      </section>
    )
  }

  return (
    <>
      {day.lifts.map((lift) => {
        const workout = workoutForLift(
          lift,
          progress.cycleWeek,
          progress.cycleNumber,
          settings.unit,
          tested[lift.program.id] ?? false,
        )
        const main = workout.sets.filter((set) => set.role !== 'bbb')
        const bbb = workout.sets.filter((set) => set.role === 'bbb')
        return (
          <section className="card" key={lift.program.id}>
            <div className="row">
              <div>
                <h2>{lift.catalog.name}</h2>
                <MuscleChips muscles={lift.catalog.muscles} />
              </div>
              <span className="badge">{workout.kind === 'testing' ? 'Testing' : '5/3/1'}</span>
            </div>
            <ul className="preview-sets">
              {main.map((set, index) => (
                <li key={`${set.role}-${index}`}>
                  {setLabel(set.displayWeight, set.reps, set.isAmrap, settings.unit)}
                  {set.percentTm != null ? ` · ${Math.round(set.percentTm * 100)}% TM` : ''}
                </li>
              ))}
              {bbb.length > 0 ? (
                <li>
                  BBB {bbb.length}×{bbb[0]?.reps} @ {bbb[0]?.displayWeight ?? '—'} {settings.unit}
                </li>
              ) : null}
            </ul>
          </section>
        )
      })}
      <Link className="btn" to={`/session/${date}`}>
        {done ? 'Review session' : 'Start session'}
      </Link>
    </>
  )
}
