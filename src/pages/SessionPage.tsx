import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { RestTimer } from '../components/RestTimer'
import { getJoinedLifts, getSettings, hasCompletedTest, updateProgramLift, upsertSessionLog } from '../db/store'
import { weekLabel } from '../engine/cycle'
import {
  cycleProgress,
  parseIsoDate,
  toIsoDate,
  WEEKDAY_FULL,
} from '../engine/dates'
import { buildSchedule } from '../engine/scheduler'
import { displayToLb, epley1RM, formatWeight, trainingMaxFrom1RM } from '../engine/trainingMax'
import { workoutForLift, type WorkoutSet } from '../engine/workout'
import type { JoinedLift, LoggedSet, Settings } from '../types'

type Draft = { weight: string; reps: string }

export function SessionPage() {
  const { date = toIsoDate(new Date()) } = useParams()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [lifts, setLifts] = useState<JoinedLift[]>([])
  const [tested, setTested] = useState<Record<string, boolean>>({})
  const [drafts, setDrafts] = useState<Record<string, Draft[]>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    void (async () => {
      const nextSettings = await getSettings()
      const joined = await getJoinedLifts()
      const flags: Record<string, boolean> = {}
      for (const lift of joined) flags[lift.program.id] = await hasCompletedTest(lift.program.id)
      setSettings(nextSettings)
      setLifts(joined)
      setTested(flags)
    })()
  }, [])

  const weekday = parseIsoDate(date).getDay()
  const progress = useMemo(
    () => (settings ? cycleProgress(settings.programStartIso, parseIsoDate(date)) : null),
    [settings, date],
  )
  const day = useMemo(() => {
    if (!settings) return undefined
    return buildSchedule(lifts, settings.weekdays).find((item) => item.weekday === weekday)
  }, [lifts, settings, weekday])

  useEffect(() => {
    if (!settings || !day || !progress) return
    const next: Record<string, Draft[]> = {}
    for (const lift of day.lifts) {
      const workout = workoutForLift(
        lift,
        progress.cycleWeek,
        progress.cycleNumber,
        settings.unit,
        tested[lift.program.id] ?? false,
      )
      next[lift.program.id] = workout.sets.map((set) => ({
        weight: set.displayWeight != null ? String(set.displayWeight) : '',
        reps: set.isAmrap ? '' : String(set.reps),
      }))
    }
    setDrafts(next)
  }, [day, progress, settings, tested])

  if (!settings || !progress) return <div className="page muted">Loading…</div>

  if (!day) {
    return (
      <main className="page">
        <p>No lifts scheduled for {WEEKDAY_FULL[weekday]}.</p>
        <Link to="/">Back to week</Link>
      </main>
    )
  }

  const dayPlan = day
  const currentProgress = progress
  const currentSettings = settings

  async function onFinish() {
    for (const lift of dayPlan.lifts) {
      const workout = workoutForLift(
        lift,
        currentProgress.cycleWeek,
        currentProgress.cycleNumber,
        currentSettings.unit,
        tested[lift.program.id] ?? false,
      )
      const rows = drafts[lift.program.id] ?? []
      const sets: LoggedSet[] = workout.sets.map((set, index) => {
        const draft = rows[index]
        const weight = Number(draft?.weight)
        const reps = Number(draft?.reps)
        return {
          role: set.role,
          percentTm: set.percentTm,
          prescribedReps: set.reps,
          isAmrap: set.isAmrap,
          weightLb: Number.isFinite(weight) && weight > 0 ? displayToLb(weight, currentSettings.unit) : set.weightLb,
          actualReps: Number.isFinite(reps) ? reps : set.reps,
        }
      })
      await upsertSessionLog({
        id: `${date}-${lift.program.id}`,
        date,
        programLiftId: lift.program.id,
        kind: workout.kind,
        cycleWeek: workout.kind === 'programmed' ? currentProgress.cycleWeek : null,
        cycleNumber: currentProgress.cycleNumber,
        sets,
        completedAt: Date.now(),
      })
      if (workout.kind === 'testing') {
        const top = sets.find((set) => set.role === 'test-top')
        if (top?.weightLb && top.actualReps) {
          const estimated = epley1RM(top.weightLb, top.actualReps)
          await updateProgramLift(lift.program.id, {
            oneRepMaxLb: estimated,
            trainingMaxLb: trainingMaxFrom1RM(estimated),
            needsTesting: false,
            addedInCycle: currentProgress.cycleNumber,
          })
        }
      }
    }
    setMessage('Session saved.')
    window.setTimeout(() => navigate('/'), 600)
  }

  return (
    <>
      <header className="topbar">
        <h1>{WEEKDAY_FULL[weekday]}</h1>
        <p className="muted">
          {date} · Cycle {progress.cycleNumber} · {weekLabel(progress.cycleWeek)}
        </p>
      </header>
      <main className="page">
        {day.lifts.map((lift) => {
          const workout = workoutForLift(
            lift,
            progress.cycleWeek,
            progress.cycleNumber,
            settings.unit,
            tested[lift.program.id] ?? false,
          )
          return (
            <LiftCard
              key={lift.program.id}
              name={lift.catalog.name}
              kind={workout.kind}
              unit={settings.unit}
              sets={workout.sets}
              drafts={drafts[lift.program.id] ?? []}
              onChange={(index, patch) => {
                setDrafts((current) => {
                  const rows = [...(current[lift.program.id] ?? [])]
                  rows[index] = { weight: rows[index]?.weight ?? '', reps: rows[index]?.reps ?? '', ...patch }
                  return { ...current, [lift.program.id]: rows }
                })
              }}
            />
          )
        })}
        {message ? <p className="ok">{message}</p> : null}
        <button className="btn" type="button" onClick={() => void onFinish()}>
          Finish session
        </button>
        <Link className="btn secondary" to="/">
          Back
        </Link>
      </main>
    </>
  )
}

