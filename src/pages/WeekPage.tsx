import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { CycleStrip } from '../components/CycleStrip'
import { DayPreview } from '../components/DayPreview'
import { WeekDayList } from '../components/WeekDayList'
import { WeekStrip } from '../components/WeekStrip'
import { getJoinedLifts, getLogsForDate, getSettings, hasCompletedTest } from '../db/store'
import { weekLabel } from '../engine/cycle'
import {
  cycleProgress,
  dateForWeekday,
  mondayForCycleWeek,
  mondayOnOrBefore,
  nextTrainingIso,
  parseIsoDate,
  shiftMonday,
  toIsoDate,
} from '../engine/dates'
import { buildSchedule, type DayPlan } from '../engine/scheduler'
import type { CycleWeek, Settings } from '../types'

function thisMonday() {
  return toIsoDate(mondayOnOrBefore(new Date()))
}

export function WeekPage() {
  const todayIso = toIsoDate(new Date())
  const [settings, setSettings] = useState<Settings | null>(null)
  const [plan, setPlan] = useState<DayPlan[]>([])
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [tested, setTested] = useState<Record<string, boolean>>({})
  const [monday, setMonday] = useState(thisMonday)
  const [selectedIso, setSelectedIso] = useState(todayIso)

  useEffect(() => {
    void (async () => {
      const nextSettings = await getSettings()
      const lifts = await getJoinedLifts()
      const schedule = buildSchedule(lifts, nextSettings.weekdays)
      const flags: Record<string, boolean> = {}
      for (const lift of lifts) flags[lift.program.id] = await hasCompletedTest(lift.program.id)
      setSettings(nextSettings)
      setPlan(schedule)
      setTested(flags)
      const training = schedule.map((day) => day.weekday)
      setSelectedIso((current) =>
        training.includes(parseIsoDate(current).getDay())
          ? current
          : nextTrainingIso(thisMonday(), todayIso, training),
      )
    })()
  }, [])

  useEffect(() => {
    if (plan.length === 0) {
      setDone({})
      return
    }
    void (async () => {
      const flags: Record<string, boolean> = {}
      for (const day of plan) {
        const date = dateForWeekday(monday, day.weekday)
        const logs = await getLogsForDate(date)
        flags[date] = logs.some((log) => log.completedAt != null)
      }
      setDone(flags)
    })()
  }, [monday, plan])

  const progress = useMemo(
    () => (settings ? cycleProgress(settings.programStartIso, parseIsoDate(selectedIso)) : null),
    [settings, selectedIso],
  )

  if (!settings || !progress) return <div className="page muted">Loading…</div>

  const currentSettings = settings
  const currentProgress = progress
  const trainingWeekdays = plan.map((day) => day.weekday)
  const selectedWeekday = parseIsoDate(selectedIso).getDay()
  const selectedDay = plan.find((day) => day.weekday === selectedWeekday)
  const title = monday === thisMonday() ? 'This week' : 'Upcoming'

  function goToWeek(nextMonday: string) {
    setMonday(nextMonday)
    setSelectedIso(dateForWeekday(nextMonday, parseIsoDate(selectedIso).getDay()))
  }

  function onSelectWeek(week: CycleWeek) {
    goToWeek(mondayForCycleWeek(currentSettings.programStartIso, currentProgress.cycleNumber, week))
  }

  return (
    <>
      <header className="topbar">
        <p className="kicker">5/3/1 + Boring But Big</p>
        <h1>{title}</h1>
        <p className="muted">
          Cycle {currentProgress.cycleNumber} · {weekLabel(currentProgress.cycleWeek)} · overlapping muscles stay off consecutive days
        </p>
        <CycleStrip progress={currentProgress} onSelectWeek={onSelectWeek} />
        <WeekStrip
          mondayIso={monday}
          selectedIso={selectedIso}
          todayIso={todayIso}
          trainingWeekdays={trainingWeekdays}
          doneByDate={done}
          onSelect={setSelectedIso}
          onShiftWeek={(delta) => goToWeek(shiftMonday(monday, delta))}
        />
      </header>
      <main className="page">
        {plan.length === 0 ? (
          <section className="empty-card">
            <p className="kicker">Empty rack</p>
            <h2>Build your week</h2>
            <p className="muted">Add a catalog lift or create your own. We’ll ask for a 1RM, or give you a testing day to find one.</p>
            <Link className="btn" to="/library">
              Open library
            </Link>
            <Link className="btn secondary" to="/create">
              Create a workout
            </Link>
          </section>
        ) : (
          <>
            <p className="muted">
              {plan.reduce((sum, day) => sum + day.lifts.length, 0)} lifts this week
              {plan.length === 1 ? '' : ` · ${plan.length} days`}
            </p>
            <WeekDayList
              plan={plan}
              mondayIso={monday}
              selectedIso={selectedIso}
              doneByDate={done}
              onSelect={setSelectedIso}
            />
            <DayPreview
              date={selectedIso}
              weekday={selectedWeekday}
              day={selectedDay}
              progress={currentProgress}
              settings={currentSettings}
              tested={tested}
              done={Boolean(done[selectedIso])}
            />
          </>
        )}
      </main>
    </>
  )
}
