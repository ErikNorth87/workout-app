import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { MuscleChips } from '../components/MuscleChips'
import { OneRmPrompt } from '../components/OneRmPrompt'
import { PATTERN_LABELS } from '../data/lifts'
import { catalogFromCustom, MUSCLE_ORDER, roleFromMuscles } from '../data/muscles'
import { addProgramLift, getSettings, saveCustomLift } from '../db/store'
import { cycleProgress } from '../engine/dates'
import { displayToLb } from '../engine/trainingMax'
import type { MuscleGroup, WeightUnit } from '../types'

export function CreateLiftPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [muscles, setMuscles] = useState<MuscleGroup[]>([])
  const [knowsMax, setKnowsMax] = useState<boolean | null>(null)
  const [maxInput, setMaxInput] = useState('')
  const [unit, setUnit] = useState<WeightUnit>('lb')
  const [error, setError] = useState('')

  useEffect(() => {
    void getSettings().then((settings) => setUnit(settings.unit))
  }, [])

  const role = muscles.length > 0 ? roleFromMuscles(muscles) : null

  function toggleMuscle(muscle: MuscleGroup) {
    setMuscles((current) =>
      current.includes(muscle) ? current.filter((item) => item !== muscle) : [...current, muscle],
    )
  }

  async function onSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name this lift.')
      return
    }
    if (muscles.length === 0) {
      setError('Pick at least one muscle so we can place it on the recovery split.')
      return
    }
    const settings = await getSettings()
    const progress = cycleProgress(settings.programStartIso, new Date())
    const catalog = catalogFromCustom({ name: trimmed, muscles })
    if (knowsMax === true) {
      const value = Number(maxInput)
      if (!Number.isFinite(value) || value <= 0) {
        setError('Enter a valid 1RM.')
        return
      }
      await saveCustomLift(catalog)
      await addProgramLift(catalog.id, {
        oneRepMaxLb: displayToLb(value, settings.unit),
        needsTesting: false,
        cycleNumber: progress.cycleNumber,
      })
    } else if (knowsMax === false) {
      await saveCustomLift(catalog)
      await addProgramLift(catalog.id, {
        oneRepMaxLb: null,
        needsTesting: true,
        cycleNumber: progress.cycleNumber,
      })
    } else {
      setError('Tell us if you know your 1RM.')
      return
    }
    navigate('/')
  }

  return (
    <>
      <header className="topbar">
        <p className="kicker">Custom lift</p>
        <h1>Create a workout</h1>
        <p className="muted">Name it, tag the muscles it hits, then we’ll slot it into 5/3/1 + BBB without stacking recovery the next day.</p>
      </header>
      <main className="page">
        <label className="field">
          Lift name
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Pause bench" />
        </label>
        <section className="card">
          <h2>Muscles</h2>
          <p className="muted">Select every muscle this lift trains. The scheduler uses that to keep overlapping work off consecutive days.</p>
          <MuscleChips muscles={MUSCLE_ORDER} selectable selected={muscles} onToggle={toggleMuscle} />
        </section>
        {role ? (
          <p className="callout">
            Scheduled as <strong>{PATTERN_LABELS[role.pattern]}</strong>
            {role.isMain ? ' · main 5/3/1 lift' : ' · accessory on a matching day'}.
          </p>
        ) : null}
        <OneRmPrompt
          knowsMax={knowsMax}
          onKnowsMax={setKnowsMax}
          maxInput={maxInput}
          onMaxInput={setMaxInput}
          unit={unit}
        />
        {error ? <p className="warn">{error}</p> : null}
        <button className="btn" type="button" onClick={() => void onSave()}>
          Add to program
        </button>
        <Link className="btn secondary" to="/library">
          Cancel
        </Link>
      </main>
    </>
  )
}