function LiftCard({
  name,
  kind,
  unit,
  sets,
  drafts,
  onChange,
}: {
  name: string
  kind: string
  unit: Settings['unit']
  sets: WorkoutSet[]
  drafts: Draft[]
  onChange: (index: number, patch: Partial<Draft>) => void
}) {
  return (
    <section className="card">
      <div className="row">
        <h2>{name}</h2>
        <span className="badge">{kind === 'testing' ? 'Testing' : '5/3/1'}</span>
      </div>
      <div className="set-grid muted">
        <span>#</span>
        <span>Set</span>
        <span>Wt</span>
        <span>Reps</span>
      </div>
      {sets.map((set, index) => (
        <div className="set-grid" key={`${set.role}-${index}`}>
          <span>{index + 1}</span>
          <span>
            {set.role === 'bbb' ? 'BBB 10' : set.isAmrap ? `${set.reps}+` : `${set.reps}`}
            {set.percentTm != null ? ` · ${Math.round(set.percentTm * 100)}%` : ''}
          </span>
          <input
            className="input"
            inputMode="decimal"
            value={drafts[index]?.weight ?? ''}
            placeholder={set.displayWeight != null ? String(set.displayWeight) : unit}
            onChange={(e) => onChange(index, { weight: e.target.value })}
          />
          <input
            className="input"
            inputMode="numeric"
            value={drafts[index]?.reps ?? ''}
            placeholder={String(set.reps)}
            onChange={(e) => onChange(index, { reps: e.target.value })}
          />
          {set.restAfterSec > 0 ? <RestTimer seconds={set.restAfterSec} /> : null}
        </div>
      ))}
      <p className="muted">{sets[0]?.weightLb != null ? `Bar loads in ${formatWeight(sets[0].weightLb, unit)} units.` : 'Enter the top-set weight you actually lifted.'}</p>
    </section>
  )
}
