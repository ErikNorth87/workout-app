import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { catalogById } from '../data/lifts'
import { addProgramLift, getSettings } from '../db/store'
import { cycleProgress } from '../engine/dates'
import { displayToLb } from '../engine/trainingMax'

export function AddLiftPage() {
  const { catalogId } = useParams()
  const navigate = useNavigate()
  const lift = catalogId ? catalogById(catalogId) : undefined
  const [knowsMax, setKnowsMax] = useState<boolean | null>(null)
  const [maxInput, setMaxInput] = useState('')
  const [error, setError] = useState('')

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
        <h1>{lift.name}</h1>
        <p className="muted">Do you know your one-rep max?</p>
      </header>
      <main className="page">
        <div className="choice">
          <button type="button" className="btn secondary" aria-pressed={knowsMax === true} onClick={() => setKnowsMax(true)}>
            Yes
          </button>
          <button type="button" className="btn secondary" aria-pressed={knowsMax === false} onClick={() => setKnowsMax(false)}>
            No
          </button>
        </div>
        {knowsMax === true ? (
          <label className="card">
            1RM ({getSettingsUnitHint()})
            <input className="input" inputMode="decimal" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} />
          </label>
        ) : null}
        {knowsMax === false ? (
          <p className="card muted">We’ll start with a testing workout, then estimate your 1RM from a hard set of 5+.</p>
        ) : null}
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

function getSettingsUnitHint() {
  return 'lb or kg from Settings'
}
