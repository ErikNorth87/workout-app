import { useEffect, useState } from 'react'
import { WEEKDAY_SHORT } from '../engine/dates'
import { clearAllData, getSettings, saveSettings } from '../db/store'
import type { Settings, WeightUnit } from '../types'

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]
const INSTALL_URL = 'https://eriknorth87.github.io/workout-app/'
const INSTALL_QR = `${import.meta.env.BASE_URL}install-qr.svg`

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    void getSettings().then(setSettings)
  }, [])

  if (!settings) return <div className="page muted">Loading…</div>

  async function patch(next: Partial<Settings>) {
    const saved = await saveSettings(next)
    setSettings(saved)
    setNote('Saved.')
  }

  return (
    <>
      <header className="topbar">
        <p className="kicker">Device</p>
        <h1>Settings</h1>
        <p className="muted">Local-only. Same install path as a plate calculator PWA.</p>
      </header>
      <main className="page">
        <section className="card">
          <h2>Weight unit</h2>
          <div className="choice">
            {(['lb', 'kg'] as WeightUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                className="btn secondary"
                aria-pressed={settings.unit === unit}
                onClick={() => void patch({ unit })}
              >
                {unit}
              </button>
            ))}
          </div>
        </section>
        <section className="card">
          <h2>Training days</h2>
          <p className="muted">Pick the days you can train. Conflicting muscle groups still will not land on consecutive days.</p>
          <div className="weekday-grid">
            {ALL_DAYS.map((day) => {
              const on = settings.weekdays.includes(day)
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const weekdays = on
                      ? settings.weekdays.filter((value) => value !== day)
                      : [...settings.weekdays, day].sort((a, b) => a - b)
                    void patch({ weekdays })
                  }}
                >
                  {WEEKDAY_SHORT[day]}
                </button>
              )
            })}
          </div>
        </section>
        <section className="card">
          <h2>Install on your phone</h2>
          <p className="muted">Scan this code, or open the link in Safari (iPhone) or Chrome (Android). Then: Share → Add to Home Screen, or Chrome menu → Install app.</p>
          <div className="install-qr">
            <img src={INSTALL_QR} alt="QR code to install Workout Tracker" width={256} height={256} />
            <a className="muted" href={INSTALL_URL}>
              {INSTALL_URL.replace('https://', '')}
            </a>
          </div>
        </section>
        <section className="card">
          <h2>Data</h2>
          <p className="muted">Everything stays on this device. Clearing data cannot be undone.</p>
          <button
            className="btn danger"
            type="button"
            onClick={() => {
              if (window.confirm('Clear all lifts and logs?')) {
                void clearAllData().then(() => {
                  setNote('Cleared.')
                  return getSettings().then(setSettings)
                })
              }
            }}
          >
            Clear all data
          </button>
        </section>
        {note ? <p className="ok">{note}</p> : null}
      </main>
    </>
  )
}
