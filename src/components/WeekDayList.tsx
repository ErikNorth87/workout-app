import { MuscleChips } from './MuscleChips'
import { dateForWeekday, parseIsoDate, WEEKDAY_SHORT } from '../engine/dates'
import type { DayPlan } from '../engine/scheduler'

export function WeekDayList({
  plan,
  mondayIso,
  selectedIso,
  doneByDate,
  onSelect,
}: {
  plan: DayPlan[]
  mondayIso: string
  selectedIso: string
  doneByDate: Record<string, boolean>
  onSelect: (iso: string) => void
}) {
  const cards = plan.flatMap((day) => {
    const date = dateForWeekday(mondayIso, day.weekday)
    return day.lifts.map((lift) => ({ day, date, lift }))
  })

  return (
    <>
      {cards.map(({ day, date, lift }) => {
        const selected = date === selectedIso
        return (
          <button
            key={lift.program.id}
            type="button"
            className={selected ? 'card day-card selected' : 'card day-card'}
            aria-pressed={selected}
            onClick={() => onSelect(date)}
          >
            <div className="day-date">
              <span>{WEEKDAY_SHORT[day.weekday]}</span>
              <strong>{parseIsoDate(date).getDate()}</strong>
            </div>
            <div className="day-body">
              <p className="lift-name">{lift.catalog.name}</p>
              <MuscleChips muscles={lift.catalog.muscles} />
            </div>
            {doneByDate[date] ? <span className="status ok">Done</span> : <span className="status badge">Train</span>}
          </button>
        )
      })}
    </>
  )
}
