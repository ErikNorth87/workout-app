import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { weekLabel } from '../engine/cycle'
import {
  cycleProgress,
  dateForWeekday,
  mondayOnOrBefore,
  toIsoDate,
  WEEKDAY_SHORT,
} from '../engine/dates'
import { buildSchedule } from '../engine/scheduler'
import { getJoinedLifts, getLogsForDate, getSettings } from '../db/store'
import type { DayPlan } from '../engine/scheduler'
import type { Settings } from '../types'

export function WeekPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [plan, setPlan] = useState<DayPlan[]>([])
  const [done, setDone] = useState<Record<string, boolean>>({})

  useEffect(() => {
    void (async () => {
      const nextSettings = await getSettings()
      const lifts = await getJoinedLifts()
      const schedule = buildSchedule(lifts, nextSettings.weekdays)
      const monday = toIsoDate(mondayOnOrBefore(new Date()))
      const flags: Record<string, boolean> = {}
      for (const day of schedule) {
        const date = dateForWeekday(monday, day.weekday)
        const logs = await getLogsForDate(date)
        flags[date] = logs.some((log) => log.completedAt != null)
      }
      setSettings(nextSettings)
      setPlan(schedule)
      setDone(flags)
    })()
  }, [])

  if (!settings) return <div className="page muted">Loading…</div>

  const progress = cycleProgress(settings.programStartIso, new Date())
  const monday = toIsoDate(mondayOnOrBefore(new Date()))

  return (
    <>
      <header className="topbar">
        <h1>This week</h1>
        <p className="muted">
          Cycle {progress.cycleNumber} · Week {progress.cycleWeek} · {weekLabel(progress.cycleWeek)}
        </p>
      </header>
      <main className="page">
        {plan.length === 0 ? (
          <section className="card">
            <p>Add lifts from the library to build your week.</p>
            <Link className="btn" to="/library">
              Open library
            </Link>
          </section>
        ) : (
          plan.map((day) => {
            const date = dateForWeekday(monday, day.weekday)
            return (
              <Link key={day.weekday} className="card" to={`/session/${date}`}>
                <div className="row">
                  <h2>
                    {WEEKDAY_SHORT[day.weekday]} · {date.slice(5)}
                  </h2>
                  {done[date] ? <span className="ok">Done</span> : <span className="badge">Train</span>}
                </div>
                <p className="muted">
                  {day.lifts.map((lift) => lift.catalog.name).join(', ')}
                </p>
              </Link>
            )
          })
        )}
      </main>
    </>
  )
}
