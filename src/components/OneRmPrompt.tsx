import type { WeightUnit } from '../types'

export function OneRmPrompt({
  knowsMax,
  onKnowsMax,
  maxInput,
  onMaxInput,
  unit,
}: {
  knowsMax: boolean | null
  onKnowsMax: (value: boolean) => void
  maxInput: string
  onMaxInput: (value: string) => void
  unit: WeightUnit
}) {
  return (
    <>
      <p className="kicker">Do you know your one-rep max?</p>
      <div className="choice">
        <button type="button" className="btn secondary" aria-pressed={knowsMax === true} onClick={() => onKnowsMax(true)}>
          Yes
        </button>
        <button type="button" className="btn secondary" aria-pressed={knowsMax === false} onClick={() => onKnowsMax(false)}>
          No — test it
        </button>
      </div>
      {knowsMax === true ? (
        <label className="field">
          1RM ({unit})
          <input
            className="input"
            inputMode="decimal"
            value={maxInput}
            onChange={(event) => onMaxInput(event.target.value)}
          />
        </label>
      ) : null}
      {knowsMax === false ? (
        <p className="callout">
          We’ll start with a testing workout, then estimate your 1RM from a hard set of 5+.
        </p>
      ) : null}
    </>
  )
}
