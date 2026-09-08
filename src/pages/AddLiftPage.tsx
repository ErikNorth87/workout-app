import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { MuscleChips } from '../components/MuscleChips'
import { OneRmPrompt } from '../components/OneRmPrompt'
import { PATTERN_LABELS } from '../data/lifts'
import { addProgramLift, getSettings, resolveCatalog } from '../db/store'
import { cycleProgress } from '../engine/dates'
import { displayToLb } from '../engine/trainingMax'
import type { CatalogLift, WeightUnit } from '../types'

export function AddLiftPage() {
  const { catalogId } = useParams()
  const navigate = useNavigate()
  const [lift, setLift] = useState<CatalogLift | null | undefined>(undefined)
  const [unit, setUnit] = useState<WeightUnit>('lb')
  const [knowsMax, setKnowsMax] = useState<boolean | null>(null)
  const [maxInput, setMaxInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!catalogId) {
      setLift(null)
      return
    }
    void Promise.all([resolveCatalog(catalogId), getSettings()]).then(([next, settings]) => {
      setLift(next ?? null)
      setUnit(settings.unit)
    })
  }, [catalogId])

  if (lift === undefined) return <div className="page muted">Loading…</div>

  if (!lift) {
    return (
      <main className="page">
        <p>Lift not found.</p>
        <Link to="/library">Back to library</Link>
      </main>
    )
  }

  const catalogLift = lift

  async function onSave() {
    const settings = await getSettings()
    const progress = cycleProgress(settings.programStartIso, new Date())
    if (knowsMax === true) {
      const value = Number(maxInput)
      if (!Number.isFinite(value) || value <= 0) {
        setError('Enter a valid 1RM.')
        return
      }
      await addProgramLift(catalogLift.id, {
        oneRepMaxLb: displayToLb(value, settings.unit),
        needsTesting: false,
        cycleNumber: progress.cycleNumber,
      })
    } else if (knowsMax === false) {
      await addProgramLift(catalogLift.id, {
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
        <p className="kicker">{PATTERN_LABELS[lift.pattern]}</p>
        <h1>{lift.name}</h1>
        <MuscleChips muscles={lift.muscles} />
      </header>
      <main className="page">
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
