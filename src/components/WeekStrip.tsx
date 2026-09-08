import {
  daysOfWeek,
  formatWeekRange,
  parseIsoDate,
  WEEKDAY_SHORT,
} from '../engine/dates'

export function WeekStrip({
  mondayIso,
  selectedIso,
  todayIso,
  trainingWeekdays,
  doneByDate,
  onSelect,
  onShiftWeek,
}: {
  mondayIso: string
  selectedIso: string
  todayIso: string
  trainingWeekdays: number[]
  doneByDate: Record<string, boolean>
  onSelect: (iso: string) => void
  onShiftWeek: (delta: number) => void
}) {
  return (
    <div className="week-nav">
      <div className="week-nav-head">
        <button type="button" className="week-shift" aria-label="Previous week" onClick={() => onShiftWeek(-1)}>
          ‹
        </button>
        <p>{formatWeekRange(mondayIso)}</p>
        <button type="button" className="week-shift" aria-label="Next week" onClick={() => onShiftWeek(1)}>
          ›
        </button>
      </div>
      <div className="week-strip">
        {daysOfWeek(mondayIso).map((day) => {
          const selected = day.iso === selectedIso
          const training = trainingWeekdays.includes(day.weekday)
          const classes = [
            'week-day',
            selected ? 'selected' : '',
            day.iso === todayIso ? 'today' : '',
            training ? 'has-work' : '',
            doneByDate[day.iso] ? 'done' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={day.iso}
              type="button"
              className={classes}
              aria-pressed={selected}
              aria-label={`${WEEKDAY_SHORT[day.weekday]} ${parseIsoDate(day.iso).getDate()}`}
              onClick={() => onSelect(day.iso)}
            >
              <span>{WEEKDAY_SHORT[day.weekday]}</span>
              <strong>{parseIsoDate(day.iso).getDate()}</strong>
            </button>
          )
        })}
      </div>
    </div>
  )
}
